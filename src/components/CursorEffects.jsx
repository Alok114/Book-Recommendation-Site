import React, { useState, useEffect } from 'react';

// Styles for sparkles only
const styles = `
  /* Sparkle effect styles */
  .sparkle-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
  }

  .spark {
    position: absolute;
    border-radius: 50%;
    transform-origin: center;
    pointer-events: none;
    will-change: transform, opacity;
    box-shadow: 0 0 8px 2px currentColor;
    animation: sparkle-pulse 0.3s ease-out infinite alternate;
  }

  @keyframes sparkle-pulse {
    0% {
      box-shadow: 0 0 4px 1px currentColor;
    }
    100% {
      box-shadow: 0 0 8px 2px currentColor;
    }
  }
`;

const CursorEffects = () => {
  // Sparkle state
  const [sparks, setSparks] = useState([]);
  
  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Handle click events for sparkles
  useEffect(() => {
    const handleClick = (e) => {
      createSpark(e.clientX, e.clientY);
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Sparkle effects
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  const createSpark = (x, y) => {
    const sparkCount = 12; // Number of particles per click
    const newSparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const size = Math.random() * 10 + 5; // Random size between 5-15px
      const angle = Math.random() * Math.PI * 2; // Random angle in radians
      const speed = Math.random() * 70 + 30; // Random speed
      const lifetime = Math.random() * 600 + 400; // Random lifetime between 400-1000ms
      
      // Calculate the distance the particle will travel
      const distance = speed * (lifetime / 1000);
      
      // Calculate the final position
      const finalX = x + Math.cos(angle) * distance;
      const finalY = y + Math.sin(angle) * distance;
      
      // Random color - gold, white, or amber
      const colors = [
        'rgba(255, 215, 0, 0.8)', // Gold
        'rgba(255, 255, 255, 0.8)', // White
        'rgba(255, 191, 0, 0.8)', // Amber
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newSparks.push({
        id: generateId(),
        initialX: x,
        initialY: y,
        finalX,
        finalY,
        size,
        color,
        lifetime,
        createdAt: Date.now(),
      });
    }
    
    setSparks(prev => [...prev, ...newSparks]);
  };
  
  // Remove sparks after their lifetime
  useEffect(() => {
    if (sparks.length === 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setSparks(prev => prev.filter(spark => now - spark.createdAt < spark.lifetime));
    }, 100);
    
    return () => clearInterval(interval);
  }, [sparks]);
  
  return (
    <>
      {/* Sparkle effect */}
      <div className="sparkle-container">
        {sparks.map(spark => {
          const progress = Math.min((Date.now() - spark.createdAt) / spark.lifetime, 1);
          const opacity = 1 - progress;
          const currentX = spark.initialX + (spark.finalX - spark.initialX) * progress;
          const currentY = spark.initialY + (spark.finalY - spark.initialY) * progress;
          
          return (
            <div
              key={spark.id}
              className="spark"
              style={{
                left: `${currentX}px`,
                top: `${currentY}px`,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                backgroundColor: spark.color,
                opacity: opacity,
                transform: `scale(${1 - progress * 0.7})`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default CursorEffects;