"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

export default function ConsultPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "assistant", text: "Saya AI Assistant dari temanhire, siap menjawab semua pertanyaan seputar kebutuhan hiring anda!" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Tambahkan pesan user
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Reset input
    setInput("");

    // Dummy respon dari asisten (nanti bisa fetch ke API RAG pipeline)
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        sender: "assistant",
        text: "Terima kasih atas pertanyaannya! Untuk hiring yang bagus, biasanya perhatikan kecocokan skill, pengalaman, dan budaya kerja.",
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Consult with AI</h1>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto  rounded-lg p-4 space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow ${
                msg.sender === "user"
                  ? "bg-[#0097b2] text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Tanyakan sesuatu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
        />
        <button
          onClick={handleSend}
          className="flex items-center gap-2 px-4 py-2 bg-[#0097b2] text-white rounded-lg hover:bg-[#007b8a] transition"
        >
          <Send size={18} /> Send
        </button>
      </div>
    </div>
  );
}
