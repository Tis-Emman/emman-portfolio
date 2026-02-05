import Image from 'next/image'
import { Target } from 'lucide-react'

export default function BeyondScreen() {
  return (
    <div className="card">
      <div className="card-header">
        <Target className="w-5 h-5 text-yellow-500" />
        Beyond the Screen
      </div>

      <p className="about-text" style={{ marginBottom: '1rem' }}>
        Outside of work, I recharge by playing guitar, coding personal projects,
        and cooking. I also stay active with walks and exercise, which keeps me
        creative, curious, and balanced.
      </p>

      <div className="hobbies-grid">
        <div className="hobby-card">
          <Image
            src="/images/hobby_1.png"
            alt="Hobby 1"
            width={300}
            height={200}
          />
        </div>
        <div className="hobby-card">
          <Image
            src="/images/hobby_2.png"
            alt="Hobby 2"
            width={300}
            height={200}
          />
        </div>
      </div>
    </div>
  )
}
