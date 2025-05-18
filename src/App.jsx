import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { BookSearch } from "./components/BookSearch";
import StarBackground from "./components/StarBackground";
import FallingPapers from "./components/FallingPapers";
import CursorEffects from "./components/CursorEffects";

function App() {
  const [scrollY, setScrollY] = useState(0);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Make the body scrollable with enough height
    document.body.style.height = "300vh"; // 3x viewport height to allow scrolling
    document.body.style.minWidth = "100vw"; // Ensure minimum width
    
    // Apply the gradient background to the entire document
    document.documentElement.style.background = "radial-gradient(#8B4513, #0A0A14 80%)";
    document.documentElement.style.backgroundAttachment = "fixed"; // Keep the gradient fixed while scrolling
    document.documentElement.style.minWidth = "100vw"; // Ensure minimum width
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <>
      {/* Custom cursor and sparkle effects */}
      <CursorEffects />
      
      {/* Background overlay to ensure the gradient is consistent */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(#8B4513, #0A0A14 80%)",
          zIndex: -1
        }}
      />
      
      {/* Stars background effect */}
      <StarBackground />
      
      {/* Falling papers effect */}
      <FallingPapers />
      
      <UI scrollY={scrollY} />
      <BookSearch scrollY={scrollY} />
      <Loader />
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%",
          pointerEvents: scrollY > window.innerHeight * 0.3 ? 'none' : 'auto', // Make it easier to scroll on mobile
          maxHeight: window.innerWidth <= 768 ? '70vh' : '100%' // Limit height on mobile
        }}
      >
        <Canvas shadows camera={{
            position: [-0.5, 1, 3], // Centered position for the book
            fov: window.innerWidth <= 768 ? 50 : 40, // Wider FOV on mobile to see more
          }}>
          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience scrollY={scrollY} />
            </Suspense>
          </group>
        </Canvas>
      </div>
    </>
  );
}

export default App;
