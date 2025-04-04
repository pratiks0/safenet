# SafeNet: AI-Powered Online Safety Solution

SafeNet is a powerful AI-driven solution designed to detect and classify harmful content online, including hate speech and offensive images. This repository contains the complete project, including the API, browser extension, and frontend web application.

## 🚀 Features
- **Real-Time Content Classification** – Detects harmful text and images instantly.
- **Google AI Integration** – Utilizes Google Gemini and TensorFlow for accuracy.
- **User-Friendly Web Interface** – Easy-to-use web platform for content analysis.
- **Browser Extension** – Seamlessly flags harmful content while browsing.

---

## 📂 Repository Structure

```
📦 SafeNet
├── 📁 safenet-api                # Backend API for text & image classification
├── 📁 extension          # Browser extension for real-time moderation
├── 📁 safenet0frontend       # Web-based UI for SafeNet platform
├── 📄 README.md          # Project documentation (You're here!)
```

---

## 📌 Setup Guide

### 1️⃣ API (Backend)

#### Prerequisites:
- Python 3.8+
- FastAPI
- TensorFlow & Google Gemini API

#### Installation:
```sh
cd safenet-api
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Running the API:
- The API runs at `http://127.0.0.1:8000`
- Endpoints:
  - `/predict-text` – Classifies input text
  - `/predict-image` – Analyzes uploaded images

---

### 2️⃣ Browser Extension

#### Installation:
1. Open **Chrome** and go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked** and select the `extension` folder
4. The SafeNet extension is now active! 🎉

---

### 3️⃣ Frontend Web App

#### Prerequisites:
- Node.js & npm

#### Installation:
```sh
cd safenet-frontend
npm install
npm run dev
```

- Visit `http://localhost:3000` to access the SafeNet web app.

---

## 🛠 Tech Stack
- **Backend:** FastAPI, TensorFlow, Google Gemini API
- **Frontend:** React.js, Tailwind CSS
- **Hosting:** Docker, Railway(backend-api), vercel(frontend)

---

## 🌎 Contributing
We welcome contributions! Feel free to submit issues or create pull requests to improve SafeNet.


---

🚀 **Join us in making the internet a safer place with SafeNet!**

