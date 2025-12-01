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
  // Conversations state maintenu pour la structure mais non utilisé visuellement
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Conversation 1", messages: [] },
    { id: "2", title: "Conversation 2", messages: [] },
  ]);

  // Questions suggérées
  const suggestedQuestions = [
    "Qui est Clément ?",
    "Quelles sont les compétences de Clément ?",
    "Peux-tu me parler de ses projets ?",
    "Comment puis-je contacter Clément ?",
    "Quel est son parcours professionnel ?",
    "Quel est ton rôle en tant qu'assistant ?",
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Message de bienvenue automatique de l'IA (s'exécute une seule fois)
  useEffect(() => {
    const welcomeMessage: Message = { 
      author: "bot", 
      text: "Bonjour ! Je suis l'assistant virtuel de Clément. Je suis là pour répondre à toutes vos questions le concernant, ses projets et ses compétences. N'hésitez pas à me solliciter !" 
    };

    const timer = setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (questionToSend: string = input) => {
    if (!questionToSend.trim() && !input.trim()) return;

    const userMessageText = questionToSend.trim() || input.trim();

    const userMessage: Message = { author: "user", text: userMessageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true); // Active l'indicateur de typing

    try {
      const res = await apiClient.post("/api/v1/chatbot/ask", {
        question: userMessageText,
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
      setIsTyping(false); // Désactive l'indicateur de typing
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // Fonction pour gérer le clic sur une suggestion
  const handleSuggestedQuestionClick = (question: string) => {
    sendMessage(question);
  };

  // Fonction pour déterminer si le carrousel doit être affiché
  const shouldShowSuggestions = (index: number) => {
      // Afficher seulement si c'est le premier (index 0) et unique message du bot.
      return messages.length === 1 && index === 0 && messages[index].author === "bot";
  };

  // COMPOSANT SUGGESTIONS DÉPORTÉ POUR LA CLARTÉ
  const SuggestionsCarousel = (
    <motion.div
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // La classe pour masquer et autoriser le scroll horizontal est ici
      className="flex-shrink-0 mt-2 mb-3 py-3 overflow-x-auto hide-scrollbar w-full" 
    >
      <div className="flex space-x-3 px-2 sm:px-4">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestionClick(question)}
            className="flex-shrink-0 px-4 py-2 bg-gray-600 text-gray-200 rounded-full text-sm hover:bg-gray-500 transition-colors duration-200 whitespace-nowrap"
          >
            {question}
          </button>
        ))}
      </div>
    </motion.div>
  );


  return (
    <div className="relative w-full h-screen flex bg-gray-900 text-white overflow-hidden ">
      <ThreeBackground />

      {/* Chat principal (Centré et resserré par max-w-4xl) */}
      <div className="flex-1 relative flex flex-col justify-end p-6 pointer-events-auto h-full overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full">

          {/* Messages */}
          <div
            ref={scrollRef}
            // hide-scrollbar cache la barre verticale
            className="flex-1 overflow-y-auto mb-4 space-y-3 px-2 sm:px-4 hide-scrollbar"
          >
            {messages.map((m, idx) => (
              <React.Fragment key={idx}>
                {/* 1. Affichage de la bulle de message */}
                <motion.div
                  initial={{ opacity: 0, x: m.author === "user" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                >
                  {/* isTyping={false} pour éviter que les messages historiques n'affichent le "..." */}
                  <Bubble text={m.text} author={m.author} isTyping={false} />
                </motion.div>

                {/* 2. Affichage des suggestions SOUS le message si la condition est remplie */}
                {shouldShowSuggestions(idx) && (
                    <div className="flex justify-start w-full"> 
                        {SuggestionsCarousel}
                    </div>
                )}
              </React.Fragment>
            ))}
            
            {/* Composant de "Typing..." affiché uniquement lorsque isTyping est true */}
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex"
                >
                    <Bubble text="Typing..." author="bot" isTyping={true} />
                </motion.div>
            )}
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
              onClick={() => sendMessage()}
              className="px-5 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;