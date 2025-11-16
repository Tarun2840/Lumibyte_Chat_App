import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSessions, newChat } from "../api";

export default function Sidebar({ collapsed, onToggle }) {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const { sessionId } = useParams();

  useEffect(() => {
    (async () => {
      const data = await fetchSessions();
      setSessions(data.sessions || []);
    })();
  }, [sessionId]);

  const handleNewChat = async () => {
    const res = await newChat();
    if (res && res.id) {
      navigate(`/chat/${res.id}`);
    }
  };

  return (
    <div className={`h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${collapsed ? "w-16" : "w-[var(--sidebar-width)]"}`}>
      <div className="flex items-center justify-between p-3">
        <button
          onClick={onToggle}
          className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800"
        >
          {collapsed ? "→" : "←"}
        </button>
        {!collapsed && <span className="text-xs text-gray-500">User: Guest</span>}
      </div>

      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full text-left text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          title="Start a new conversation"
        >
          New Chat
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-4 overflow-y-auto h-[calc(100%-100px)]">
          <p className="text-xs uppercase text-gray-500 mb-2">Sessions</p>
          <ul className="space-y-1">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => navigate(`/chat/${s.id}`)}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-800 ${sessionId === s.id ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                >
                  <div className="truncate">{s.title || s.id}</div>
                  <div className="text-[10px] text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
