import { useState, useCallback, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState([])
  const counterRef = useRef(null)
  const particleIdRef = useRef(0)

  const triggerAnimation = useCallback(() => {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 250)
  }, [])

  const spawnParticles = useCallback((color) => {
    const newParticles = Array.from({ length: 8 }, () => {
      const angle = Math.random() * Math.PI * 2
      const distance = 40 + Math.random() * 60
      return {
        id: particleIdRef.current++,
        x: '50%',
        y: '40%',
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance}px`,
        color,
      }
    })
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)))
    }, 800)
  }, [])

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + step)
    triggerAnimation()
    spawnParticles('#00d4ff')
  }, [step, triggerAnimation, spawnParticles])

  const handleDecrement = useCallback(() => {
    setCount((prev) => prev - step)
    triggerAnimation()
    spawnParticles('#f472b6')
  }, [step, triggerAnimation, spawnParticles])

  const handleReset = useCallback(() => {
    setCount(0)
    triggerAnimation()
    spawnParticles('#fbbf24')
  }, [triggerAnimation, spawnParticles])

  const handleStepChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setStep(value)
    }
  }

  const createRipple = (e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  const getValueClass = () => {
    if (count > 0) return 'counter-value--positive'
    if (count < 0) return 'counter-value--negative'
    return 'counter-value--zero'
  }

  const getLabel = () => {
    if (count > 0) return 'Positive'
    if (count < 0) return 'Negative'
    return 'Zero'
  }

  return (
    <div className="app-container">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb--cyan" aria-hidden="true" />
      <div className="bg-orb bg-orb--purple" aria-hidden="true" />
      <div className="bg-orb bg-orb--pink" aria-hidden="true" />

      {/* Counter Card */}
      <div className="counter-card" ref={counterRef}>
        <h1 className="counter-title">React Counter</h1>

        {/* Counter Display */}
        <div className="counter-display">
          <div className="particles-container" aria-hidden="true">
            {particles.map((p) => (
              <span
                key={p.id}
                className="particle"
                style={{
                  left: p.x,
                  top: p.y,
                  backgroundColor: p.color,
                  '--tx': p.tx,
                  '--ty': p.ty,
                }}
              />
            ))}
          </div>

          <div
            id="counter-value"
            className={`counter-value ${getValueClass()} ${animating ? 'counter-value--animate' : ''}`}
            aria-live="polite"
            aria-label={`Counter value: ${count}`}
          >
            {count}
          </div>
          <div className="counter-label">{getLabel()}</div>
        </div>

        {/* Action Buttons */}
        <div className="counter-buttons">
          <button
            id="btn-decrement"
            className="btn btn--decrement"
            onClick={(e) => { createRipple(e); handleDecrement(); }}
            aria-label={`Decrement by ${step}`}
          >
            <span className="btn-icon">−</span>
            Decrement
          </button>

          <button
            id="btn-reset"
            className="btn btn--reset"
            onClick={(e) => { createRipple(e); handleReset(); }}
            aria-label="Reset counter to zero"
          >
            <span className="btn-icon">↺</span>
            Reset
          </button>

          <button
            id="btn-increment"
            className="btn btn--increment"
            onClick={(e) => { createRipple(e); handleIncrement(); }}
            aria-label={`Increment by ${step}`}
          >
            <span className="btn-icon">+</span>
            Increment
          </button>
        </div>

        {/* Step Size Control */}
        <div className="step-control">
          <label className="step-label" htmlFor="step-input">Step Size</label>
          <input
            id="step-input"
            className="step-input"
            type="number"
            min="1"
            value={step}
            onChange={handleStepChange}
            aria-label="Set step size"
          />
        </div>
      </div>
    </div>
  )
}

export default App
