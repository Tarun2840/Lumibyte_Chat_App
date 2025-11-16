/**
 * Simple Express backend with in-memory mock data.
 * Endpoints:
 *  - GET  /api/sessions           -> list all sessions (id, title, createdAt)
 *  - GET  /api/new-chat           -> create and return a new session { id }
 *  - GET  /api/session/:id        -> return full conversation history for a session
 *  - POST /api/chat/:id           -> ask a question; returns mock { description, table }
 *  - POST /api/feedback           -> record like/dislike on an answer { sessionId, answerId, feedback }
 *
 * No database; everything is stored in memory.
 */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ---------------- In-memory store ----------------
const store = {
  sessions: {},
  order: [], // keep creation order for listing
};

function randomId() {
  try {
    return require('crypto').randomUUID();
  } catch (e) {
    return 's_' + Math.random().toString(36).slice(2, 10);
  }
}

function generateTitleFromQuestion(q) {
  if (!q) return 'New Chat';
  const words = q.trim().split(/\s+/).slice(0, 6).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function mockStructuredAnswer(question) {
  // Create a deterministic-ish data set based on question length
  const seed = question.length % 5;
  const datasets = [
    {
      description: "Here’s a small comparison of programming languages with typical use-cases and ratings.",
      table: {
        columns: ["Language", "Paradigm", "Primary Use", "Popularity (1-5)"],
        rows: [
          ["JavaScript", "Multi-paradigm", "Web/Full‑stack", 5],
          ["Python", "Multi-paradigm", "Data/Backend", 5],
          ["Go", "Procedural", "Systems/Cloud", 4],
          ["Java", "OOP", "Enterprise/Android", 4],
          ["Rust", "Multi-paradigm", "Systems/Safety", 4]
        ]
      }
    },
    {
      description: "Sample sales report by region with quarterly totals.",
      table: {
        columns: ["Region", "Q1", "Q2", "Q3", "Q4", "Total"],
        rows: [
          ["North", 120, 140, 130, 160, 550],
          ["South", 90, 110, 125, 140, 465],
          ["East", 100, 120, 115, 150, 485],
          ["West", 80, 100, 105, 120, 405]
        ]
      }
    },
    {
      description: "Demo employee directory snippet with departments.",
      table: {
        columns: ["ID", "Name", "Department", "Role"],
        rows: [
          ["E101", "Aarav", "Engineering", "Frontend Dev"],
          ["E102", "Diya", "Engineering", "Backend Dev"],
          ["E201", "Karthik", "Design", "Product Designer"],
          ["E301", "Sara", "Sales", "Account Exec"],
          ["E401", "Ishaan", "Support", "Support Engineer"]
        ]
      }
    },
    {
      description: "Countries and some quick indicators (mock values).",
      table: {
        columns: ["Country", "Capital", "Population (M)", "GDP ($B)"],
        rows: [
          ["India", "New Delhi", 1420, 3400],
          ["USA", "Washington, D.C.", 333, 25600],
          ["Germany", "Berlin", 84, 4300],
          ["Japan", "Tokyo", 125, 4200]
        ]
      }
    },
    {
      description: "Sample product catalog with prices.",
      table: {
        columns: ["SKU", "Product", "Category", "Price"],
        rows: [
          ["P-100", "Wireless Mouse", "Accessories", 999],
          ["P-200", "Mechanical Keyboard", "Accessories", 4499],
          ["P-300", "27\" Monitor", "Displays", 18999],
          ["P-400", "USB-C Hub", "Accessories", 1999]
        ]
      }
    }
  ];
  return datasets[seed];
}

// Create a session
function createSession(initialQuestion) {
  const id = randomId();
  const createdAt = new Date().toISOString();
  const title = initialQuestion ? generateTitleFromQuestion(initialQuestion) : "New Chat";
  store.sessions[id] = {
    id,
    title,
    createdAt,
    history: [] // each item: { question, answer: { id, description, table }, feedback: 'like'|'dislike'|null }
  };
  store.order.unshift(id); // newest first
  return id;
}

// ---------------- Routes ----------------

// List all sessions
app.get('/api/sessions', (req, res) => {
  const list = store.order.map(id => {
    const s = store.sessions[id];
    return { id: s.id, title: s.title, createdAt: s.createdAt };
  });
  res.json({ sessions: list });
});

// Start a new chat -> returns new session ID
app.get('/api/new-chat', (req, res) => {
  const id = createSession();
  res.json({ id });
});

// Get full history for a session
app.get('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const s = store.sessions[id];
  if (!s) return res.status(404).json({ error: 'Session not found' });
  res.json({ id: s.id, title: s.title, createdAt: s.createdAt, history: s.history });
});

// Ask question in a session -> returns mock structured answer
app.post('/api/chat/:id', (req, res) => {
  const { id } = req.params;
  const { question } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question (string) is required' });
  }
  const s = store.sessions[id];
  if (!s) return res.status(404).json({ error: 'Session not found' });

  // If this is the first question and title is "New Chat", generate a title
  if (s.history.length === 0 && s.title === 'New Chat') {
    s.title = generateTitleFromQuestion(question);
  }

  const answerPayload = mockStructuredAnswer(question);
  const answerId = randomId();
  const entry = {
    question,
    answer: {
      id: answerId,
      description: answerPayload.description,
      table: answerPayload.table
    },
    feedback: null,
    timestamp: new Date().toISOString()
  };
  s.history.push(entry);
  res.json(entry);
});

// Record feedback for an answer
app.post('/api/feedback', (req, res) => {
  const { sessionId, answerId, feedback } = req.body || {};
  if (!sessionId || !answerId || !['like', 'dislike', null].includes(feedback)) {
    return res.status(400).json({ error: 'sessionId, answerId and feedback ("like"|"dislike"|null) are required' });
  }
  const s = store.sessions[sessionId];
  if (!s) return res.status(404).json({ error: 'Session not found' });
  const item = s.history.find(h => h.answer && h.answer.id === answerId);
  if (!item) return res.status(404).json({ error: 'Answer not found' });
  item.feedback = feedback;
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.send('Mock Chat API is running.');
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
