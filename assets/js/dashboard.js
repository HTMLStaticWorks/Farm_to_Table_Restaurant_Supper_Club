/**
 * HARVEST & HEARTH — DASHBOARD INTERACTIVITY
 * Supports dual-role views (Guest Portal & Kitchen/Admin Portal), tab switching,
 * reservation management, concierge chat messaging, dietary tag toggling, and service manifest filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoleSwitcher();
  initDashboardTabs();
  initReservationStatusUpdater();
  initGuestActionHandlers();
  initDietaryTags();
  initConciergeChat();
  initManifestFilter();
});

function initRoleSwitcher() {
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const guestView = document.getElementById('guest-dashboard-view');
  const adminView = document.getElementById('admin-dashboard-view');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetRole = btn.getAttribute('data-role');
      if (targetRole === 'admin') {
        if (guestView) guestView.style.display = 'none';
        if (adminView) adminView.style.display = 'block';
      } else {
        if (adminView) adminView.style.display = 'none';
        if (guestView) guestView.style.display = 'block';
      }
    });
  });
}

function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dash-nav-tab');
  tabLinks.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const parentContainer = tab.closest('.dashboard-view-container');
      if (!parentContainer) return;

      parentContainer.querySelectorAll('.dash-nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab-target');
      parentContainer.querySelectorAll('.dash-tab-pane').forEach(pane => {
        pane.style.display = 'none';
      });

      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
      }
    });
  });
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

