import { useEffect, useRef } from 'react';

const StarBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create stars
    const stars = [];
    const createStars = () => {
      stars.length = 0; // Clear existing stars
      const starCount = Math.floor((canvas.width * canvas.height) / 4000); // Slightly lower density
      
      for (let i = 0; i < starCount; i++) {
        // Determine star type - mostly small stars with a few larger ones
        const isLargeStar = Math.random() > 0.97;
        
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: isLargeStar ? 1 + Math.random() * 1.5 : Math.random() * 1.2,
          opacity: isLargeStar ? Math.random() * 0.9 + 0.1 : Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.05,
          hue: Math.random() > 0.7 ? 45 : 220, // Mostly blue with some warm gold tints
          twinkleSpeed: 0.0005 + Math.random() * 0.001,
        });
      }
    };
    
    // Draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // More subtle colors with varying saturation and lightness
        const saturation = star.hue === 45 ? '80%' : '70%';
        const lightness = 85 + 10 * Math.sin(Date.now() * star.twinkleSpeed) + '%';
        
        ctx.fillStyle = `hsla(${star.hue}, ${saturation}, ${lightness}, ${star.opacity * (0.5 + 0.5 * Math.sin(Date.now() * star.speed * 0.01))})`;
        ctx.fill();
        
        // Twinkle effect - more subtle and varied
        star.opacity = 0.1 + star.opacity * Math.abs(Math.sin(Date.now() * star.twinkleSpeed));
        
        // Very subtle movement
        star.x += Math.sin(Date.now() * 0.0005) * star.speed * 0.5;
        star.y += Math.cos(Date.now() * 0.0005) * star.speed * 0.5;
        
        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
      
      animationFrameId = requestAnimationFrame(drawStars);
    };
    
    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
      createStars();
    };
    
    // Initialize
    setCanvasDimensions();
    createStars();
    drawStars();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default StarBackground;