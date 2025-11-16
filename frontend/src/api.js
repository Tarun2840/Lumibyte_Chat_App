const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/api/sessions`);
  return res.json();
}

export async function newChat() {
  const res = await fetch(`${API_BASE}/api/new-chat`);
  return res.json();
}

export async function getSession(id) {
  const res = await fetch(`${API_BASE}/api/session/${id}`);
  return res.json();
}

export async function askQuestion(id, question) {
  const res = await fetch(`${API_BASE}/api/chat/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return res.json();
}

export async function sendFeedback(sessionId, answerId, feedback) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, answerId, feedback }),
  });
  return res.json();
}
