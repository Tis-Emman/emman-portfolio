"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_id: string;
  last_message_time: string;
  lastMessage: string;
  lastMessageSender: string;
  unreadCount: number;
  admin_responded: boolean;
  status: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "admin";
  content: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch chat sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/admin/chat/sessions", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch sessions");
        }

        const data = await response.json();
        setSessions(data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load chat sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
    // Refresh every 5 seconds
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, [router]);

  // Fetch messages for selected session
  useEffect(() => {
    if (!selectedSessionId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/admin/chat/${selectedSessionId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  const handleSendResponse = async () => {
    if (!responseText.trim() || !selectedSessionId) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          message: responseText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send response");
      }

      setResponseText("");
      // Refresh messages
      const messagesResponse = await fetch(
        `/api/admin/chat/${selectedSessionId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
          },
        }
      );
      const data = await messagesResponse.json();
      setMessages(data.messages);
    } catch (err) {
      console.error("Error sending response:", err);
      setError("Failed to send response");
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p className="admin-spinner-text">Loading chats...</p>
      </div>
    );
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-sidebar-title">Admin Chat</h1>
          <div className="admin-sidebar-actions">
            <button
              onClick={() => router.push("/admin/logout")}
              className="admin-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="admin-sidebar-list">
          {sessions.length === 0 ? (
            <div className="admin-empty-state">No active conversations</div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`admin-chat-item ${
                  selectedSessionId === session.id ? "active" : ""
                }`}
              >
                <div className="admin-chat-item-content">
                  <div className="admin-chat-item-name">
                    {session.visitor_name || "Anonymous"}
                  </div>
                  <div className="admin-chat-item-preview">{session.lastMessage}</div>
                </div>
                <div className="admin-chat-item-meta">
                  <div className="admin-chat-item-time">
                    {new Date(session.last_message_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {session.unreadCount > 0 && (
                    <div className="admin-chat-item-badge">{session.unreadCount}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {selectedSessionId && selectedSession ? (
          <>
            {/* Header */}
            <div className="admin-header">
              <h2 className="admin-header-title">
                {selectedSession.visitor_name || "Anonymous"}
              </h2>
              <p className="admin-header-subtitle">{selectedSession.visitor_id}</p>
            </div>

            {/* Messages */}
            <div className="admin-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`admin-message ${msg.sender}`}
                >
                  <div className="admin-message-bubble">
                    <div className="admin-message-text">{msg.content}</div>
                    <div className="admin-message-label">
                      {msg.sender === "admin" && "You"}
                      {msg.sender === "bot" && "AI"}
                      {msg.sender === "user" && "Visitor"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="admin-input-area">
              {error && <div className="admin-input-error">{error}</div>}
              <div className="admin-input-form">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  className="admin-input-field"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim() || isSending}
                  className="admin-send-btn"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="admin-no-selection">
            Select a conversation to get started
          </div>
        )}
      </div>
    </div>
  );
}
