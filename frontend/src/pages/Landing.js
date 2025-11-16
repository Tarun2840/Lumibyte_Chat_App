import React from "react";
import { useNavigate } from "react-router-dom";
import { newChat } from "../api";
import ThemeToggle from "../components/ThemeToggle";

export default function Landing() {
  const navigate = useNavigate();

  const start = async () => {
    const res = await newChat();
    navigate(`/chat/${res.id}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center">
      <div className="max-w-xl w-full p-6 text-center">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold mb-2">Simplified Chat Application</h1>
        <p className="text-gray-500 mb-6">Start a new conversation and get structured, tabular answers.</p>
        <button onClick={start} className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700">New Chat</button>
      </div>
    </div>
  );
}
