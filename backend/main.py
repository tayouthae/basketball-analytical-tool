from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.tournament import router as tournament_router
from api.analytics import router as analytics_router
from api.upsets import router as upsets_router

app = FastAPI(
    title="Basketball Analytics API",
    description="March Madness Prediction & Team Analytics System",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tournament_router, prefix="/api/tournament", tags=["tournament"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["analytics"])
app.include_router(upsets_router, prefix="/api/upsets", tags=["upsets"])

@app.get("/")
async def root():
    return {
        "message": "Basketball Analytics API",
        "status": "active",
        "version": "1.0.0",
        "endpoints": {
            "tournament": "/api/tournament/*",
            "analytics": "/api/analytics/*", 
            "upsets": "/api/upsets/*"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "data_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)