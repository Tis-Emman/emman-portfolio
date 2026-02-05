import { MessageCircle } from "lucide-react";

export default function Recommendations() {
  return (
    <div className="card">
      <div className="card-header">
        <MessageCircle className="card-header-icon" />
        Recommendations
      </div>

      <div className="recommendation-card">
        <p className="recommendation-text">
          &quot;He's a great team member&quot;
        </p>
        <p className="recommendation-author">- Dela Cruz</p>
      </div>

      <div className="carousel-dots">
        <span className="dot active"></span>
      </div>
    </div>
  );
}
