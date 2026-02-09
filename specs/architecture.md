# Phase II Architecture: Full-Stack Evolution

## Database
- Provider: Neon PostgreSQL
- Connection String: postgresql://neondb_owner:npg_nBmSDPHE3bs6@ep-orange-dust-aix6kvx2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
## Tech Stack
- Backend: FastAPI (Python)
- Frontend: Next.js (TypeScript/React)
- Package Manager: uv

## Requirements
- Evolve the existing todo logic into a web application.
- Use SQLModel for database interactions.
- Ensure the frontend can add, view, and delete tasks via the API.

Project Overview
I am building Phase 2 of my Todo App.

Tech Stack
Backend: FastAPI (in /backend folder)

Frontend: Next.js (in /frontend folder)

Database: Neon PostgreSQL

Database URL: [PASTE YOUR NEON LINK HERE]

Instructions
Create a database schema for Users and Tasks.

Create API endpoints to Add, View, and Delete tasks.

Create a web UI where I can log in and manage my tasks.

## Phase 3: Agentic Enhancements
- **Feature**: Task Search and Filtering.
- **Backend**: Update the `GET /todos/` endpoint to accept an optional `search` query parameter.
- **Logic**: If `search` is provided, return only tasks where the title contains the search string (case-insensitive).
- **Frontend**: Add a search input field above the task list that triggers the filtered view.
## Phase 3 Goal: Search Feature
- The user must be able to search for tasks.
- Frontend: Add a search input above the task list.
- Backend: Update the GET endpoint to filter results using a 'search' query parameter.