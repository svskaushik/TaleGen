"use client";

import { useState, useEffect, useRef } from "react";
import { LangflowClient } from "./utils/langflowClient";
import { motion, AnimatePresence } from "framer-motion";

const langflowClient = new LangflowClient("http://127.0.0.1:7866");

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await langflowClient.ping();
        setConnectionStatus("connected");
      } catch (error) {
        setConnectionStatus("disconnected");
        console.error("Failed to connect to Langflow server:", error);
      }
    };

    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");

    try {
      const response = await langflowClient.runFlow(
        "ddc17753-39a3-4517-acd1-cc2718cd0a83",
        currentInput
      );
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Sorry, there was an error processing your request.";
      if (error instanceof Error) {
        errorMessage += " " + error.message;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Menu</h2>
          </div>
          {/* Add menu items here */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 ml-4">Chat with Langflow</h1>
          <div className={`ml-auto text-sm ${
            connectionStatus === "connected" ? "text-green-500" :
            connectionStatus === "disconnected" ? "text-red-500" :
            "text-yellow-500"
          }`}>
            Status: {connectionStatus}
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <div className={`inline-block p-2 rounded-lg ${
                      message.role === "user" 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                    }`}>
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  Thinking...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow border border-gray-300 dark:border-gray-700 rounded-l-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Type your message here..."
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
                disabled={isLoading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
