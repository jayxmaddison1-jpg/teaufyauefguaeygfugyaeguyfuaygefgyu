const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get config
app.get('/api/config', (req, res) => {
  const configPath = path.join(__dirname, 'data', 'config.json');
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json({
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
    });
  }
});

// API endpoint to save config
app.post('/api/config', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const configPath = path.join(dataDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
});

// Catch-all for SPA-like behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Bio page: http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
});
