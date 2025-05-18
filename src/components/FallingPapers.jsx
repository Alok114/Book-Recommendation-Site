import { useEffect, useRef } from 'react';

const FallingPapers = () => {
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
    
    // Create paper objects
    const papers = [];
    const createPapers = () => {
      papers.length = 0; // Clear existing papers
      const paperCount = Math.floor((canvas.width * canvas.height) / 30000); // Adjust density (slightly fewer papers)
      
      for (let i = 0; i < paperCount; i++) {
        papers.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height, // Start above the screen
          width: 15 + Math.random() * 15,
          height: 20 + Math.random() * 10,
          speed: 1 + Math.random() * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          opacity: 0.3 + Math.random() * 0.4,
          swingFactor: Math.random() * 2,
          swingOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    
    // Draw papers
    const drawPapers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      papers.forEach(paper => {
        ctx.save();
        
        // Move to paper position and apply rotation
        ctx.translate(paper.x, paper.y);
        ctx.rotate(paper.rotation);
        
        // Draw paper with slight transparency and a vintage look
        ctx.globalAlpha = paper.opacity;
        
        // Create a slight gradient for a more paper-like look
        const gradient = ctx.createLinearGradient(
          -paper.width / 2, 
          -paper.height / 2, 
          paper.width / 2, 
          paper.height / 2
        );
        gradient.addColorStop(0, '#f5f5dc'); // Beige
        gradient.addColorStop(1, '#e8e4c9'); // Slightly darker beige
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);
        
        // Add a subtle border
        ctx.globalAlpha = paper.opacity * 0.3;
        ctx.strokeStyle = '#a89e8a';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);
        
        // Add text-like elements to make it look like a page from a book
        ctx.globalAlpha = paper.opacity * 0.7;
        ctx.lineWidth = 0.5;
        
        // Draw 4-6 lines to simulate text
        const lineCount = 4 + Math.floor(Math.random() * 2);
        const lineSpacing = paper.height / (lineCount + 1);
        
        for (let i = 0; i < lineCount; i++) {
          const y = -paper.height / 2 + lineSpacing * (i + 1);
          const lineWidth = paper.width * (0.6 + Math.random() * 0.3);
          
          // Vary the color slightly for some lines to simulate different text elements
          if (i === 0 && Math.random() > 0.5) {
            // Title-like element
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 0.8;
          } else {
            // Regular text
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 0.5;
          }
          
          ctx.beginPath();
          ctx.moveTo(-paper.width / 2 + (paper.width - lineWidth) / 2, y);
          ctx.lineTo(-paper.width / 2 + (paper.width - lineWidth) / 2 + lineWidth, y);
          ctx.stroke();
        }
        
        // Sometimes add a page number
        if (Math.random() > 0.7) {
          ctx.fillStyle = '#777';
          ctx.font = '2px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(Math.floor(Math.random() * 300).toString(), 0, paper.height / 2 - 2);
        }
        
        ctx.restore();
        
        // Update position
        paper.y += paper.speed;
        paper.x += Math.sin(Date.now() * 0.001 * paper.swingFactor + paper.swingOffset) * 0.5;
        paper.rotation += paper.rotationSpeed;
        
        // Reset if paper goes off screen
        if (paper.y > canvas.height + paper.height) {
          paper.y = -paper.height;
          paper.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = requestAnimationFrame(drawPapers);
    };
    
    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
      createPapers();
    };
    
    // Initialize
    setCanvasDimensions();
    createPapers();
    drawPapers();
    
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
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default FallingPapers;