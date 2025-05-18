// Function to get book details from Google Books API
export const getGoogleBooksInfo = async (titlesArr) => {
  try {
    return await Promise.all(titlesArr.map(async ({ title }) => {
      // Make API request to Google Books
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&langRestrict=en&maxResults=1`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch book info for "${title}"`);
      }
      
      const data = await response.json();
      
      // If no books found, return a placeholder
      if (!data.items || data.items.length === 0) {
        // Create a unique ID for the placeholder book
        const uniqueId = `${title.toLowerCase().replace(/[^a-z0-9]/g, '')}_unknown`;
        
        return {
          id: uniqueId,
          title,
          authors: ["Unknown"],
          image: "https://via.placeholder.com/128x192?text=No+Cover",
          summary: "No description available",
          genre: "Unknown",
          publisher: "Unknown"
        };
      }
      
      // Extract book info from the response
      const bookObj = data.items[0];
      const volumeInfo = bookObj.volumeInfo || {};
      
      // Create a unique ID for the book based on title and authors
      const authors = volumeInfo.authors || ["Unknown"];
      const uniqueId = `${title.toLowerCase().replace(/[^a-z0-9]/g, '')}_${authors.join('').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      
      return {
        id: uniqueId, // Add unique ID
        title,
        subtitle: volumeInfo.subtitle,
        genre: volumeInfo.categories ? volumeInfo.categories[0] : "Unknown",
        authors: authors,
        summary: volumeInfo.description || "No description available",
        publisher: volumeInfo.publisher || "Unknown",
        image: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/128x192?text=No+Cover",
        isbn10: volumeInfo.industryIdentifiers
          ? getIsbn10(volumeInfo.industryIdentifiers)
          : undefined,
        publishedDate: volumeInfo.publishedDate,
        pageCount: volumeInfo.pageCount,
        language: volumeInfo.language,
        previewLink: volumeInfo.previewLink
      };
    }));
  } catch (error) {
    console.error("Error fetching book info:", error);
    throw error;
  }
};

// Helper function to extract ISBN-10 from industry identifiers
const getIsbn10 = (industryIdentifiers) => {
  for (const identifier of industryIdentifiers) {
    if (identifier.type === "ISBN_10") {
      return identifier.identifier;
    }
  }
  return undefined;
};