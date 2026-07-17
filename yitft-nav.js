// ============================================================
// YITFT — Shared Navigation Bar
// One nav to rule all pages. Include AFTER yitft-config.js and
// yitft-notif.js. Each page just needs this near the top of <body>:
//     <div id="yitftNav"></div>
// The bar auto-detects login state and renders the right version:
//   - Logged out → Home | Browse Creators | Log in | Sign Up (button)
//   - Logged in  → Home | Browse Creators | Messages (✉️ + unread badge)
//                  | Avatar (photo or initials) → dropdown menu
// ============================================================

(function(){
  const NAV_CSS = `
    #yitftNav, #yitftNav *{box-sizing:border-box}
    .yn-bar{
      display:flex;align-items:center;justify-content:space-between;
      padding:14px 22px;background:#fff;border-bottom:1px solid #E4E9EE;
      font-family:'Inter',sans-serif;position:relative;z-index:200;
    }
    .yn-logo{font-family:'Sora',sans-serif;font-weight:800;font-size:1.25rem;text-decoration:none;color:#0B1B2B}
    .yn-logo span{color:#0E9F6E}
    .yn-links{display:flex;align-items:center;gap:16px}
    .yn-link{color:#5A6B7C;text-decoration:none;font-size:.9rem;font-weight:500;white-space:nowrap}
    .yn-link:hover,.yn-link.active{color:#0B1B2B}
    .yn-signup{
      background:#0E9F6E;color:#fff;text-decoration:none;font-weight:600;
      font-size:.88rem;padding:9px 20px;border-radius:99px;transition:background .15s;white-space:nowrap;
    }
    .yn-signup:hover{background:#0B7A55}
    .yn-icon-btn{
      position:relative;display:flex;align-items:center;justify-content:center;
      width:38px;height:38px;border-radius:50%;text-decoration:none;color:#0B1B2B;
      font-size:1.05rem;transition:background .15s;flex-shrink:0;
    }
    .yn-icon-btn:hover{background:#F6F8FA}
    .yn-badge{
      position:absolute;top:0;right:0;background:#E23B3B;color:#fff;
      font-size:.6rem;font-weight:700;min-width:16px;height:16px;border-radius:99px;
      display:flex;align-items:center;justify-content:center;padding:0 4px;
    }
    .yn-avatar-wrap{position:relative}
    .yn-avatar-btn{
      width:38px;height:38px;border-radius:50%;overflow:hidden;cursor:pointer;
      background:linear-gradient(135deg,#0E9F6E,#3BC9A0);border:2px solid transparent;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
      font-family:'Sora',sans-serif;font-weight:800;font-size:.9rem;color:#fff;
      transition:border-color .15s;
    }
    .yn-avatar-btn:hover{border-color:#0E9F6E}
    .yn-avatar-btn img{width:100%;height:100%;object-fit:cover}
    .yn-dropdown{
      position:absolute;top:50px;right:0;background:#fff;border:1px solid #E4E9EE;
      border-radius:14px;box-shadow:0 14px 40px rgba(11,27,43,.14);width:230px;
      overflow:hidden;display:none;
    }
    .yn-dropdown.open{display:block}
    .yn-dd-head{padding:16px 18px;border-bottom:1px solid #E4E9EE}
    .yn-dd-name{font-family:'Sora',sans-serif;font-weight:700;font-size:.95rem;color:#0B1B2B}
    .yn-dd-role{
      display:inline-block;margin-top:5px;font-size:.68rem;font-weight:600;
      letter-spacing:.05em;text-transform:uppercase;background:#E6F6F0;color:#0B7A55;
      padding:3px 10px;border-radius:99px;
    }
    .yn-dd-item{
      display:flex;align-items:center;gap:10px;padding:12px 18px;color:#0B1B2B;
      text-decoration:none;font-size:.9rem;cursor:pointer;border:none;background:none;
      width:100%;text-align:left;font-family:'Inter',sans-serif;
    }
    .yn-dd-item:hover{background:#F6F8FA}
    .yn-dd-item .ic{width:18px;text-align:center;flex-shrink:0}
    .yn-dd-divider{border-top:1px solid #E4E9EE;margin:4px 0}
    .yn-dd-item.danger{color:#C0392B}
    @media (max-width:640px){
      .yn-link{display:none}
      .yn-links{gap:10px}
    }
  `;

  function esc(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
  function initials(name){ return (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

  function injectCSS(){
    if (document.getElementById('yitft-nav-css')) return;
    const style = document.createElement('style');
    style.id = 'yitft-nav-css';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);
  }

  function loggedOutHTML(){
    return `
      <div class="yn-bar">
        <a class="yn-logo" href="index.html">YIT<span>FT</span></a>
        <div class="yn-links">
          <a class="yn-link" href="browse.html">Browse Creators</a>
          <a class="yn-link" href="login.html">Log in</a>
          <a class="yn-signup" href="signup.html">Sign Up</a>
        </div>
      </div>`;
  }

  function loggedInHTML(me, unread, adminPending){
    const p = me.profile;
    const avatarInner = p.photo ? `<img src="${p.photo}">` : initials(p.name);
    const badgeHTML = unread > 0 ? `<span class="yn-badge">${unread > 9 ? '9+' : unread}</span>` : '';
    const adminBadgeHTML = adminPending > 0 ? `<span class="yn-badge">${adminPending > 9 ? '9+' : adminPending}</span>` : '';
    const adminIconHTML = p.is_admin
      ? `<a class="yn-icon-btn" href="admin.html" title="Admin panel">🛡️${adminBadgeHTML}</a>`
      : '';
    return `
      <div class="yn-bar">
        <a class="yn-logo" href="browse.html">YIT<span>FT</span></a>
        <div class="yn-links">
          <a class="yn-link" href="browse.html">Browse Creators</a>
          <a class="yn-icon-btn" href="inbox.html" title="Messages">✉️${badgeHTML}</a>
          ${adminIconHTML}
          <div class="yn-avatar-wrap">
            <div class="yn-avatar-btn" id="ynAvatarBtn">${avatarInner}</div>
            <div class="yn-dropdown" id="ynDropdown">
              <div class="yn-dd-head">
                <div class="yn-dd-name">${esc(p.name)}</div>
                <span class="yn-dd-role">${p.role === 'creator' ? 'Creator' : 'Brand'}</span>
              </div>
              <a class="yn-dd-item" href="profile.html"><span class="ic">👤</span> My Profile</a>
              <a class="yn-dd-item" href="inbox.html"><span class="ic">✉️</span> Messages</a>
              <a class="yn-dd-item" href="settings.html"><span class="ic">⚙️</span> Settings</a>
              ${p.is_admin ? `<a class="yn-dd-item" href="admin.html"><span class="ic">🛡️</span> Admin Panel</a>` : ''}
              <div class="yn-dd-divider"></div>
              <button class="yn-dd-item danger" id="ynSignOut"><span class="ic">↪</span> Sign out</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  async function render(){
    const container = document.getElementById('yitftNav');
    if (!container) return;
    injectCSS();

    const me = (typeof yitftGetMe === 'function') ? await yitftGetMe() : null;

    if (!me){
      container.innerHTML = loggedOutHTML();
      return;
    }

    const unread = (typeof yitftUnreadCount === 'function') ? await yitftUnreadCount(me) : 0;
    const adminPending = (typeof yitftAdminPendingCount === 'function') ? await yitftAdminPendingCount(me) : 0;
    container.innerHTML = loggedInHTML(me, unread, adminPending);

    // Highlight the current page's link
    const path = window.location.pathname.split('/').pop();
    container.querySelectorAll('.yn-link').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Dropdown open/close
    const avatarBtn = document.getElementById('ynAvatarBtn');
    const dropdown = document.getElementById('ynDropdown');
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Sign out
    document.getElementById('ynSignOut').addEventListener('click', async () => {
      await sb.auth.signOut();
      window.location.href = 'login.html';
    });
  }

  document.addEventListener('DOMContentLoaded', render);

  // Let pages force a re-render if needed (e.g. after profile photo update)
  window.yitftRenderNav = render;
})();