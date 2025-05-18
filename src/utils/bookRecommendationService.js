import { getCompletion } from './openAiService';
import { getGoogleBooksInfo } from './googleBooksService';

// Generate prompt for book recommendations based on filters
const generatePromptByFilter = (userData) => {
  // If it's a category-only search (no search term)
  if (userData.searchType === 'category') {
    return `
      Suggest 16 popular and highly-rated books in the ${userData.genre} genre, 
      focusing on ${userData.bookLength} length books.
      
      IMPORTANT: Your response must be ONLY a valid JSON array of objects with the following structure:
      [{"title": "Book Title 1"}, {"title": "Book Title 2"}, ...]
      
      Do not include any explanations, headers, or additional text. Return ONLY the JSON array.
    `;
  }
  
  // Regular search with filters and search term
  return `
    Based on the data below, suggest 16 book titles in the below JSON format.
    
    data: ${JSON.stringify(userData)}
    
    IMPORTANT: Your response must be ONLY a valid JSON array of objects with the following structure:
    [{"title": "Book Title 1"}, {"title": "Book Title 2"}, ...]
    
    Do not include any explanations, headers, or additional text. Return ONLY the JSON array.
  `;
};

// Generate prompt for book recommendations based on a book title
const generatePromptByTitle = (title, genre) => {
  return `
    Based on the book "${title}" ${genre ? `in the ${genre} genre` : ''}, suggest 16 similar book titles 
    that a reader might enjoy. Do not include "${title}" in the recommendations.
    
    IMPORTANT: Your response must be ONLY a valid JSON array of objects with the following structure:
    [{"title": "Book Title 1"}, {"title": "Book Title 2"}, ...]
    
    Do not include any explanations, headers, or additional text. Return ONLY the JSON array.
  `;
};

// Get book recommendations based on filters
export const getBookRecommendationsByFilter = async (filters) => {
  try {
    // Generate prompt based on filters
    const prompt = generatePromptByFilter(filters);
    
    // Get AI-generated book titles
    const bookTitles = await getCompletion(prompt);
    
    // Get detailed book information from Google Books API
    const bookDetails = await getGoogleBooksInfo(bookTitles);
    
    return bookDetails;
  } catch (error) {
    console.error("Error getting book recommendations by filter:", error);
    throw error;
  }
};

// Get book recommendations based on a book title
export const getBookRecommendationsByTitle = async (title, genre) => {
  try {
    // Generate prompt based on title and genre
    const prompt = generatePromptByTitle(title, genre);
    
    // Get AI-generated book titles
    const bookTitles = await getCompletion(prompt);
    
    // Get detailed book information from Google Books API
    const bookDetails = await getGoogleBooksInfo(bookTitles);
    
    return bookDetails;
  } catch (error) {
    console.error("Error getting book recommendations by title:", error);
    throw error;
  }
};