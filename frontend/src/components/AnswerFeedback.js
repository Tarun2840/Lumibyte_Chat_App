import React from "react";
import { sendFeedback } from "../api";

export default function AnswerFeedback({ sessionId, answerId, current }) {
  const fire = async (val) => {
    await sendFeedback(sessionId, answerId, val);
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => fire(current === "like" ? null : "like")}
        className={`px-2 py-1 rounded border ${current === "like" ? "bg-green-600 text-white border-green-700" : "border-gray-300 dark:border-gray-700"}`}
        title="Like"
      >
        👍
      </button>
      <button
        onClick={() => fire(current === "dislike" ? null : "dislike")}
        className={`px-2 py-1 rounded border ${current === "dislike" ? "bg-red-600 text-white border-red-700" : "border-gray-300 dark:border-gray-700"}`}
        title="Dislike"
      >
        👎
      </button>
    </div>
  );
}
