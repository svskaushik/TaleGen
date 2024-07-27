"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LangflowClient } from "./utils/langflowClient";
import { generateImage } from "./utils/imageGenerationClient";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';

const loadingMessages = ["Thinking", "Ideating", "Writing"];

const langflowClient = new LangflowClient("http://127.0.0.1:7860");

const testPrompt = '## The Shadow of the Mountains\nThe stench of Orc-flesh and damp earth filled Frodo’s nostrils. He lay huddled in the darkness, his body aching from the rough journey and the fear that gnawed at his insides. Sam, his loyal companion, was beside him, his breathing shallow and uneven. They had been captured, their escape from the Black Riders thwarted by the sudden appearance of a band of Orcs.“Frodo?” Sam whispered, his voice barely audible. “Are you alright?'

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; imagePrompt?: string; imageUrl?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [illustrationsEnabled, setIllustrationsEnabled] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

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


  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, closeSidebar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");

    try {
      // const response = await langflowClient.runFlow(
      //   "ddc17753-39a3-4517-acd1-cc2718cd0a83",
      //   currentInput
      // );
      
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

      setMessages((prev) => [...prev, { role: "assistant", content: testPrompt, imagePrompt, imageUrl }]);
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
    <main className="relative min-h-screen bg-gray-200 dark:bg-gray-800">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        illustrationsEnabled={illustrationsEnabled}
        setIllustrationsEnabled={setIllustrationsEnabled}
        narrationEnabled={narrationEnabled}
        setNarrationEnabled={setNarrationEnabled}
      />

      <div className="flex flex-col min-h-screen">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 overflow-hidden p-8 flex flex-col">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            narrationEnabled={narrationEnabled}
          />
          <form onSubmit={handleSubmit} className="flex mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Type your message here..."
            />
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
