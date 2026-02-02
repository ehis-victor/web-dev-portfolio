import React, { useState, useRef, useEffect } from "react";
import { generateChatResponse } from "../services/geminiService";
import { analytics } from "../services/analytics";
import { Message, Project } from "../types";
import { useTheme } from "../context/ThemeContext";

interface ChatWidgetProps {
  projects: Project[];
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ projects }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "model",
      text: "Hi! I'm Veek Bot. Ask me anything about the projects or skills showcased here.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      analytics.trackModalOpen("chat_widget");
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Pass the current projects list to the service
      const responseText = await generateChatResponse(userMsg.text, projects);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`mb-4 w-80 sm:w-96 border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up transition-colors duration-300 ${theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-stone-50 border-stone-200"
            }`}
        >
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="text-xl">✨</span> Veek Bot
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            className={`h-80 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900/50" : "bg-stone-100/50"
              }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/10"
                      : `${theme === "dark"
                        ? "bg-slate-700 text-slate-100"
                        : "bg-stone-100 text-slate-900 border border-stone-200"
                      } rounded-bl-none shadow-sm`
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 ${theme === "dark"
                      ? "bg-slate-700"
                      : "bg-stone-100 border border-stone-200"
                    }`}
                >
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className={`p-3 border-t flex gap-2 transition-colors duration-300 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"
              }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about my projects..."
              className={`flex-1 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors ${theme === "dark"
                  ? "bg-slate-900 text-white placeholder-slate-400 border-slate-700"
                  : "bg-stone-100 text-slate-900 placeholder-slate-500 border-stone-300"
                }`}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "scale-0" : "scale-100"
          } transition-transform duration-200 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 group`}
      >
        <span className="hidden group-hover:block text-sm font-medium pr-1 animate-fade-in">
          Ask Veek
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  );
};

export default ChatWidget;
