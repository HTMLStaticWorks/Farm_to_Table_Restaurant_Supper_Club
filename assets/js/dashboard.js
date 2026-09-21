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
  const closeBtn = document.getElementById('dashboard-sidebar-close');
  const backdrop = document.getElementById('dashboard-sidebar-backdrop');
  const sidebar = document.getElementById('dashboard-sidebar');
  const shell = document.querySelector('.dash-layout-shell');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
        if (backdrop) backdrop.classList.toggle('active');
        document.body.classList.toggle('dash-sidebar-open');
      } else if (shell) {
        // Desktop collapse toggle
        shell.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', closeDashboardSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDashboardSidebar);
  }

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
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.classList.remove('dash-sidebar-open');
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
      setDashboardRole('admin');
      const targetHref = item.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetEl = document.querySelector(targetHref);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      closeDashboardSidebar();
    });
  });
}

function setDashboardRole(role) {
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
    document.querySelectorAll('[data-tab-target]').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-role-target="admin"]').forEach(item => item.classList.add('active'));
  } else {
    if (adminView) adminView.style.display = 'none';
    if (guestView) guestView.style.display = 'block';
    if (mobileAdminToggle) mobileAdminToggle.classList.remove('active');
    document.querySelectorAll('[data-role-target="admin"]').forEach(item => item.classList.remove('active'));
    // Restore default or current guest tab
    const activeGuestTab = document.querySelector('.dash-nav-tab.active') || document.querySelector('[data-tab-target="guest-tab-bookings"]');
    if (activeGuestTab) {
      const tabTarget = activeGuestTab.getAttribute('data-tab-target');
      switchDashboardTab(tabTarget);
    }
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
      switchDashboardTab(targetId);
    });
  });
}

function switchDashboardTab(targetId) {
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

  // Update active state across navigation elements linking to this tab
  document.querySelectorAll('[data-tab-target]').forEach(t => {
    if (t.classList.contains('dash-nav-tab') || t.classList.contains('sidebar-link') || t.classList.contains('dock-item')) {
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

