"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Emmanuel Dela Pena (Emman). Welcome to my portfolio! Feel free to ask me about my projects, technical skills, experience, or even how playing guitar helps fuel my creativity and problem-solving mindset. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = inputValue;

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          text: userMessage,
          sender: "user",
          timestamp: new Date(),
        },
      ]);

      setInputValue("");
      setIsLoading(true);

      try {
        // Call Gemini API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        if (data.reply) {
          // Add bot response
          setMessages((prev) => [
            ...prev,
            {
              text: data.reply,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        } else {
          throw new Error("No reply received");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I'm having trouble connecting right now. Please try again later! 😅",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Emman"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            <span className="chat-button-text">Emman's AI Assistant</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-widget">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Image
                  src="/images/profile_new.jpg"
                  alt="Ren"
                  width={40}
                  height={40}
                />
                <span className="online-indicator"></span>
              </div>
              <div>
                <h4>Emman's AI Assistant</h4>
                <p className="online-status">ONLINE</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}