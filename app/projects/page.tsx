'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { useState, useEffect, useRef } from 'react' 

const PROJECTS_PER_PAGE = 4;
const FADE_OUT_DURATION = 250;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Cozy Crate E-Commerce",
      description: "A Java GUI Swing Program that uses SQLITE database for CRUD operations. Full-featured e-commerce application with inventory management, shopping cart, and order processing.",
      image: "/images/projects/cozy-crate.png",
      technologies: ["Java", "Swing", "SQLite", "JDBC"],
      liveLink: "",
      githubLink: ""
    },

    {
      id: 2,
      title: "EMEREN Inventory Management System",
      description: "An inventory management system for a local business. Features product tracking, stock management, and reporting tools to streamline operations.",
      image: "/images/projects/emeren_inventory.png",
      technologies: ["Javascript", "Typescript", "Tailwind CSS", "Supabase"],
      liveLink: "",
      githubLink: ""
    },

    {
      id: 3,
      title: "Sinervet VetHub",
      description: "A comprehensive website for veterinary services at local town. Features appointment booking, pet records management, and service information for pet owners.",
      image: "/images/projects/sinervet.png",
      technologies: ["React", "Node.js", "MongoDB"],
      liveLink: "",
      githubLink: ""
    },
    {
      id: 4,
      title: "Korean Express",
      description: "A modern Korean grocery delivery platform offering authentic ingredients and fast, reliable service.",
      image: "/images/projects/korean_express.png",
      technologies: ["React", "Node.js", "MongoDB"],
      liveLink: "",
      githubLink: ""
    },
        {
      id: 5,
      title: "E Tour Travels",
      description: "A static website for our first year, first sem project. Beautiful travel booking website showcasing various destinations and tour packages with responsive design.",
      image: "/images/projects/e-tour-travels.png",
      technologies: ["HTML", "CSS", "JavaScript"],
      liveLink: "",
      githubLink: ""
    },
  ]

  const usePagination = projects.length > 4;
  const totalPages = usePagination ? Math.ceil(projects.length / PROJECTS_PER_PAGE) : 1;

  const displayedProjects = usePagination
    ? projects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE)
    : projects;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isAnimating) return;

    setIsAnimating(true);
    setIsFadingIn(false);

    animTimeoutRef.current = setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
      setIsFadingIn(true);
      animTimeoutRef.current = setTimeout(() => {
        setIsFadingIn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, FADE_OUT_DURATION);
    }, FADE_OUT_DURATION);
  };

  return (
    <div className="projects-page">
      <div className="projects-content">
        {/* Header */}
        <div className="projects-header">
          <div className="container">
            <Link href="/" className="back-button">
              ← Back to Home
            </Link>
            <div className="header-content-projects">
              <div>
                <h1>All Projects</h1>
                <p className="subtitle">
                  A comprehensive collection of my work spanning web development,
                  desktop applications, and full-stack solutions.
                </p>
              </div>
              <div className="projects-stats">
                <div className="stat-item">
                  <span className="stat-number">{projects.length}</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">12+</span>
                  <span className="stat-label">Technologies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container">
          <div
            className={`all-projects-grid ${
              isAnimating ? "grid-fade-out" : isFadingIn ? "grid-fade-in" : ""
            }`}
          >
            {displayedProjects.map((project) => (
              <div key={project.id} className="project-card-full">
                <div className="project-image-wrapper">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="project-image-full"
                  />
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label="View live project">
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label="View GitHub repository">
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-info-full">
                  <h3>{project.title}</h3>
                  <p className="project-description-full">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {usePagination && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span className="nav-arrow">‹</span> Prev
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next <span className="nav-arrow">›</span>
              </button>
            </div>
          )}
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