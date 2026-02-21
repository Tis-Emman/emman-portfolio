"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { supabase } from "@/app/community/lib/supabase";

interface Message {
  text: string;
  sender: "user" | "bot" | "admin";
  timestamp: Date;
  id?: string;
}

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! 👋 I'm Emmanuel Dela Pena (Emman). Welcome to my portfolio! Feel free to ask me about my projects, technical skills, experience, or even how playing guitar helps fuel my creativity and problem-solving mindset. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize sessionId and visitorId on component mount
  useEffect(() => {
    const initSession = async () => {
      let storedVisitorId = localStorage.getItem("visitor_id");
      
      if (!storedVisitorId) {
        storedVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("visitor_id", storedVisitorId);
      }

      let storedSessionId = localStorage.getItem("chat_session_id");
      
      if (!storedSessionId) {
        // Create a new session
        try {
          const { data, error } = await supabase
            .from("chat_sessions")
            .insert({
              visitor_id: storedVisitorId,
              status: "active",
            })
            .select()
            .single();

          if (!error && data) {
            storedSessionId = data.id;
            if (storedSessionId) {
              localStorage.setItem("chat_session_id", storedSessionId);
            }
          }
        } catch (err) {
          console.error("Error creating session:", err);
        }
      }

      setVisitorId(storedVisitorId);
      setSessionId(storedSessionId);
    };

    initSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to new messages from admin AND poll for updates
  useEffect(() => {
    if (!sessionId) return;

    // Real-time subscription for admin messages
    const subscription = supabase
      .channel(`chat:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          const newMessage = payload.new;
          // Add any new message (admin or bot or user)
          setMessages((prev) => {
            // Check if message already exists by ID or content
            const exists = prev.some(
              (m) =>
                m.id === newMessage.id ||
                (m.text === newMessage.content && m.sender === newMessage.sender)
            );
            if (exists) {
              return prev;
            }
            return [
              ...prev,
              {
                text: newMessage.content,
                sender: newMessage.sender,
                timestamp: new Date(newMessage.created_at),
                id: newMessage.id,
              },
            ];
          });
        }
      )
      .subscribe();

    // Polling fallback - check for new messages every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const { data: allMessages } = await supabase
          .from("chat_messages")
          .select("id, sender, content, created_at")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (allMessages) {
          setMessages((prev) => {
            // Create a set of existing message IDs and content pairs to avoid duplicates
            const existingMessages = new Set(
              prev
                .filter((m) => m.id) // Only messages with IDs
                .map((m) => m.id)
            );
            
            const newMessages = allMessages
              .filter((m: any) => !existingMessages.has(m.id))
              .map((m: any) => ({
                text: m.content,
                sender: m.sender,
                timestamp: new Date(m.created_at),
                id: m.id,
              }));

            if (newMessages.length > 0) {
              return [...prev, ...newMessages];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [sessionId]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading && sessionId && visitorId) {
      const userMessage = inputValue;

      setInputValue("");
      setIsLoading(true);

      try {
        // Call chat API - don't show message optimistically
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId: sessionId,
            visitorId: visitorId,
          }),
        });

        const data = await response.json();

        if (data.reply) {
          // Add bot response only if AI responded
          setMessages((prev) => [
            ...prev,
            {
              text: data.reply,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
        // If no reply (admin is responding), polling will pick up new messages
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
                {msg.sender === "admin" ? (
                  <div className="admin-message-group">
                    <div className="message-sender-label">Emman (Admin)</div>
                    <div className="message-bubble">{msg.text}</div>
                  </div>
                ) : (
                  <div className="message-bubble">{msg.text}</div>
                )}
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