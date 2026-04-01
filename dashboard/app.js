const DEFAULT_CONFIG = {
  username: "reapsed",
  avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  bio: "welcome to my page",
  badge: "",
  accentColor: "#7c3aed",
  bgStyle: "particles",
  music: { enabled: false, title: "", artist: "", url: "" },
  links: [
    { label: "Discord", url: "https://discord.com", icon: "discord" },
    { label: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { label: "GitHub", url: "https://github.com", icon: "github" }
  ],
  statusDot: true
};

const ICON_OPTIONS = ['discord', 'twitter', 'github', 'youtube', 'twitch', 'spotify', 'steam', 'instagram', 'mail', 'link'];

let config = loadConfig();
let currentSection = 'profile';

function loadConfig() {
  const saved = localStorage.getItem('bioConfig');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function saveConfig() {
  localStorage.setItem('bioConfig', JSON.stringify(config));
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const section = btn.dataset.section;
    currentSection = section;

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');

    document.getElementById('sectionTitle').textContent = btn.textContent.trim();
  });
});

// Load values into form
function populateForm() {
  document.getElementById('inputUsername').value = config.username;
  document.getElementById('inputAvatar').value = config.avatar;
  document.getElementById('inputBadge').value = config.badge;
  document.getElementById('inputBio').value = config.bio;
  document.getElementById('inputStatusDot').checked = config.statusDot;
  document.getElementById('bioCount').textContent = config.bio.length;

  document.getElementById('inputColor').value = config.accentColor;
  document.getElementById('inputColorHex').value = config.accentColor;

  document.getElementById('inputMusicEnabled').checked = config.music.enabled;
  document.getElementById('inputMusicTitle').value = config.music.title;
  document.getElementById('inputMusicArtist').value = config.music.artist;
  document.getElementById('inputMusicUrl').value = config.music.url;

  // Avatar preview
  document.getElementById('avatarPreview').src = config.avatar;

  // BG style
  document.querySelectorAll('.bg-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.bg === config.bgStyle);
  });

  // Color presets
  document.querySelectorAll('.color-preset').forEach(preset => {
    preset.classList.toggle('active', preset.dataset.color === config.accentColor);
  });

  renderLinks();
}

// Live preview - avatar
document.getElementById('inputAvatar').addEventListener('input', (e) => {
  document.getElementById('avatarPreview').src = e.target.value || 'https://cdn.discordapp.com/embed/avatars/0.png';
});

// Bio counter
document.getElementById('inputBio').addEventListener('input', (e) => {
  document.getElementById('bioCount').textContent = e.target.value.length;
});

// Color picker sync
document.getElementById('inputColor').addEventListener('input', (e) => {
  document.getElementById('inputColorHex').value = e.target.value;
  updateColorPresets(e.target.value);
});

document.getElementById('inputColorHex').addEventListener('input', (e) => {
  const val = e.target.value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    document.getElementById('inputColor').value = val;
    updateColorPresets(val);
  }
});

document.querySelectorAll('.color-preset').forEach(preset => {
  preset.addEventListener('click', () => {
    const color = preset.dataset.color;
    document.getElementById('inputColor').value = color;
    document.getElementById('inputColorHex').value = color;
    updateColorPresets(color);
  });
});

function updateColorPresets(activeColor) {
  document.querySelectorAll('.color-preset').forEach(p => {
    p.classList.toggle('active', p.dataset.color === activeColor);
  });
}

// Background style
document.querySelectorAll('.bg-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.bg-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// Links
function renderLinks() {
  const container = document.getElementById('linksList');
  const empty = document.getElementById('emptyLinks');

  container.innerHTML = '';

  if (!config.links || config.links.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  config.links.forEach((link, index) => {
    const item = document.createElement('div');
    item.className = 'link-item';
    item.dataset.index = index;

    const iconOptions = ICON_OPTIONS.map(icon =>
      `<option value="${icon}" ${link.icon === icon ? 'selected' : ''}>${icon}</option>`
    ).join('');

    item.innerHTML = `
      <span class="drag-handle">⠿</span>
      <div class="link-item-fields">
        <input type="text" class="link-label-input" value="${escapeHtml(link.label)}" placeholder="Label" data-field="label">
        <input type="url" class="link-url-input" value="${escapeHtml(link.url)}" placeholder="https://..." data-field="url">
        <select data-field="icon">${iconOptions}</select>
      </div>
      <button class="btn-danger" data-action="delete">×</button>
    `;

    // Event listeners
    item.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', () => {
        const field = input.dataset.field;
        config.links[index][field] = input.value;
      });
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      config.links.splice(index, 1);
      renderLinks();
    });

    container.appendChild(item);
  });
}

document.getElementById('addLinkBtn').addEventListener('click', () => {
  if (!config.links) config.links = [];
  config.links.push({ label: "New Link", url: "https://", icon: "link" });
  renderLinks();
});

// Save
document.getElementById('saveBtn').addEventListener('click', () => {
  config.username = document.getElementById('inputUsername').value || 'reapsed';
  config.avatar = document.getElementById('inputAvatar').value || 'https://cdn.discordapp.com/embed/avatars/0.png';
  config.badge = document.getElementById('inputBadge').value;
  config.bio = document.getElementById('inputBio').value || 'welcome to my page';
  config.statusDot = document.getElementById('inputStatusDot').checked;
  config.accentColor = document.getElementById('inputColor').value;
  config.bgStyle = document.querySelector('.bg-option.active')?.dataset.bg || 'particles';
  config.music = {
    enabled: document.getElementById('inputMusicEnabled').checked,
    title: document.getElementById('inputMusicTitle').value,
    artist: document.getElementById('inputMusicArtist').value,
    url: document.getElementById('inputMusicUrl').value
  };

  saveConfig();
  showToast('Changes saved!');
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all settings to default?')) {
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    saveConfig();
    populateForm();
    showToast('Reset to defaults');
  }
});

// Toast
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => {
    toast.className = 'toast';
  }, 2500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Init
populateForm();
