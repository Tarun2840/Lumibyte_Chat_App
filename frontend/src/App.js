import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat/:sessionId" element={<Chat />} />
    </Routes>
  );
}

export default App;
