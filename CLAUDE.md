# Project Overview                                                              
                                                                                  
  This is a React + TypeScript web app for visualizing global data on an          
  interactive world map. It uses Leaflet for map rendering and a FastAPI backend.
   I would like for you to visualize any publicly          
  available refinery data. In particular, I would like to 
   see the volume of petroleum processed by each refinery 
   around the world.   
                                                                                  
  ## Architecture                                                                 
                                                                                  
  - `frontend/` — React 18, TypeScript, Vite, Leaflet                             
  - `backend/` — Python 3.11, FastAPI, PostgreSQL via SQLAlchemy
  - `scripts/` — data ingestion and ETL utilities

  ## Dev Setup

  ```bash
  # Backend
  cd backend && pip install -r requirements.txt
  uvicorn main:app --reload

  # Frontend
  cd frontend && npm install && npm run dev

  Common Commands

  npm run lint          # ESLint
  npm run type-check    # tsc --noEmit
  npm test              # Vitest
  pytest backend/tests  # backend tests

  Key Conventions

  - API routes live in backend/routers/, one file per domain
  - React components use named exports, no default exports
  - All map interactions go through the useMap hook, not direct Leaflet calls
  - Database migrations managed with Alembic — never edit tables directly

  Environment Variables

  Copy .env.example to .env. Required vars:
  - DATABASE_URL — PostgreSQL connection string
  - VITE_API_BASE_URL — backend URL for the frontend

  Known Quirks

  - Leaflet requires import 'leaflet/dist/leaflet.css' before any map component
  renders or icons break
  - The /api/regions endpoint is slow on first call (cold cache) — expected
  behavior

  The key sections worth having in any CLAUDE.md:
  - **What the project is** (one paragraph)
  - **How to run it** (exact commands)
  - **Conventions Claude should follow** (saves repeated corrections)
  - **Gotchas** (things that would waste time to rediscover)