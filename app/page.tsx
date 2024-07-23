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
        "e73e4a69-bd5e-42ed-b701-5f941e59dbc1",
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
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
      <div className="z-10 w-full max-w-3xl flex flex-col items-center justify-between font-sans text-sm">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">Chat with Langflow</h1>
        <div className={`text-sm mb-4 ${
          connectionStatus === "connected" ? "text-green-500" :
          connectionStatus === "disconnected" ? "text-red-500" :
          "text-yellow-500"
        }`}>
          Status: {connectionStatus}
        </div>
        <div className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-4 h-[60vh] overflow-y-auto mb-4 bg-white dark:bg-gray-800 shadow-md">
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
                <span className={`inline-block p-2 rounded-lg ${
                  message.role === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                }`}>
                  {message.content}
                </span>
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
        <form onSubmit={handleSubmit} className="flex w-full">
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
    </main>
  );
}
