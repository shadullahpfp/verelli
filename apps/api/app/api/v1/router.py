"""
API v1 Router Registration for verelli.lol.
Aggregates all v1 API endpoints.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import validate

api_router = APIRouter()

# Register validate endpoints: POST /api/v1/validate, GET /api/v1/verdict/{id}
api_router.include_router(validate.router, prefix="", tags=["Validation"])
