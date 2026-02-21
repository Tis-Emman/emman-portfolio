// Chat-related database types

export interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  created_at: string;
  last_message_time: string;
  status: "active" | "closed";
  admin_responded: boolean;
  created_by_ip: string | null;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "bot" | "admin";
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}
