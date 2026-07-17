// ============================================================
// YITFT — Shared notification helpers.
// Load AFTER yitft-config.js (needs the `sb` client).
// Used by: profile.html, browse.html, settings.html, inbox.html, chat.html
// ============================================================

// Gets the logged-in user's session + their profile row (or null)
async function yitftGetMe(){
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
  return profile ? { session, profile } : null;
}

// Counts conversations that have a new message I haven't read yet
async function yitftUnreadCount(me){
  if (!me) return 0;
  const isBrand = me.profile.role === 'brand';
  const idField = isBrand ? 'brand_id' : 'creator_id';
  const readField = isBrand ? 'brand_last_read_at' : 'creator_last_read_at';
  const deletedField = isBrand ? 'deleted_by_brand' : 'deleted_by_creator';

  const { data: convos } = await sb.from('conversations')
    .select('*')
    .eq(idField, me.session.user.id)
    .eq(deletedField, false);

  if (!convos) return 0;
  return convos.filter(c =>
    c.last_message_preview && new Date(c.last_message_at) > new Date(c[readField])
  ).length;
}

// Sets up the bell icon + red badge in the nav bar. Call this on every page.
// bellLinkId = the <a> wrapping the bell, badgeId = the small count bubble inside it
async function yitftInitBell(bellLinkId, badgeId){
  const me = await yitftGetMe();
  const bell = document.getElementById(bellLinkId);
  const badge = document.getElementById(badgeId);
  if (!me){ if (bell) bell.style.display = 'none'; return me; }
  if (bell) bell.style.display = 'inline-flex';
  const count = await yitftUnreadCount(me);
  if (badge){
    if (count > 0){ badge.textContent = count > 9 ? '9+' : count; badge.style.display = 'flex'; }
    else badge.style.display = 'none';
  }
  return me;
}

// Simple "5m ago", "3h ago", "2d ago" style time formatting
function yitftTimeAgo(dateStr){
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff/86400) + 'd ago';
  return new Date(dateStr).toLocaleDateString();
}

// Counts deals waiting for admin action (payments to verify + payouts to release).
// Only meaningful for admin accounts — returns 0 for everyone else.
async function yitftAdminPendingCount(me){
  if (!me || !me.profile.is_admin) return 0;
  const { count } = await sb.from('deals')
    .select('id', { count: 'exact', head: true })
    .in('status', ['payment_submitted', 'approved']);
  return count || 0;
}