import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NarrationPlayer from './NarrationPlayer';

interface Message {
  role: string;
  content: string;
  imagePrompt?: string;
  imageUrl?: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  loadingMessage: string;
  narrationEnabled: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, loadingMessage, narrationEnabled }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4">
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
                ? "bg-gray-300 text-gray-800" 
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            } ${message.imageUrl ? 'flex flex-row w-full max-w-full h-[800px]' : ''}`}>
              <div className={`${message.imageUrl ? 'flex-1 pr-4 overflow-y-auto custom-scrollbar' : ''} prose dark:prose-invert max-w-none`}>
                {message.role === "assistant" && narrationEnabled && (
                  <NarrationPlayer content={message.content} />
                )}
                {message.role === "assistant" && (
                  <h2 className="text-center text-xl font-bold mb-2">
                    {message.content.split('\n')[0].replace('## ', '')}
                  </h2>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.role === "assistant" ? message.content.split('\n').slice(1).join('\n') : message.content}
                </ReactMarkdown>
              </div>
              {message.imageUrl && (
                <div className="flex-1 flex items-center justify-center p-1">
                  <img src={`data:image/png;base64,${message.imageUrl}`} alt="Generated image" className="w-full h-full object-contain rounded-lg" />
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
  );
};

export default ChatArea;
