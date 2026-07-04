# ✦ RJ AI — Your Personal Desktop Assistant

RJ is a futuristic, voice-activated AI assistant that lives on your desktop. Built with Electron and React, RJ combines conversational AI, real voice interaction, document intelligence, and full desktop control into one sleek HUD-style interface — inspired by sci-fi assistants like JARVIS.

<p align="center">
  <em>Crafted with ❤ by Rajan Kumar Singh</em>
</p>

---

## ✨ Features

### 🧠 Conversational AI
- Multi-model support via OpenRouter (Gemini, DeepSeek, Qwen)
- Natural Hinglish (Hindi + English) conversation
- Context-aware responses using conversation history, memory, and documents
- Persistent chat sessions with auto-generated titles

### 🎙️ Voice Interaction
- **Wake word detection** — say "Hey RJ" to activate hands-free
- **Voice Activity Detection (VAD)** — no fixed recording windows, RJ listens until you stop talking
- **Speech-to-text** powered by Groq Whisper
- **Fluent text-to-speech** powered by ElevenLabs (with automatic fallback to Google TTS if unavailable)
- Multiple voice personalities to choose from (Adam, Daniel, Arnold, Rachel, and more)

### 📄 Document Intelligence (RAG)
- Upload PDF, TXT, or DOCX files
- Ask questions grounded in your own documents
- Automatic chunking and keyword-based retrieval

### 🧩 Memory
- RJ remembers facts about you across sessions
- Auto-saves important information during conversation
- Manage (view/delete) memories anytime from Settings

### 🖥️ Desktop Control
- Open applications (Chrome, VS Code, Notepad, etc.)
- Open specific browsers (Brave, Chrome, Edge, Firefox) with a URL or search query
- Web search directly from chat
- Close all open applications
- System shutdown, restart, and sleep — voice or text triggered
- **Safety confirmation dialogs** before any destructive or system-level action runs

### 📊 Live System Dashboard
- Real-time CPU, memory, and disk usage
- Power status (AC/Battery)
- Local network IP and connection info
- Live clock and date

### 🎨 Futuristic HUD Interface
- Dark, glassmorphic, neon cyan design
- Animated rotating orb that reacts to RJ's state (idle, listening, thinking, speaking)
- Fully custom window chrome with persistent size/position across restarts

### ⚙️ Easy Setup
- In-app API key management — no `.env` editing required
- Bring your own keys for OpenRouter, Groq, and ElevenLabs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron 39 |
| UI | React 19 + Zustand |
| Styling | Plain CSS (custom design system, no framework) |
| AI | OpenRouter API (Gemini / DeepSeek / Qwen) |
| Speech-to-Text | Groq Whisper (`whisper-large-v3-turbo`) |
| Text-to-Speech | ElevenLabs (with gTTS fallback) |
| Document Parsing | pdfjs-dist, mammoth |
| Storage | Local JSON file storage (no external database) |

---

## 📁 Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.js             # App entry, window creation, IPC handlers
│   └── services/            # Business logic (AI, TTS, STT, RAG, system, etc.)
├── preload/
│   └── index.js             # Secure bridge between main and renderer
└── renderer/src/
    ├── components/          # React UI components
    │   └── layout/           # HUD layout (left/right panels, center stage)
    ├── store/                # Zustand global state
    └── styles/               # CSS design system
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### API Keys

RJ needs at least one API key to function fully. Once the app is running:

1. Open **Settings (⚙)** → **General tab**
2. Paste your keys for:
   - **OpenRouter** — required for AI chat ([get a key](https://openrouter.ai))
   - **Groq** — required for voice input ([get a key](https://console.groq.com))
   - **ElevenLabs** — optional, for fluent voice output ([get a key](https://elevenlabs.io)) — falls back to a basic voice if not set
3. Click **Save** next to each field — no restart needed

### Build for Production

```bash
npm run build:win     # Windows
npm run build:mac     # macOS
npm run build:linux   # Linux
```

Builds output to the `dist/` folder as an installer/executable.

---

## 🔒 Security Notes

- All destructive actions (closing apps, shutdown, restart, sleep, opening apps/URLs/files) require explicit user confirmation via an in-app dialog before executing.
- API keys are stored locally on your machine only — never transmitted anywhere except directly to their respective providers (OpenRouter, Groq, ElevenLabs).
- No telemetry, no analytics, no external logging.

---

## 📦 Distribution / Deployment

RJ is a desktop application, not a website — it can't be "deployed" to a URL. Instead, it's distributed as an installer/executable that people download and run locally. Free ways to distribute it:

- **GitHub Releases** — build installers with `electron-builder` and attach them to a GitHub Release (completely free, works for public and private repos)
- **GitHub Actions** — set up a free CI workflow to auto-build Windows/Mac/Linux installers on every push (free for public repos, generous free minutes for private ones)
- **itch.io** — free hosting specifically built for downloadable desktop apps, includes a built-in installer/updater experience
- **Google Drive / OneDrive** — simplest option, just upload the built installer and share the link

---

## 📝 License

This project is personal software built by Rajan Kumar Singh. All rights reserved unless otherwise specified.

---

<p align="center">
  Made with ❤ by <strong>Rajan Kumar Singh</strong><br/>
  <a href="https://rajankumarsingh.me">rajankumarsingh.me</a>
</p>