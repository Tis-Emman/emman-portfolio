export default function Recommendations() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-header-icon">💬</span>
        Recommendations
      </div>
      <div className="recommendation-card">
        <p className="recommendation-text">&quot;Write a testimonial or recommendation from a client or colleague here.&quot;</p>
        <p className="recommendation-author">— Person Name</p>
      </div>
      <div className="carousel-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
      </div>
    </div>
  )
}
