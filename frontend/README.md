# 🎯 AI-Powered Job Tracker

A full-stack AI-powered job tracking platform built with React, Node.js, LangChain, and LangGraph.

## 🔗 Live Links
- **Live App:** https://job-tracker-weld-psi.vercel.app
- **Backend API:** https://job-tracker-rujx.onrender.com
- **GitHub:** https://github.com/Arun63-0/job-tracker

## 🏗️ Architecture
```
User Browser
     ↓
React Frontend (Vercel)
     ↓
Node.js + Fastify Backend (Render)
     ↓
┌────────────────────────────────┐
│  LangChain (Job Matching)      │
│  LangGraph (AI Assistant)      │
│  Google Gemini (LLM)           │
└────────────────────────────────┘
```

## ⚙️ Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Fastify
- **AI Matching:** LangChain + Google Gemini
- **AI Orchestration:** LangGraph
- **LLM:** Google Gemini (gemini-2.0-flash)
- **Storage:** In-memory (global store)
- **Deployment:** Vercel (frontend) + Render (backend)

## 🚀 Features
- ✅ Job feed with 15+ jobs
- ✅ 7 filters (title, skills, type, mode, location, date, match score)
- ✅ Resume upload (PDF/TXT)
- ✅ AI job matching with LangChain (0-100% scores)
- ✅ Color-coded badges (🟢🟡⚪)
- ✅ Best Matches section
- ✅ AI chat assistant powered by LangGraph
- ✅ AI controls UI filters in real time
- ✅ Smart apply popup
- ✅ Application tracking dashboard
- ✅ Timeline per application
- ✅ Login with test credentials

## 🔐 Test Credentials
- **Email:** test@gmail.com
- **Password:** test@123

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+
- Google Gemini API key

### Installation

**Clone the repo:**
```bash
git clone https://github.com/Arun63-0/job-tracker.git
cd job-tracker
```

**Backend setup:**
```bash
cd backend
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
node index.js
```

**Frontend setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

## 🤖 LangChain Usage
LangChain is used for AI job matching:
- Takes resume text and job description
- Sends to Google Gemini via ChatGoogleGenerativeAI
- Returns match score (0-100%), matching skills, and explanation
- Jobs are scored one by one to avoid rate limits

## 🧠 LangGraph Usage
LangGraph powers the AI assistant with a graph structure:

**Nodes:**
1. `detectIntent` — detects if user wants to filter or get help
2. `processFilter` — processes filter commands
3. `processHelp` — answers help questions

**Edges:**
- `detectIntent` → conditional edge → `processFilter` or `processHelp`
- Both nodes → `END`

**Capabilities:**
- Natural language job search
- Direct UI filter control
- Product help answers
- Rule-based fallback when API rate limited

## 🎯 AI Matching Logic
1. User uploads resume (PDF/TXT)
2. Resume text is extracted and stored
3. When jobs load, each job is scored against resume
4. Gemini analyzes skills match, experience, keywords
5. Returns 0-100% score with explanation
6. Jobs sorted by match score (highest first)

## 💡 Popup Flow Design
1. User clicks Apply → job opens in new tab
2. After 2 seconds → popup appears asking "Did you apply?"
3. Three options: Yes Applied / Applied Earlier / Just Browsing
4. If yes → saved with timestamp and timeline
5. Status can be updated: Applied → Interview → Offer/Rejected

**Why this design?**
- Non-intrusive (opens after return)
- Handles edge cases (applied earlier option)
- Tracks full application journey

## 🤖 AI Assistant UI Choice
Chose **floating chat bubble** because:
- Always accessible without blocking content
- Familiar UX pattern (like WhatsApp/Intercom)
- Expandable when needed, hidden when not
- Mobile friendly

## 📈 Scalability

**100+ jobs:**
- Add pagination to API
- Cache job results in Redis
- Use external job API (Azduna) for real jobs

**10,000 users:**
- Move from in-memory to PostgreSQL/MongoDB
- Add Redis for session management
- Use job queues for AI matching (Bull.js)
- Deploy backend on multiple instances
- Add CDN for frontend assets

## ⚖️ Tradeoffs
- **In-memory storage** → data resets on server restart (would use DB in production)
- **Rate limiting** → Gemini free tier limits API calls (rule-based fallback added)
- **Sequential scoring** → scores jobs one by one (slower but avoids rate limits)
- **No real auth** → simple credential check (would use JWT in production)

## 🚀 Future Improvements
- Real database (PostgreSQL)
- JWT authentication
- Real job API integration
- Email notifications for application updates
- Resume parsing with better NLP
- Advanced LangGraph with memory