"""
FastAPI Main Application Entrypoint for verelli.lol.
Configures CORS middleware, exception handlers, healthcheck endpoint,
and registers API v1 routers.
"""
from contextlib import asynccontextmanager
import logging
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import api_router
from app.core.config import settings
from app.models.schemas import HealthResponse

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("verelli.api")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan context manager for startup and shutdown lifecycle management."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Similarity threshold active: {settings.SIMILARITY_THRESHOLD}")
    logger.info(f"CORS origins configured: {settings.CORS_ORIGINS}")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Verelli.lol Intelligence Backend Server — AI pre-build startup idea validator "
        "cross-referencing YC graveyard post-mortems and Stripe-verified profitable micro-SaaS data."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# -----------------------------------------------------------------------------
# CORS Middleware Configuration
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# -----------------------------------------------------------------------------
# Global Exception Handlers
# -----------------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic request body validation failures with clear error format."""
    logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Unprocessable Entity",
            "message": "Input validation failed. Please check the request payload parameters.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handle standard HTTP exceptions with structured response format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Exception",
            "status_code": exc.status_code,
            "message": exc.detail,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all unhandled exception handler to prevent leaking internal tracebacks."""
    logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing the intelligence request.",
        },
    )


# -----------------------------------------------------------------------------
# Base Endpoints
# -----------------------------------------------------------------------------
@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Service Healthcheck",
    description="Returns the live operational health status of the verelli.lol API server.",
)
async def healthcheck() -> HealthResponse:
    """Healthcheck endpoint."""
    return HealthResponse(
        status="healthy",
        service="verelli-api",
        version=settings.VERSION,
    )


@app.get(
    "/",
    tags=["System"],
    summary="Root Service Metadata",
    description="Root metadata information and documentation links.",
)
async def root_info() -> dict:
    """Root info endpoint."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "validate": f"{settings.API_V1_PREFIX}/validate",
            "verdict": f"{settings.API_V1_PREFIX}/verdict/{{id}}",
        },
    }


# -----------------------------------------------------------------------------
# Mount API v1 Routes
# -----------------------------------------------------------------------------
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
