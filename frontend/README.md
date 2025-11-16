# Frontend (React + Tailwind CSS)

This project is structured like Create React App.

## Setup
```bash
cd frontend
npm install
npm start
```

### Environment
The frontend expects the backend at `http://localhost:4000`. If different, create a `.env` file:

```
REACT_APP_API_BASE=http://localhost:4000
```

### Features
- Landing page with **New Chat**
- Collapsible sidebar with sessions list
- Session-aware chat UI (URL contains sessionId)
- Structured **tabular** responses with descriptions
- **Like/Dislike** feedback on answers
- **Light/Dark** theme toggle (persists in localStorage)
- Responsive layout
