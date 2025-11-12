import Layout from "@components/layout/Layout";
import PageWrapper from "@components/layout/PageWrapper";
import ThreeBackground from "@components/ui/ThreeBackground";
import { useState, useEffect, useRef } from "react";
import apiClient from "@api/apiClient";

interface Message {
  role: "user" | "bot";
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Typage explicite pour Message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiClient.post("/api/v1/chatbot/ask", { question: input });
      const botMessage: Message = { role: "bot", content: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = { role: "bot", content: "Erreur lors de la réponse." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layout>
      <PageWrapper zoom="in">
        <div className="relative flex flex-col w-full min-h-[calc(100vh-64px)] text-center overflow-hidden px-fluid-4">
          <div className="absolute inset-0 z-0">
            <ThreeBackground />
          </div>

          <div className="z-10 flex-1 flex flex-col max-w-2xl mx-auto bg-card/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.role === "user" ? "self-end bg-accent text-white" : "self-start bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Pose ta question..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
                disabled={loading}
              >
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default Chatbot;
