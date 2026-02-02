'use client'

import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [scrollWidth, setScrollWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollWidth(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="scroll-indicator" 
      style={{ width: `${scrollWidth}%` }}
    />
  )
}
