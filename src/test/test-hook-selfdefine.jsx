import { useState, useEffect } from 'react'

const useMousePosition = () => {
  const [postion, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updater = e => {
      setPosition({
        x: e.clientX,
        y: e.clientY
      })
    }
    document.addEventListener('mousemove', updater)
    return () => {
      document.removeEventListener('mousemove', updater)
    }
  })
  return postion
}

export default useMousePosition