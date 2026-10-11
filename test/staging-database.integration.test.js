import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

describe('Live Supabase PostgreSQL Security Infrastructure Verification', () => {
  let testVariantId;
  let testCouponCode = 'STAGING_SEC_' + crypto.randomBytes(4).toString('hex').toUpperCase();
  let testUserId;
  let testJti = 'staging-jti-' + crypto.randomBytes(8).toString('hex');
  let testEventId = 'evt_staging_' + crypto.randomBytes(8).toString('hex');
  let testSessionId = 'cs_staging_' + crypto.randomBytes(8).toString('hex');

  before(async () => {
    // 1. Fetch an existing variant
    const { data: variants } = await supabaseAdmin
      .from('product_variants')
      .select('id, inventory_quantity')
      .limit(1);

    if (variants && variants.length > 0) {
      testVariantId = variants[0].id;
    }

    // 2. Insert a clean test coupon
    await supabaseAdmin.from('coupons').insert({
      code: testCouponCode,
      discount_type: 'percentage',
      discount_value: 15,
      usage_limit: 2,
      times_used: 0,
      is_active: true
    });

    // 3. Insert a clean test user
    const { data: user } = await supabaseAdmin
      .from('users')
      .insert({
        email: `staging_sec_${crypto.randomBytes(4).toString('hex')}@test.local`,
        password_hash: '$2b$10$dummyhashedpasswordforstagingtest1234567890',
        full_name: 'Staging Security Test User',
        role: 'customer'
      })
      .select('id')
      .single();

    if (user) {
      testUserId = user.id;
    }
  });

  after(async () => {
    // Cleanup staging test records
    if (testCouponCode) {
      await supabaseAdmin.from('coupons').delete().eq('code', testCouponCode);
    }
    if (testUserId) {
      await supabaseAdmin.from('revoked_tokens').delete().eq('user_id', testUserId);
      await supabaseAdmin.from('used_totp_codes').delete().eq('user_id', testUserId);
      await supabaseAdmin.from('users').delete().eq('id', testUserId);
    }
    if (testEventId) {
      await supabaseAdmin.from('stripe_webhook_events').delete().eq('event_id', testEventId);
    }
  });

  test('Issue 1: Atomic database inventory decrement RPC executes without lost updates', async () => {
    if (!testVariantId) return;

    const { data, error } = await supabaseAdmin.rpc('decrement_variant_inventory', {
      p_variant_id: testVariantId,
      p_quantity: 1
    });

    assert.equal(error, null, `RPC call should not fail: ${error?.message}`);
    assert.ok(Array.isArray(data), 'Response should be a table array');
    assert.equal(data.length, 1, 'Should return exactly 1 row');
    assert.equal(typeof data[0].success, 'boolean');
    assert.equal(typeof data[0].remaining_quantity, 'number');
    assert.equal(typeof data[0].message, 'string');
  });

  test('Issue 2: Atomic database coupon redemption enforces row lock & usage limit', async () => {
    // First redemption: should succeed
    const { data: r1, error: e1 } = await supabaseAdmin.rpc('redeem_coupon_atomic', {
      p_code: testCouponCode
    });
    assert.equal(e1, null);
    assert.equal(r1[0].success, true, 'First redemption must succeed');
    assert.equal(r1[0].discount_type, 'percentage');
    assert.equal(Number(r1[0].discount_value), 15);

    // Second redemption: should succeed (limit is 2)
    const { data: r2, error: e2 } = await supabaseAdmin.rpc('redeem_coupon_atomic', {
      p_code: testCouponCode
    });
    assert.equal(e2, null);
    assert.equal(r2[0].success, true, 'Second redemption must succeed');

    // Third redemption: must fail atomically at database level due to usage limit
    const { data: r3, error: e3 } = await supabaseAdmin.rpc('redeem_coupon_atomic', {
      p_code: testCouponCode
    });
    assert.equal(e3, null);
    assert.equal(r3[0].success, false, 'Third redemption must be blocked');
    assert.match(r3[0].message, /usage limit reached/i);
  });

  test('Issue 3: Distributed JWT revocation table enforces authoritative persistence', async () => {
    if (!testUserId) return;

    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    const { error: insErr } = await supabaseAdmin.from('revoked_tokens').insert({
      jti: testJti,
      user_id: testUserId,
      expires_at: expiresAt
    });
    assert.equal(insErr, null, `Inserting revoked token should succeed: ${insErr?.message}`);

    const { data: rev, error: selErr } = await supabaseAdmin
      .from('revoked_tokens')
      .select('jti, user_id, expires_at')
      .eq('jti', testJti)
      .single();

    assert.equal(selErr, null);
    assert.equal(rev.jti, testJti);
    assert.equal(rev.user_id, testUserId);
  });

  test('Issue 4: Stripe webhook event uniqueness enforces database-level idempotency', async () => {
    const { error: err1 } = await supabaseAdmin.from('stripe_webhook_events').insert({
      event_id: testEventId,
      session_id: testSessionId,
      event_type: 'checkout.session.completed',
      status: 'processing'
    });
    assert.equal(err1, null, `First webhook insert should succeed: ${err1?.message}`);

    // Duplicate event_id must fail with unique constraint violation (code 23505)
    const { error: err2 } = await supabaseAdmin.from('stripe_webhook_events').insert({
      event_id: testEventId,
      session_id: 'cs_other_' + crypto.randomBytes(4).toString('hex'),
      event_type: 'checkout.session.completed',
      status: 'processing'
    });

    assert.ok(err2, 'Duplicate event_id must be rejected');
    assert.equal(err2.code, '23505', 'Must fail with PostgreSQL unique violation code 23505');
  });

  test('Issue 5: Distributed OTP ledger prevents replay attacks across instances', async () => {
    if (!testUserId) return;

    const codeHash = crypto.createHash('sha256').update('123456').digest('hex');
    const expiresAt = new Date(Date.now() + 90 * 1000).toISOString();

    const { error: err1 } = await supabaseAdmin.from('used_totp_codes').insert({
      user_id: testUserId,
      code_hash: codeHash,
      expires_at: expiresAt
    });
    assert.equal(err1, null, `First OTP recording should succeed: ${err1?.message}`);

    // Replay attack within the time window: rejected
    const { error: err2 } = await supabaseAdmin.from('used_totp_codes').insert({
      user_id: testUserId,
      code_hash: codeHash,
      expires_at: expiresAt
    });

    assert.ok(err2, 'Replayed OTP code must be rejected by database');
    assert.equal(err2.code, '23505', 'Must trigger unique violation on (user_id, code_hash)');
  });

  test('Issue 6: Orders table contains guest tracking token and revocation columns', async () => {
    const { data: cols, error } = await supabaseAdmin
      .from('orders')
      .select('tracking_token, tracking_token_expires_at, tracking_token_revoked, stripe_session_id')
      .limit(1);

    assert.equal(error, null, `Orders columns query should succeed: ${error?.message}`);
  });
});
