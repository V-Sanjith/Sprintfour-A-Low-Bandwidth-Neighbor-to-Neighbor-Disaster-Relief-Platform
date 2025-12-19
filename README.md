# 🆘 LocalLink - Disaster Relief Bridge

> **Low-Bandwidth, Neighbor-to-Neighbor Disaster Relief Platform**

🔗 **Live Demo:** [https://sprintfour-a-low-bandwidth-neighbor.vercel.app/](https://sprintfour-a-low-bandwidth-neighbor.vercel.app/)

A real-time web application designed to connect disaster victims with nearby helpers during emergencies. Built for **low-bandwidth scenarios** with voice input, GPS detection, and instant matching.

## 🌟 Features

### Core Functionality
- **📝 Quick Posting** - Post needs or offers in under 30 seconds
- **🎤 Voice Input** - Speak your request (no typing needed)
- **📍 GPS Detection** - Auto-detect location with one click
- **🗺️ Map View** - Visual map with color-coded pins (Red=Needs, Green=Offers)
- **⚡ Real-time Updates** - Instant feed updates via Supabase Realtime
- **📲 PWA Ready** - Install as app on mobile devices

### Anti-Abuse Features
- **🚩 Report Spam** - Flag suspicious posts
- **⏱️ Rate Limiting** - Max 5 posts per hour per device
- **✅ Two-Party Verification** - Requester must confirm help was received
- **🔐 Device Tracking** - Only original poster can verify completion

### Smart Features
- **🔔 Urgent Priority** - Urgent posts appear first with alerts
- **🤝 Match Suggestions** - Auto-suggest matching offers for needs
- **📊 Impact Counter** - Real-time stats (Total, In-Progress, Fulfilled)
- **📤 Easy Sharing** - QR code, WhatsApp, and native share

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Dark Theme) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Maps | Leaflet + OpenStreetMap |
| Voice | Web Speech API |
| Location | Geolocation API + Nominatim |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/V-Sanjith/Sprintfour-A-Low-Bandwidth-Neighbor-to-Neighbor-Disaster-Relief-Platform.git

# Navigate to project
cd local-link

# Install dependencies
npm install

# Start development server
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run this SQL to create the posts table:

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('NEED', 'OFFER')),
  urgency TEXT DEFAULT 'NORMAL',
  category TEXT,
  item TEXT NOT NULL,
  quantity TEXT,
  description TEXT,
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'PENDING_CONFIRMATION', 'FULFILLED')),
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
```

3. Update `src/lib/supabase.js` with your credentials:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 📱 Usage Flow

```
1. User posts: "I need water" (via voice or text)
2. App auto-detects GPS location
3. Post appears in real-time feed + map
4. Helper clicks "I Can Help" → Contact revealed
5. Helper marks "Done" after helping
6. Original poster confirms → ✅ VERIFIED COMPLETE
```

## 📂 Project Structure

```
local-link/
├── src/
│   ├── components/
│   │   ├── Card.jsx          # Post card with actions
│   │   ├── Feed.jsx          # Post feed list
│   │   ├── FilterBar.jsx     # Category & type filters
│   │   ├── Header.jsx        # App header
│   │   ├── MapView.jsx       # Leaflet map view
│   │   ├── PostForm.jsx      # Create post form
│   │   ├── VoiceInput.jsx    # Speech-to-text
│   │   ├── LocationDetect.jsx # GPS detection
│   │   └── ...
│   ├── utils/
│   │   ├── device.js         # Device ID tracking
│   │   ├── icons.js          # Category icons
│   │   └── time.js           # Time formatting
│   ├── lib/
│   │   └── supabase.js       # Supabase client
│   ├── App.jsx               # Main app component
│   └── index.css             # Global styles
└── public/
    └── manifest.json         # PWA manifest
```

## 🎯 Demo Highlights

| Feature | Demo Action |
|---------|-------------|
| Voice Posting | Click 🎤 and speak your need |
| GPS | Click 📍 to auto-detect location |
| Map View | Toggle to 🗺️ Map View |
| Two-Party Verification | Helper marks done → Poster confirms |
| Report Spam | Click 🚩 flag on any post |

## 🏆 Hackathon Focus

**Problem:** During disasters, help coordination is chaotic and slow.

**Solution:** LocalLink provides:
- ⚡ **Speed** - Post in 30 seconds
- 🌐 **Low-bandwidth** - Minimal data usage
- 🤝 **Trust** - Two-party verification
- 📍 **Proximity** - Map-based matching
- 📱 **Access** - Works on any device (PWA)

## 📄 License

MIT License - Feel free to use for hackathons and social good projects.

---

Built with ❤️ for disaster relief coordination
