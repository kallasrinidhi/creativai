
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CreativAI API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Test endpoint
@app.get("/")
def home():
    return {"message": "Welcome to CreativAI Backend!"}

# Health check
@app.get("/api/health")
def health():
    return {"status": "healthy"}

# Demo creator profiles
creators = [
    {
        "id": 1,
        "name": "Arun Mehta",
        "specialization": "AI Video Creator",
        "skills": ["AI Video", "Prompt Engineering"],
        "tools": ["Kling", "Runway"],
        "content_type": "video",
        "rate": 5000,
        "bio": "Creates cinematic AI advertisements."
    },
    {
        "id": 2,
        "name": "Maya Rao",
        "specialization": "AI Visual Designer",
        "skills": ["Image Generation", "Visual Design"],
        "tools": ["Midjourney", "Stable Diffusion"],
        "content_type": "image",
        "rate": 3000,
        "bio": "Creates AI-assisted visual campaigns."
    },
    {
        "id": 3,
        "name": "Kiran Das",
        "specialization": "AI Animator",
        "skills": ["Animation", "Storyboarding"],
        "tools": ["Runway", "Blender"],
        "content_type": "animation",
        "rate": 4500,
        "bio": "Creates animated brand stories."
    }
]

@app.get("/api/creators")
def get_creators():
    return creators
