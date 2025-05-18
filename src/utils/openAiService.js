// OpenRouter API integration for AI-powered book recommendations

// Using OpenRouter API directly
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_BASE = import.meta.env.VITE_OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'; // Using a free model

export const getCompletion = async (prompt) => {
  try {
    // If API key is not available, use mock data
    if (!OPENROUTER_API_KEY) {
      console.warn('OpenRouter API key not found. Using mock data instead.');
      return getMockCompletion(prompt);
    }
    
    // Add explicit instructions to return JSON
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON only, with no additional text before or after.`;
    
    // Make API request to OpenRouter
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // For including your app on openrouter.ai rankings
        'X-Title': 'YourBook App' // For including your app on openrouter.ai rankings
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: jsonPrompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      // Try to parse the response as JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse response as JSON:', content);
      console.error('Error:', error);
      
      // Fall back to mock data if parsing fails
      return getMockCompletion(prompt);
    }
  } catch (error) {
    console.error('Error in AI completion:', error);
    // Fall back to mock data if API call fails
    return getMockCompletion(prompt);
  }
};

// Fallback function for mock data when API is unavailable
const getMockCompletion = async (prompt) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock book recommendations based on the prompt
  let bookTitles = [];
  
  if (prompt.includes('fiction')) {
    bookTitles = [
      { title: "The Great Gatsby" },
      { title: "To Kill a Mockingbird" },
      { title: "1984" },
      { title: "Pride and Prejudice" },
      { title: "The Catcher in the Rye" },
      { title: "The Hobbit" }
    ];
  } else if (prompt.includes('non-fiction')) {
    bookTitles = [
      { title: "Sapiens: A Brief History of Humankind" },
      { title: "Educated" },
      { title: "Becoming" },
      { title: "The Immortal Life of Henrietta Lacks" },
      { title: "In Cold Blood" },
      { title: "Thinking, Fast and Slow" }
    ];
  } else if (prompt.includes('thriller')) {
    bookTitles = [
      { title: "Gone Girl" },
      { title: "The Girl on the Train" },
      { title: "The Silent Patient" },
      { title: "The Da Vinci Code" },
      { title: "The Girl with the Dragon Tattoo" },
      { title: "Before I Go to Sleep" }
    ];
  } else {
    // Default recommendations
    bookTitles = [
      { title: "The Alchemist" },
      { title: "Harry Potter and the Sorcerer's Stone" },
      { title: "The Lord of the Rings" },
      { title: "The Hunger Games" },
      { title: "The Kite Runner" },
      { title: "The Shining" }
    ];
  }
  
  return bookTitles;
};