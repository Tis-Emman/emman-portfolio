'use client'

import Link from 'next/link'
import { 
  Monitor, 
  Database, 
  Target, 
  BarChart3, 
  Wrench, 
  Brain,
  Server
} from 'lucide-react'

export default function TechStackPage() {
  const techStack = {
    frontend: {
      title: "Frontend",
      icon: Monitor,
      technologies: [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", 
        "Next.js", "Tailwind CSS", "Vite", "Figma", 
      ]
    },
    backend: {
      title: "Backend",
      icon: Server,
      technologies: [
       "Node.js", "Express", "Java", "Python",  "C#", "C++"
      ]
    },
    cms: {
      title: "Database Management",
      icon: Database,
      technologies: [
        "PostgreSQL", "MySQL", "SSMS", "MongoDB"
      ]
    },
    dataAnalysis: {
      title: "Data Analysis",
      icon: BarChart3,
      technologies: [
        "SQL", "Python", "Data Visualization", "Excel"
      ]
    },
    tools: {
      title: "Tools & DevOps",
      icon: Wrench,
      technologies: [
        "Git & GitHub", "VS Code", "npm", "AWS", "Docker", "Kubernetes"
      ]
    },
    ai: {
      title: "AI & Intelligent Systems",
      icon: Brain,
      technologies: [
        "Gemini AI API", "Prompt Engineering", "LLM Orchestration", "AI-Driven Content"
      ]
    }
  }

  return (
    <div className="tech-stack-page">
      {/* Main content area */}
      <div className="tech-stack-content">
        {/* Header */}
        <div className="tech-stack-header">
          <div className="container">
            <Link href="/" className="back-button">
              ← Back to Home
            </Link>
            
            <div className="header-content-stack">
              <div>
                <h1>Full Tech Stack</h1>
                <p className="subtitle">Comprehensive list of tools and technologies I use.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="container">
          <div className="tech-stack-grid">
            {Object.values(techStack).map((category, idx) => {
              const IconComponent = category.icon
              return (
                <div key={idx} className="tech-stack-category-card">
                  <div className="category-header">
                    <IconComponent className="category-icon-svg" size={20} />
                    <h2>{category.title}</h2>
                  </div>
                  <div className="tech-tags-full">
                    {category.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="tech-tag-full">{tech}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  )
}
