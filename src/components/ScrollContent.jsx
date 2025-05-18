import React, { useEffect, useState } from 'react';

export const ScrollContent = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Show content when scrolled down enough
      if (window.scrollY > window.innerHeight * 0.3) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate opacity based on scroll position
  const opacity = Math.min(1, (scrollY - window.innerHeight * 0.3) / (window.innerHeight * 0.3));
  
  const featuredBooks = [
    {
      title: "The Great Adventure",
      author: "J.R. Thompson",
      description: "A thrilling journey through uncharted territories.",
      category: "Adventure"
    },
    {
      title: "Mysteries of the Mind",
      author: "Elena Cortez",
      description: "Exploring the depths of human consciousness and perception.",
      category: "Psychology"
    },
    {
      title: "The Last Frontier",
      author: "Michael Chen",
      description: "A science fiction epic about humanity's expansion to the stars.",
      category: "Sci-Fi"
    },
    {
      title: "Cooking with Passion",
      author: "Sofia Rossi",
      description: "Delicious recipes from around the world with a personal touch.",
      category: "Cooking"
    },
    {
      title: "Historical Perspectives",
      author: "David Williams",
      description: "A deep dive into pivotal moments that shaped our world.",
      category: "History"
    },
    {
      title: "Poetry in Motion",
      author: "Amara Johnson",
      description: "A collection of poems celebrating life, love, and nature.",
      category: "Poetry"
    }
  ];

  return (
    <div 
      className="scroll-content"
      style={{
        position: "absolute",
        top: "100vh",
        left: 0,
        width: "100%",
        minHeight: "100vh",
        background: "radial-gradient(#8B4513, #1A0F00 80%)",
        padding: "2rem",
        opacity: opacity,
        transition: "opacity 0.3s ease-in",
        color: "white",
        textAlign: "center",
        display: isVisible ? 'block' : 'none'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-12">Explore Our Collection</h1>
        
        <p className="text-xl max-w-3xl mx-auto mb-16">
          Discover a world of stories, knowledge, and adventure through our carefully curated collection of books.
          Each page offers a new journey, a new perspective, and a new opportunity to expand your horizons.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredBooks.map((book, index) => (
            <div 
              key={index} 
              className="book-category bg-white/10 p-6 rounded-lg text-left"
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                {book.category}
              </span>
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              <p className="text-white/70 mb-2">by {book.author}</p>
              <p>{book.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white/5 p-8 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Join Our Reading Community</h2>
          <p className="text-lg mb-8">
            Connect with fellow book lovers, participate in reading challenges, and get personalized recommendations.
          </p>
          <button className="bg-white text-brown-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-white/90 transition-colors">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};