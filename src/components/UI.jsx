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

  // Calculate opacity for the scrolling text based on scroll position
  const textOpacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.5)));
  
  // Calculate scroll indicator text
  const scrollText = scrollY > window.innerHeight * 0.3 
    ? "Scroll up to enlarge" 
    : "Scroll down to discover books";

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        <a
          className="pointer-events-auto mt-10 ml-10 cursor-pointer"
          onClick={() => window.location.reload()}
          title="Reload page"
        >
          <img className="w-20" src="/images/wawasensei-white.png" alt="YOUR BOOK" />
        </a>
        

        
        {/* Scroll indicator */}
        <div 
          className="flex flex-col items-center mb-10 transition-all duration-300"
        >
          <p className="text-white text-lg mb-2">{scrollText}</p>
          <svg 
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              scrollY > window.innerHeight * 0.3 ? "rotate-180 animate-bounce" : "animate-bounce"
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
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h2 className="shrink-0 text-white text-13xl font-bold">
              Enjoy reading books
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h2 className="shrink-0 text-white text-13xl font-bold">
              Enjoy reading books
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
