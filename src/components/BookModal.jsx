import { useEffect, useRef } from 'react';
import './BookModal.css';

export const BookModal = ({ book, isOpen, onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !book) return null;
  
  return (
    <div className="book-modal-overlay">
      <div 
        ref={modalRef}
        className="book-modal"
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/3 p-6 flex items-center justify-center">
            <img 
              src={book.image} 
              alt={book.title} 
              className="book-modal-image"
            />
          </div>
          <div className="md:w-2/3 p-8 book-modal-content">
            <button 
              onClick={onClose}
              className="book-modal-close"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="book-title">{book.title}</h2>
            <p className="book-authors">{book.authors?.join(', ')}</p>
            
            {book.summary && (
              <div className="book-summary">
                <p className="text-white/80 text-sm leading-relaxed">{book.summary}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6">
              {book.genre && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Genre
                  </h3>
                  <p className="book-detail-value">{book.genre}</p>
                </div>
              )}
              
              {book.publisher && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Publisher
                  </h3>
                  <p className="book-detail-value">{book.publisher}</p>
                </div>
              )}
              
              {book.publishedDate && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Published
                  </h3>
                  <p className="book-detail-value">{book.publishedDate}</p>
                </div>
              )}
              
              {book.pageCount && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Pages
                  </h3>
                  <p className="book-detail-value">{book.pageCount}</p>
                </div>
              )}
              
              {book.language && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Language
                  </h3>
                  <p className="book-detail-value">{book.language === 'en' ? 'English' : book.language}</p>
                </div>
              )}
              
              {book.isbn10 && (
                <div className="book-detail-section">
                  <h3 className="book-detail-label">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    ISBN
                  </h3>
                  <p className="book-detail-value">{book.isbn10}</p>
                </div>
              )}
            </div>
            
            <div className="book-modal-actions">
              {book.previewLink && (
                <a 
                  href={book.previewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="book-modal-button"
                >
                  Preview Book
                </a>
              )}
              <button 
                className="book-modal-button secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};