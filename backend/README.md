# Backend (Node.js + Express)

## Setup
```bash
cd backend
npm install
npm start
```
Server starts on **http://localhost:4000**.

### Endpoints
- `GET /api/sessions` — List sessions
- `GET /api/new-chat` — Create and return a new session `{ id }`
- `GET /api/session/:id` — Full session history
- `POST /api/chat/:id` — Ask a question `{ question }` -> returns `{ question, answer: { id, description, table }, feedback, timestamp }`
- `POST /api/feedback` — Record feedback `{ sessionId, answerId, feedback: "like"|"dislike"|null }`
