'use client'

import { useEffect, useState } from 'react'

export default function Timer() {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formattedTime = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setCurrentTime(formattedTime)
    }

    updateTime()
    const intervalId = setInterval(updateTime, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <p className="text-xs text-gray-500 md:text-sm">{currentTime}</p>
}
