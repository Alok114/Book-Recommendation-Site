import { useState, useEffect, useRef } from 'react';
import { BookModal } from './BookModal';
import { getBookRecommendationsByFilter, getBookRecommendationsByTitle } from '../utils/bookRecommendationService';
import './scrollbar.css';
import './BookStyles.css';

const GENRE = [
  {title: "Fiction", value: "fiction"},
  {title: "Non-Fiction", value: "non-fiction"},
  {title: "Thriller", value: "thriller"},
  {title: "Romance", value: "romance"},
  {title: "Sci-fi", value: "sci-fi"},
  {title: "Biography", value: "biography"},
  {title: "Comedy", value: "comedy"},
  {title: "Poetry", value: "poetry"},
  {title: "Self-help", value: "self-help"},
  {title: "Finance", value: "finance"},
  {title: "Travel", value: "travel"},
  {title: "Art", value: "art"},
];

const BOOK_LENGTH = [
  {title: "Short Stories", value: "short-stories"},
  {title: "Novellas", value: "short-novels"},
  {title: "Novels", value: "novels"},
];

// Direct search function for Google Books API
const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=en&maxResults=16`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google Books API');
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return [];
    }
    
    return data.items.map(book => {
      const volumeInfo = book.volumeInfo || {};
      return {
        id: book.id,
        title: volumeInfo.title || 'Unknown Title',
        subtitle: volumeInfo.subtitle,
        authors: volumeInfo.authors || ['Unknown Author'],
        summary: volumeInfo.description || 'No description available',
        genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown',
        publisher: volumeInfo.publisher || 'Unknown',
        image: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover',
        publishedDate: volumeInfo.publishedDate,
        pageCount: volumeInfo.pageCount
      };
    });
  } catch (error) {
    console.error('Error searching Google Books:', error);
    throw error;
  }
};

export const BookSearch = ({ scrollY = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('fiction');
  const [selectedLength, setSelectedLength] = useState('novels');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(8); // Initial number of books to display
  const [favorites, setFavorites] = useState([]); // Store favorite books
  const [showFavorites, setShowFavorites] = useState(false); // Toggle to show favorites
  const containerRef = useRef(null);
  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bookFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        
        // Validate that all favorites have IDs
        const validFavorites = parsedFavorites.filter(book => {
          if (!book.id) {
            console.warn('Found favorite book without ID, removing from favorites:', book);
            return false;
          }
          return true;
        });
        
        setFavorites(validFavorites);
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);
  
  // Calculate opacity based on scroll position
  const containerOpacity = Math.min(1, Math.max(0, (scrollY - window.innerHeight * 0.3) / (window.innerHeight * 0.2)));
  
  // Toggle a book as favorite
  const toggleFavorite = (e, book) => {
    e.stopPropagation(); // Prevent opening the modal
    
    // Ensure the book has an ID
    if (!book.id) {
      console.error('Book is missing ID:', book);
      return;
    }
    
    setFavorites(prevFavorites => {
      // Check if book is already in favorites
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === book.id);
      
      let newFavorites;
      if (isAlreadyFavorite) {
        // Remove from favorites
        newFavorites = prevFavorites.filter(fav => fav.id !== book.id);
      } else {
        // Add to favorites
        newFavorites = [...prevFavorites, book];
      }
      
      // Save to localStorage
      localStorage.setItem('bookFavorites', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };
  
  // Check if a book is in favorites
  const isFavorite = (bookId) => {
    if (!bookId) return false;
    return favorites.some(fav => fav.id === bookId);
  };
  
  // Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('bookFavorites');
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setDisplayCount(8); // Reset display count for new search
    
    try {
      let results;
      
      // If search term is empty, get recommendations based on selected genre and length only
      if (!searchTerm.trim()) {
        results = await getBookRecommendationsByFilter({
          genre: selectedGenre,
          bookLength: selectedLength,
          searchType: 'category'
        });
      }
      // If the search term looks like a specific book title (longer than 3 words)
      else if (searchTerm.split(' ').length > 2) {
        // Get recommendations based on the book title
        results = await getBookRecommendationsByTitle(searchTerm, selectedGenre);
      } 
      // If search term is moderately long, do a direct search
      else if (searchTerm.length > 3) {
        // Direct search in Google Books API
        results = await searchGoogleBooks(searchTerm);
      } 
      // For short search terms, use them as keywords for recommendations
      else {
        // Get recommendations based on filters
        results = await getBookRecommendationsByFilter({
          genre: selectedGenre,
          bookLength: selectedLength,
          searchTerm: searchTerm
        });
      }
      
      // Validate that all recommendations have IDs
      const validResults = results.map(book => {
        if (!book.id) {
          console.warn('Book missing ID, generating one:', book);
          // Generate a fallback ID if needed
          book.id = `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '')}_${(book.authors || ['unknown']).join('').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }
        return book;
      });
      
      setRecommendations(validResults);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center transition-all duration-500"
      style={{ 
        opacity: containerOpacity,
        visibility: containerOpacity > 0.2 ? 'visible' : 'hidden',
        pointerEvents: containerOpacity > 0.2 ? 'auto' : 'none',
        transform: `translateY(${containerOpacity < 0.5 ? '20px' : '0'})`,
        zIndex: 50,
        minWidth: '320px',
        boxSizing: 'border-box'
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-h-[92vh] overflow-hidden" style={{ zIndex: 50, minWidth: '300px' }}>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20 max-h-full overflow-hidden" style={{ zIndex: 50, minWidth: '280px', outline: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center">
            Find Your Next Book
            <span className="block text-xs sm:text-sm font-normal text-white/70 mt-1 sm:mt-2">
              Enter a book title to get AI-powered recommendations or search by genre
            </span>
            {!import.meta.env.VITE_OPENROUTER_API_KEY && (
              <span className="block text-xs font-normal text-amber-400/90 mt-1">
                Note: Add your OpenRouter API key in the .env file for AI-powered recommendations
              </span>
            )}
          </h2>
          
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter book title or keywords (optional)"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ zIndex: 60 }}
                  disabled={showFavorites}
                />
              </div>
              <button
                type="submit"
                disabled={loading || showFavorites}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base rounded-lg transition-colors duration-300 disabled:opacity-50"
                style={{ zIndex: 60 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Finding books...</span>
                    <span className="sm:hidden">Searching...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-1 h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden sm:inline">Get Recommendations</span>
                    <span className="sm:hidden">Search</span>
                  </span>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div>
                <label className="block text-white/80 mb-1 sm:mb-2 text-xs sm:text-sm">Genre</label>
                <select
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  style={{ zIndex: 60 }}
                  disabled={showFavorites}
                >
                  {GENRE.map((genre) => (
                    <option key={genre.value} value={genre.value} className="bg-gray-800">
                      {genre.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-1 sm:mb-2 text-xs sm:text-sm">Book Length</label>
                <select
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  style={{ zIndex: 60 }}
                  disabled={showFavorites}
                >
                  {BOOK_LENGTH.map((length) => (
                    <option key={length.value} value={length.value} className="bg-gray-800">
                      {length.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-1 sm:mb-2 text-xs sm:text-sm">View Mode</label>
                <div className="flex bg-white/10 rounded-lg p-1 border border-white/30">
                  <button
                    type="button"
                    className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      !showFavorites 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setShowFavorites(false)}
                  >
                    <span className="hidden xs:inline">Recommendations</span>
                    <span className="xs:hidden">Books</span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      showFavorites 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setShowFavorites(true)}
                  >
                    Favorites {favorites.length > 0 && <span className="inline-block ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{favorites.length}</span>}
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : showFavorites ? (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Favorite Books
                  {favorites.length === 0 && (
                    <span className="block text-xs sm:text-sm font-normal text-white/70 mt-1 sm:mt-2">
                      You haven't added any favorites yet. Click the star icon on any book to add it to your favorites.
                    </span>
                  )}
                </h3>
                
                {favorites.length > 0 && (
                  <button
                    onClick={clearAllFavorites}
                    className="text-white/70 hover:text-white text-xs sm:text-sm flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear All
                  </button>
                )}
              </div>
              {favorites.length > 0 && (
                <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Split favorites into rows of 4 (or 3 on tablet, 3 on mobile) */}
                  {Array.from({ length: Math.ceil(favorites.length / 4) }).map((_, shelfIndex) => (
                    <div key={shelfIndex} className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6 pb-6 bookshelf mb-8">
                      {favorites.slice(shelfIndex * 4, Math.min((shelfIndex + 1) * 4, favorites.length)).map((book, index) => (
                        <div 
                          key={index} 
                          className={`book-container cursor-pointer ${selectedBook?.id === book.id ? 'selected-book' : ''}`}
                          onClick={() => {
                            setSelectedBook(book);
                            setIsModalOpen(true);
                          }}
                          tabIndex="0"
                          role="button"
                          aria-label={`View details for ${book.title}`}
                        >
                          <div className="book">
                            {/* Book cover */}
                            <div className="book-cover relative pb-[130%] sm:pb-[135%] md:pb-[140%]">
                              <img 
                                src={book.image} 
                                alt={book.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              
                              {/* Favorite button */}
                              <button
                                className="favorite-button p-1.5 rounded-full bg-amber-500/90 text-white transition-all duration-200"
                                onClick={(e) => toggleFavorite(e, book)}
                                aria-label="Remove from favorites"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
                                  />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Book info */}
                            <div className="book-info">
                              <h4 className="book-title text-white">{book.title}</h4>
                              <p className="book-author text-white/70">{book.authors ? book.authors.join(', ') : 'Unknown'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="mt-4 sm:mt-6 md:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Recommended Books</h3>
              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Split books into rows of 4 (or 3 on tablet, 3 on mobile) to create multiple bookshelves */}
                {Array.from({ length: Math.ceil(displayCount / 4) }).map((_, shelfIndex) => (
                  <div key={shelfIndex} className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6 pb-6 bookshelf mb-8">
                    {recommendations.slice(shelfIndex * 4, Math.min((shelfIndex + 1) * 4, displayCount)).map((book, index) => (
                    <div 
                      key={index} 
                      className={`book-container cursor-pointer ${selectedBook?.id === book.id ? 'selected-book' : ''}`}
                      onClick={() => {
                        setSelectedBook(book);
                        setIsModalOpen(true);
                      }}
                      tabIndex="0"
                      role="button"
                      aria-label={`View details for ${book.title}`}
                    >
                      <div className="book">
                        {/* Book cover */}
                        <div className="book-cover relative pb-[130%] sm:pb-[135%] md:pb-[140%]">
                          <img 
                            src={book.image} 
                            alt={book.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          
                          {/* Favorite button */}
                          <button
                            className={`favorite-button p-1.5 rounded-full ${
                              isFavorite(book.id) 
                                ? 'bg-amber-500/90 text-white' 
                                : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
                            } transition-all duration-200`}
                            onClick={(e) => toggleFavorite(e, book)}
                            aria-label={isFavorite(book.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill={isFavorite(book.id) ? "currentColor" : "none"}
                              stroke="currentColor" 
                              className="w-4 h-4"
                              strokeWidth={isFavorite(book.id) ? "0" : "2"}
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
                              />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Book info */}
                        <div className="book-info">
                          <h4 className="book-title text-white">{book.title}</h4>
                          <p className="book-author text-white/70">{book.authors ? book.authors.join(', ') : 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                ))}
                
                {/* Show More button - only for recommendations, not for favorites */}
                {!showFavorites && recommendations.length > displayCount && (
                  <div className="text-center mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-3 md:mb-4">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 8)}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base rounded-lg transition-all duration-200"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        More Books
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Book details modal */}
      <BookModal 
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};