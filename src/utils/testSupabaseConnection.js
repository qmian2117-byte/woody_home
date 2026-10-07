import { supabase } from '../config/supabase.js';

async function testConnection() {
  console.log('Testing connection to Supabase:', process.env.SUPABASE_URL);
  try {
    const { data, error } = await supabase.from('products').select('count');
    if (error) {
      console.log('Supabase Connection Status: Connected to project, but table check returned:');
      console.log('Message:', error.message);
      console.log('Code:', error.code);
      if (error.code === 'PGRST205' || error.message?.includes('does not exist') || error.code === '42P01') {
        console.log('\n💡 Note: This means your Supabase project is CONNECTED, but you still need to run `supabase/schema.sql` in your Supabase SQL Editor to create the tables!');
      }
    } else {
      console.log('✅ Supabase connected successfully and `products` table exists!');
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
