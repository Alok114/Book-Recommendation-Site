import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pageAtom = atom(1); // Start with page 1 (first page after cover)
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = ({ scrollY = 0 }) => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 768;
  
  // Calculate opacity for the scrolling text based on scroll position
  // Fade out faster on mobile
  const fadeThreshold = isMobile ? 0.3 : 0.5;
  const textOpacity = Math.max(0, 1 - (scrollY / (window.innerHeight * fadeThreshold)));
  
  // Calculate scroll indicator text and threshold for mobile
  const scrollThreshold = isMobile ? 0.15 : 0.3;
  const scrollText = scrollY > window.innerHeight * scrollThreshold 
    ? "Scroll up to enlarge" 
    : "Scroll down to discover books";

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        <a
          className="pointer-events-auto mt-4 sm:mt-6 md:mt-10 ml-4 sm:ml-6 md:ml-10 cursor-pointer"
          onClick={() => window.location.reload()}
          title="Reload page"
        >
          <img className="w-12 sm:w-16 md:w-20" src="/images/wawasensei-white.png" alt="YOUR BOOK" />
        </a>
        
        {/* Scroll indicator */}
        <div 
          className="flex flex-col items-center mb-4 sm:mb-6 md:mb-10 transition-all duration-300"
        >
          <p className="text-white text-sm sm:text-base md:text-lg mb-1 sm:mb-2 px-2 text-center">{scrollText}</p>
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white transition-transform duration-300 ${
              scrollY > window.innerHeight * scrollThreshold ? "rotate-180 animate-bounce" : "animate-bounce"
            }`}
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </main>

      <div 
        className="fixed inset-0 flex items-center -rotate-2 select-none transition-opacity duration-300"
        style={{ opacity: textOpacity }}
      >
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-4 sm:gap-6 md:gap-8 w-max px-4 sm:px-6 md:px-8">
            <h2 className="shrink-0 text-white text-6xl sm:text-8xl md:text-10xl lg:text-13xl font-bold">
              Enjoy reading books
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 w-max">
            <h2 className="shrink-0 text-white text-6xl sm:text-8xl md:text-10xl lg:text-13xl font-bold">
              Enjoy reading books
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
