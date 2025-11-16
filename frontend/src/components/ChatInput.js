import React, { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSend(q);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-800">
      <input
        className="flex-1 rounded px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none"
        placeholder="Ask a question..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
