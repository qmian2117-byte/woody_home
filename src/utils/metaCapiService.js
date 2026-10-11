import crypto from 'crypto';

/**
 * Hash string to SHA256 (required by Meta CAPI for PII like email, phone)
 */
const hashSha256 = (val) => {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
};

/**
 * Dispatch server-side event to Meta Conversions API
 */
export const trackMetaConversionEvent = async ({
  eventName,
  eventSourceUrl,
  userData = {},
  customData = {},
  eventId
}) => {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    // If not configured, log debug in dev environment
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Meta CAPI] 📡 Simulated '${eventName}' event dispatch:`, {
        eventId,
        value: customData.value,
        currency: customData.currency || 'PKR'
      });
    }
    return { success: true, simulated: true };
  }

  try {
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          event_source_url: eventSourceUrl || process.env.FRONTEND_URL || 'https://www.woodyhome.pk',
          action_source: 'website',
          user_data: {
            em: userData.email ? [hashSha256(userData.email)] : undefined,
            ph: userData.phone ? [hashSha256(userData.phone)] : undefined,
            client_ip_address: userData.ip,
            client_user_agent: userData.userAgent
          },
          custom_data: {
            currency: customData.currency || 'PKR',
            value: customData.value || 0,
            content_type: 'product',
            contents: customData.contents || [],
            num_items: customData.numItems || 1
          }
        }
      ]
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    console.error('[Meta CAPI] ❌ Failed to dispatch conversion event:', error.message);
    return { success: false, error: error.message };
  }
};
