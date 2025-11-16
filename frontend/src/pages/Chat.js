import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { askQuestion, getSession } from "../api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import ChatInput from "../components/ChatInput";
import TableResponse from "../components/TableResponse";
import AnswerFeedback from "../components/AnswerFeedback";

export default function Chat() {
  const { sessionId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getSession(sessionId);
      setSession(data);
    })();
  }, [sessionId]);

  const onSend = async (q) => {
    setLoading(true);
    const res = await askQuestion(sessionId, q);
    setLoading(false);
    setSession((prev) => ({
      ...prev,
      history: [...(prev?.history || []), res]
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="font-semibold truncate px-1">
            {session?.title || "Chat"}
          </div>
          <ThemeToggle />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!session?.history?.length && (
            <div className="text-center text-gray-500">Ask your first question…</div>
          )}

          {session?.history?.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-2 items-start">
                <div className="font-semibold">You:</div>
                <div className="flex-1">{item.question}</div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="font-semibold">Bot:</div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{item.answer?.description}</div>
                  <TableResponse table={item.answer?.table} />
                  <AnswerFeedback
                    sessionId={sessionId}
                    answerId={item.answer?.id}
                    current={item.feedback}
                  />
                </div>
              </div>
              <div className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
          ))}

          {loading && <div className="text-gray-500">Thinking…</div>}
        </div>

        <ChatInput onSend={onSend} disabled={loading} />
      </div>
    </div>
  );
}
