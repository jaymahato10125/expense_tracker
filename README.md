# Expense Tracker (MERN)

A full-stack expense tracker with JWT auth, user-specific transactions, filtering, summaries, and charts.

## Tech
- Frontend: React (Vite), React Router, Tailwind CSS, react-chartjs-2
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, express-validator
- DB: MongoDB Atlas
- Deploy: GitHub → DigitalOcean App Platform

## Monorepo Structure

expense-tracker/
├── client/       # React frontend (Vite + Tailwind)
├── server/       # Node.js backend (Express + Mongoose)

## Quick Start

1) Backend
- Copy `server/.env.example` to `server/.env` and fill values
- Install deps and run dev server

2) Frontend
- Copy `client/.env.example` to `client/.env` and set `VITE_API_URL` to your backend URL
- Install deps and run dev server

### Try Locally (two terminals)
- Server: from `server/` run `npm install` then `npm run dev`
- Client: from `client/` run `npm install` then `npm run dev`

Default ports:
- Server: 5000
- Client: 5173

## Environment Variables

Server (`server/.env`):
- PORT=5000
- MONGO_URI=your_mongodb_atlas_connection_string
- JWT_SECRET=your_jwt_secret
- CORS_ORIGIN=http://localhost:5173

Client (`client/.env`):
- VITE_API_URL=http://localhost:5000

## Deploy to DigitalOcean App Platform

- Push this repo to GitHub
- Create a new App in App Platform and connect repo
- Add two services:
  - Web Service (client)
    - Source: /client
    - Build: npm install && npm run build
    - Run: npx serve -s dist
    - Output dir: dist
  - Web Service (server)
    - Source: /server
    - Build: npm install
    - Run: npm start
    - HTTP Port: 5000
- Set environment variables for each service in DO dashboard (don’t commit secrets)

## Notes
- Never commit real secrets. Use the DO dashboard to set env vars.
- Ensure MongoDB Atlas network rules allow DigitalOcean App Platform outbound IPs.
