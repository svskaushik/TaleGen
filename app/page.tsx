"use client";

import { useState, useEffect, useRef } from "react";
import { LangflowClient } from "./utils/langflowClient";
import { generateImage } from "./utils/imageGenerationClient";
import { speak, stopSpeaking } from "./utils/googleTTS";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const loadingMessages = ["Thinking", "Ideating", "Writing"];

const langflowClient = new LangflowClient("http://127.0.0.1:7860");

const testPrompt = '## The Shadow of the Mountains\nThe stench of Orc-flesh and damp earth filled Frodo’s nostrils. He lay huddled in the darkness, his body aching from the rough journey and the fear that gnawed at his insides. Sam, his loyal companion, was beside him, his breathing shallow and uneven. They had been captured, their escape from the Black Riders thwarted by the sudden appearance of a band of Orcs.“Frodo?” Sam whispered, his voice barely audible. “Are you alright?'

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; imagePrompt?: string; imageUrl?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [illustrationsEnabled, setIllustrationsEnabled] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingMessage((prevMessage) => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

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
      
      let imagePrompt = "";
      if (illustrationsEnabled) {
        try {
          imagePrompt = await langflowClient.generateImagePrompt(
            "3e321ffe-c5d3-4894-99bd-804b0f1716d7",
            response
          );
          console.log("Image Prompt:", imagePrompt);
        } catch (error) {
          console.error("Error generating image prompt:", error);
        }
      }

      let imageUrl = "";
      if (illustrationsEnabled && imagePrompt) {
        try {
          imageUrl = await generateImage(imagePrompt);
        } catch (error) {
          console.error("Error generating image:", error);
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response, imagePrompt, imageUrl }]);
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
          <div className="mt-6">
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={illustrationsEnabled}
                    onChange={() => setIllustrationsEnabled(!illustrationsEnabled)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${illustrationsEnabled ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${illustrationsEnabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                  Illustrations
                </div>
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={narrationEnabled}
                    onChange={() => setNarrationEnabled(!narrationEnabled)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${narrationEnabled ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${narrationEnabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                  Narration
                </div>
              </label>
            </div>
          </div>
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
        <div className="flex-1 overflow-hidden p-8">
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
                    } ${message.imageUrl ? 'flex flex-row w-full max-w-full' : ''}`}>
                      <div className={`${message.imageUrl ? 'flex-1 pr-4' : ''} prose dark:prose-invert max-w-none`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                        {message.role === "assistant" && narrationEnabled && (
                          <button
                            onClick={() => speak(message.content)}
                            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                          >
                            Narrate
                          </button>
                        )}
                      </div>
                      {message.imageUrl && (
                        <div className={`flex-1 flex flex-col align-middle ${message.role === "user" ? 'pl-4' : 'pr-4'}`}>
                          <img src={`data:image/png;base64,${message.imageUrl}`} alt="Generated image" className="w-full h-auto rounded-lg" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  key={loadingMessage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  {loadingMessage}...
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
