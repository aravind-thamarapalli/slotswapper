# Frontend - SlotSwapper

React + Vite + TailwindCSS frontend for SlotSwapper application.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend root:

```
# Base URL for the backend API (no trailing `/api` required). Example for local dev:
VITE_API_URL=http://localhost:5000

# For the deployed backend use the following production backend URL:
# VITE_API_URL=https://slotswapper-bknd.vercel.app

# The frontend is available at:
# https://slotswapper-pink.vercel.app/
```

## Project Structure

- `src/pages` - Page components
- `src/components` - Reusable components
- `src/lib` - Utility functions and mock data
- `src/hooks` - Custom React hooks
- `public` - Static assets

## Technologies Used

- React 18+
- Vite
- TailwindCSS
- React Router
- React Hook Form
- Zod
- Lucide React Icons
- Radix UI Components
