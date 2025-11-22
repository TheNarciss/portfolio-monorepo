// frontend/src/pages/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ThreeBackground from "@components/ui/ThreeBackground";
import apiClient from "@api/apiClient";
import Bubble from "@components/chatbot/Bubble";

interface Message {
  author: "user" | "bot";
  text: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Conversation 1", messages: [] },
    { id: "2", title: "Conversation 2", messages: [] },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { author: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await apiClient.post("/api/v1/chatbot/ask", {
        question: input,
        context: [],
        top_k: 5,
      });

      const botText = res.data.answer || "Désolé, je n'ai pas compris...";
      const botMessage: Message = { author: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err.response?.data || err);
      setMessages((prev) => [...prev, { author: "bot", text: "Erreur lors de la réponse du bot." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="relative w-full h-screen flex bg-gray-900 text-white overflow-hidden">
      <ThreeBackground />

      {/* Sidebar historique */}
      <div className="w-64 bg-gray-800 p-4 flex-shrink-0 overflow-y-auto z-50">
        <h2 className="text-lg font-semibold mb-4">Historique des conversations</h2>
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              onClick={() => setMessages(conv.messages)}
            >
              {conv.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat principal */}
      <div className="flex-1 relative flex flex-col justify-end p-6 pointer-events-auto h-full overflow-hidden">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-4 space-y-3 px-2 sm:px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        >
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: m.author === "user" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex"
            >
              <Bubble text={m.text} author={m.author} isTyping={m.author === "bot" && isTyping} />
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Écris un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
