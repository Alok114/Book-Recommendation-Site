// Function to search for books using Google Books API
export const searchBooks = async (query, genre, bookLength) => {
  try {
    // Construct the search query
    let searchQuery = query;
    
    // Add genre to search query if provided
    if (genre && genre !== 'all') {
      searchQuery += `+subject:${genre}`;
    }
    
    // Make the API request
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data = await response.json();
    
    // Process the results
    if (data.items && data.items.length > 0) {
      return data.items.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Unknown Author'],
        image: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover',
        summary: book.volumeInfo.description || 'No description available',
        genre: book.volumeInfo.categories?.[0] || 'Unknown Genre',
        publisher: book.volumeInfo.publisher || 'Unknown Publisher',
        publishedDate: book.volumeInfo.publishedDate,
        pageCount: book.volumeInfo.pageCount,
        language: book.volumeInfo.language,
        previewLink: book.volumeInfo.previewLink
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Function to get book recommendations based on a title
export const getRecommendations = async (title, genre) => {
  try {
    // First, search for the book to get its details
    const bookResults = await searchBooks(title, genre, null);
    
    if (bookResults.length === 0) {
      return [];
    }
    
    // Get the first book's genre or use the provided genre
    const bookGenre = bookResults[0].genre || genre;
    
    // Search for similar books in the same genre
    const recommendationResults = await searchBooks('', bookGenre, null);
    
    // Filter out the original book from recommendations
    return recommendationResults.filter(book => book.id !== bookResults[0].id);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};