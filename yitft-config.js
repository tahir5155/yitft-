// ============================================================
// YITFT — Supabase connection settings
// Ye file har page mein use hoti hai (signup, login, profile, browse)
// ============================================================

const SUPABASE_URL = "https://vtzklukbojyyzkngyopx.supabase.co";

// ⬇️ YAHAN APNI PUBLISHABLE KEY PASTE KARO (quotes ke andar)
// Supabase dashboard → Project Settings → API Keys → Publishable key
const SUPABASE_KEY = "sb_publishable_MZuGTjRusx05QK5YHcZUKQ_hz4Jxjht";

// Database client — is se sab pages baat karte hain
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);