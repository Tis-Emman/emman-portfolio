import Image from 'next/image'

export default function BeyondScreen() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-header-icon">🎯</span>
        Beyond the Screen
      </div>
      <p className="about-text" style={{ marginBottom: '1rem' }}>
        Describe your hobbies and interests outside of work. What do you do to recharge and stay creative? Share what makes you unique beyond your professional life.
      </p>
      <div className="hobbies-grid">
        <div className="hobby-card">
          <Image
            src="https://via.placeholder.com/300x200/111111/00ffff?text=Hobby+1"
            alt="Hobby 1"
            width={300}
            height={200}
          />
        </div>
        <div className="hobby-card">
          <Image
            src="https://via.placeholder.com/300x200/111111/00ffff?text=Hobby+2"
            alt="Hobby 2"
            width={300}
            height={200}
          />
        </div>
        <div className="hobby-card">
          <Image
            src="https://via.placeholder.com/300x200/111111/00ffff?text=Hobby+3"
            alt="Hobby 3"
            width={300}
            height={200}
          />
        </div>
        <div className="hobby-card">
          <Image
            src="https://via.placeholder.com/300x200/111111/00ffff?text=Hobby+4"
            alt="Hobby 4"
            width={300}
            height={200}
          />
        </div>
      </div>
    </div>
  )
}
