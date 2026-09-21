/**
 * HARVEST & HEARTH — DASHBOARD INTERACTIVITY
 * Supports dual-role views (Guest Portal & Kitchen/Admin Portal), sidebar menu navigation,
 * mobile drawer toggle, reservation management, concierge chat messaging, dietary tag toggling,
 * and service manifest filtering across all devices.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initRoleSwitcher();
  initDashboardTabs();
  initReservationStatusUpdater();
  initGuestActionHandlers();
  initDietaryTags();
  initConciergeChat();
  initManifestFilter();
});

/* ==========================================================================
   1. DASHBOARD SIDEBAR TOGGLE & DRAWER (ALL DEVICES)
   ========================================================================== */
function initDashboardSidebar() {
  const toggleBtn = document.getElementById('dashboard-sidebar-toggle');
  const hamburgerBtn = document.getElementById('dash-hamburger-btn');
  const closeBtn = document.getElementById('dashboard-sidebar-close');
  const backdrop = document.getElementById('dashboard-sidebar-backdrop');
  const sidebar = document.getElementById('dashboard-sidebar');
  const shell = document.querySelector('.dash-layout-shell');

  function toggleSidebar() {
    if (window.innerWidth <= 1024) {
      const isActive = sidebar.classList.toggle('active');
      if (backdrop) backdrop.classList.toggle('active');
      document.body.classList.toggle('dash-sidebar-open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    } else if (shell) {
      shell.classList.toggle('sidebar-collapsed');
    }
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }

  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', closeDashboardSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDashboardSidebar);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
      closeDashboardSidebar();
    }
  });

  // Handle window resize cleanly
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeDashboardSidebar();
    }
  }, { passive: true });
}

function closeDashboardSidebar() {
  const sidebar = document.getElementById('dashboard-sidebar');
  const backdrop = document.getElementById('dashboard-sidebar-backdrop');
  const hamburgerBtn = document.getElementById('dash-hamburger-btn');
  const toggleBtn = document.getElementById('dashboard-sidebar-toggle');
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.classList.remove('dash-sidebar-open');
  if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

/* ==========================================================================
   2. ROLE SWITCHER (GUEST SANCTUARY VS KITCHEN ADMIN)
   ========================================================================== */
function initRoleSwitcher() {
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const mobileAdminToggle = document.getElementById('mobile-dock-admin-toggle');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-role');
      setDashboardRole(targetRole);
    });
  });

  if (mobileAdminToggle) {
    mobileAdminToggle.addEventListener('click', () => {
      const adminView = document.getElementById('admin-dashboard-view');
      const isCurrentlyAdmin = adminView && adminView.style.display !== 'none';
      setDashboardRole(isCurrentlyAdmin ? 'guest' : 'admin');
    });
  }

  // Handle sidebar items targeting admin sections directly
  const adminNavItems = document.querySelectorAll('[data-role-target="admin"]');
  adminNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      setDashboardRole('admin', false);

      // Deactivate all sidebar items and activate only the clicked admin item
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetHref = item.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetEl = document.querySelector(targetHref);
        if (targetEl) {
          const topbarHeight = 76;
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset - topbarHeight;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }
      closeDashboardSidebar();
    });
  });
}

function setDashboardRole(role, activateFirstAdmin = true) {
  const guestView = document.getElementById('guest-dashboard-view');
  const adminView = document.getElementById('admin-dashboard-view');
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const mobileAdminToggle = document.getElementById('mobile-dock-admin-toggle');

  roleButtons.forEach(b => {
    if (b.getAttribute('data-role') === role) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  if (role === 'admin') {
    if (guestView) guestView.style.display = 'none';
    if (adminView) adminView.style.display = 'block';
    if (mobileAdminToggle) mobileAdminToggle.classList.add('active');

    // Deactivate guest tabs in sidebar, tabs bar, and dock
    document.querySelectorAll('[data-tab-target]').forEach(t => t.classList.remove('active'));

    if (activateFirstAdmin) {
      document.querySelectorAll('[data-role-target="admin"]').forEach(item => item.classList.remove('active'));
      const firstAdminItem = document.querySelector('[data-role-target="admin"]');
      if (firstAdminItem) firstAdminItem.classList.add('active');

      if (adminView) {
        const topbarHeight = 76;
        const y = adminView.getBoundingClientRect().top + window.pageYOffset - topbarHeight;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  } else {
    if (adminView) adminView.style.display = 'none';
    if (guestView) guestView.style.display = 'block';
    if (mobileAdminToggle) mobileAdminToggle.classList.remove('active');

    // Deactivate admin sidebar items
    document.querySelectorAll('[data-role-target="admin"]').forEach(item => item.classList.remove('active'));

    // Restore active guest tab
    const activeGuestTab = document.querySelector('.dash-nav-tab.active') ||
      document.querySelector('.sidebar-nav-item[data-tab-target].active') ||
      document.querySelector('[data-tab-target="guest-tab-bookings"]');
    const tabTarget = activeGuestTab ? activeGuestTab.getAttribute('data-tab-target') : 'guest-tab-bookings';
    switchDashboardTab(tabTarget, false);
  }

  closeDashboardSidebar();
}

/* ==========================================================================
   3. GUEST DASHBOARD TAB SWITCHING (ALL DEVICES & CONTROLS)
   ========================================================================== */
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('[data-tab-target]');
  tabLinks.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab-target');
      // Scroll smoothly into view when clicked from sidebar, mobile dock, or banner buttons
      const shouldScroll = tab.classList.contains('sidebar-nav-item') ||
        tab.classList.contains('dash-dock-item') ||
        tab.classList.contains('btn');
      switchDashboardTab(targetId, shouldScroll);
    });
  });

  // Handle URL hash on initial load if present
  if (window.location.hash) {
    const hash = window.location.hash;
    const tabMatch = document.querySelector(`[data-tab-target="${hash.substring(1)}"]`);
    const adminMatch = document.querySelector(`[data-role-target="admin"][href="${hash}"]`);
    if (tabMatch) {
      switchDashboardTab(hash.substring(1), true);
    } else if (adminMatch) {
      adminMatch.click();
    }
  }
}

function switchDashboardTab(targetId, shouldScroll = false) {
  if (!targetId) return;

  // Make sure we are in Guest view
  const guestView = document.getElementById('guest-dashboard-view');
  const adminView = document.getElementById('admin-dashboard-view');
  if (guestView) guestView.style.display = 'block';
  if (adminView) adminView.style.display = 'none';

  // Sync role buttons
  document.querySelectorAll('.role-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-role') === 'guest') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  const mobileAdminToggle = document.getElementById('mobile-dock-admin-toggle');
  if (mobileAdminToggle) mobileAdminToggle.classList.remove('active');

  // Deactivate all admin items in sidebar
  document.querySelectorAll('[data-role-target="admin"]').forEach(item => item.classList.remove('active'));

  // Update active state across all navigation elements linking to this tab:
  // - Sidebar items (.sidebar-nav-item)
  // - Horizontal tabs bar (.dash-nav-tab)
  // - Mobile bottom dock (.dash-dock-item)
  document.querySelectorAll('[data-tab-target]').forEach(t => {
    if (
      t.classList.contains('sidebar-nav-item') ||
      t.classList.contains('dash-nav-tab') ||
      t.classList.contains('dash-dock-item') ||
      t.classList.contains('sidebar-link') ||
      t.classList.contains('dock-item')
    ) {
      if (t.getAttribute('data-tab-target') === targetId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    }
  });

  // Display target tab pane
  const panes = document.querySelectorAll('#guest-dashboard-view .dash-tab-pane');
  panes.forEach(pane => {
    pane.style.display = 'none';
  });

  const targetPane = document.getElementById(targetId);
  if (targetPane) {
    targetPane.style.display = 'block';

    if (shouldScroll) {
      const tabsBar = document.querySelector('.dash-tabs-bar');
      const scrollTarget = tabsBar || targetPane;
      if (scrollTarget) {
        const topbarHeight = 76;
        const y = scrollTarget.getBoundingClientRect().top + window.pageYOffset - topbarHeight;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  }

  closeDashboardSidebar();
}

function initReservationStatusUpdater() {
  const statusSelectors = document.querySelectorAll('.status-select');
  statusSelectors.forEach(select => {
    select.addEventListener('change', (e) => {
      const badge = select.closest('tr').querySelector('.badge-status');
      if (!badge) return;

      const newStatus = e.target.value;
      badge.className = 'badge-status ' + newStatus;
      badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    });
  });
}

function initGuestActionHandlers() {
  const cancelButtons = document.querySelectorAll('.btn-cancel-reservation');
  cancelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you wish to cancel this reservation for the Supper Club?')) {
        const row = btn.closest('.luxury-ticket') || btn.closest('.reservation-card') || btn.closest('tr');
        if (row) {
          row.style.opacity = '0.45';
          row.style.filter = 'grayscale(0.6)';
          btn.innerHTML = '<i class="ri-close-line"></i> Cancelled';
          btn.disabled = true;
          btn.style.pointerEvents = 'none';
        }
      }
    });
  });
}

/* 5. Dietary Tag Toggle */
function initDietaryTags() {
  const tags = document.querySelectorAll('.dietary-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  const dietaryForm = document.getElementById('dietary-form');
  if (dietaryForm) {
    dietaryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const banner = document.getElementById('dietary-save-feedback');
      if (banner) {
        banner.style.display = 'flex';
        setTimeout(() => {
          banner.style.display = 'none';
        }, 3500);
      }
    });
  }
}

/* 6. Concierge Chat Messaging */
function initConciergeChat() {
  const chatForm = document.getElementById('concierge-chat-form');
  const chatInput = document.getElementById('concierge-chat-input');
  const chatContainer = document.getElementById('concierge-chat-messages');

  if (!chatForm || !chatInput || !chatContainer) return;

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append outgoing message
    const outMsg = document.createElement('div');
    outMsg.className = 'chat-msg outgoing';
    outMsg.innerHTML = `
      <p style="margin: 0;">${escapeHtml(text)}</p>
      <div class="chat-msg-meta"><span>You</span><span>${timeString}</span></div>
    `;
    chatContainer.appendChild(outMsg);
    chatInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Simulated Chef response
    setTimeout(() => {
      const inMsg = document.createElement('div');
      inMsg.className = 'chat-msg incoming';
      inMsg.innerHTML = `
        <strong style="font-size: 0.82rem; color: var(--color-secondary); display: block; margin-bottom: 2px;">Chef Arlo Vance</strong>
        <p style="margin: 0;">Thank you Claire! Noted with pleasure. Our hearth team is at your complete service.</p>
        <div class="chat-msg-meta"><span style="color: var(--color-text-muted);">Executive Chef</span><span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
      `;
      chatContainer.appendChild(inMsg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 900);
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* 7. Service Manifest Filter */
function initManifestFilter() {
  const searchInput = document.getElementById('manifest-search');
  const timeFilter = document.getElementById('manifest-time-filter');
  const rows = document.querySelectorAll('#manifest-tbody tr');

  function filterRows() {
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const t = timeFilter ? timeFilter.value : 'all';

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchesText = !q || text.includes(q);
      const matchesTime = t === 'all' || text.includes(t);

      if (matchesText && matchesTime) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterRows);
  if (timeFilter) timeFilter.addEventListener('change', filterRows);
}

