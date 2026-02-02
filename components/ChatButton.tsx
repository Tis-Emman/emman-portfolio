'use client'

import { useState } from 'react'

export default function ChatButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        className="chat-button" 
        onClick={() => setIsModalOpen(true)}
        title="Chat with me"
      >
        💬
      </button>

      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <span 
              className="close-modal" 
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h2 style={{ marginBottom: '0.5rem' }}>Chat with Me</h2>
            <p style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              ● Online
            </p>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Hi there! 👋 Thanks for checking out my website! Feel free to ask about my projects, skills, or anything else. How can I help you today?
            </p>
            <div className="form-group">
              <textarea 
                placeholder="Type your message..." 
                style={{ minHeight: '100px' }}
              />
            </div>
            <button className="btn-submit">Send Message</button>
          </div>
        </div>
      )}
    </>
  )
}
