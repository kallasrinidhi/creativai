# CreativAI – AI Content Creator Marketplace

CreativAI is an AI-powered content creator marketplace that connects businesses with creative professionals. It helps users discover creators, explore their portfolios, and find suitable talent for content creation projects.

## 🚀 Features

- **Creator Discovery:** Browse and discover content creators.
- **Search Functionality:** Search for creators based on relevant details.
- **Filtering:** Filter creators to find suitable matches.
- **Portfolio Preview:** Explore creators' portfolios and work samples.
- **Responsive Design:** Access the platform on desktop and mobile devices.
- **Backend API:** Use a Python FastAPI backend to provide creator data.
- **AI-Powered Content Generation:** Planned feature to help users generate creative content briefs and ideas.
- **Future Marketplace Integration:** Planned support for creator collaboration and project opportunities.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn

### Planned Technologies
- Supabase for database and authentication
- AI integration for content brief generation

## 📁 Project Structure

```text
Apex_Creators/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .venv/          # Local virtual environment; not uploaded
│
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Git](https://git-scm.com/)

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kallasrinidhi/creativai.git
cd creativai
```

### 2. Set Up the Frontend

Open a terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in your terminal, usually:

`http://localhost:5173`

### 3. Set Up the Backend

Open a **second terminal** in the project root and run:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
python -m uvicorn main:app --reload --port 8000
```

The backend should run at:

`http://127.0.0.1:8000`

If your FastAPI application provides automatic API documentation, open:

`http://127.0.0.1:8000/docs`

## 🔗 Frontend and Backend

The frontend communicates with the FastAPI backend to retrieve creator information.

- Frontend development server: `http://localhost:5173`
- Backend development server: `http://127.0.0.1:8000`

Both servers must be running for features that depend on the backend.

**Note:** Ensure the frontend API URL, backend endpoints, and CORS settings match your actual application configuration.

## 🌟 Future Enhancements

- AI-generated content briefs and creative ideas
- Creator and business registration
- User authentication and profile management
- Supabase database integration
- Advanced creator matching and recommendations
- Project posting and collaboration features
- Ratings, reviews, and creator analytics
- Deployment with a public live URL

## 🎯 Project Goal

The goal of CreativAI is to simplify the process of finding creative talent and make content collaboration more accessible through AI-powered tools.

## 👩‍💻 Developer

**Srinidhi Kalla**

GitHub: [kallasrinidhi](https://github.com/kallasrinidhi)

## 📄 License

This project is currently developed for learning and hackathon purposes. A formal open-source license can be added later.
