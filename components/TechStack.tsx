export default function TechStack() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-header-icon">⚡</span>
        Tech Stack
        <a href="#" className="view-all">View All &gt;</a>
      </div>
      <div className="tech-category">
        <h4>Frontend</h4>
        <div className="tech-tags">
          <span className="tag">Html</span>
          <span className="tag">Css</span>
          <span className="tag">Javascript</span>
          <span className="tag">Typescript</span>
          <span className="tag">React</span>
        </div>
      </div>
      <div className="tech-category">
        <h4>Backend</h4>
        <div className="tech-tags">
          <span className="tag">Node JS</span>
          <span className="tag">Java</span>
          <span className="tag">Express JS</span>
          <span className="tag">C#</span>  
          <span className="tag">Python</span>
        </div>
      </div>
      <div className="tech-category">
        <h4>Databases</h4>
        <div className="tech-tags">
          <span className="tag">PostgreSQL</span>
          <span className="tag">MySQL</span>
          <span className="tag">MongoDB</span>
          <span className="tag">MSSQL Server</span>  
          <span className="tag">Redis</span>
        </div>
      </div>
            <div className="tech-category">
        <h4>Tools & DevOps</h4>
        <div className="tech-tags">
          <span className="tag">Git</span>
          <span className="tag">Github</span>
          <span className="tag">AWS</span>
          <span className="tag">Docker</span>
          <span className="tag">Kubernetes</span>
        </div>
      </div>
    </div>
  )
}
