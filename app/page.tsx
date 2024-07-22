"use client";

import { useState } from "react";
import { LangflowClient } from "./utils/langflowClient";

const langflowClient = new LangflowClient("http://127.0.0.1:7860");

"use client";

import { useState } from "react";
import { LangflowClient } from "./utils/langflowClient";

const langflowClient = new LangflowClient("http://127.0.0.1:7860");

"use client";

import { useState } from "react";
import { LangflowClient } from "./utils/langflowClient";

const langflowClient = new LangflowClient("http://127.0.0.1:7860");

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await langflowClient.runFlow(
        "8958bfbf-d3a3-4c4a-adbf-d35d831c4265",
        input
      );
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Chat with Langflow</h1>
        <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                {message.content}
              </span>
            </div>
          ))}
          {isLoading && <div className="text-center">Loading...</div>}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border rounded-l-lg p-2"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
