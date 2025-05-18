# YourBook - 3D Interactive Book Recommendation App

An interactive 3D book visualization with AI-powered book recommendations.

## Features

- Interactive 3D book that responds to scrolling
- AI-powered book recommendations using OpenRouter
- Google Books API integration for book details
- Book search by title, genre, and length
- Detailed book information modal

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenRouter API key:
     ```
     VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
     VITE_OPENROUTER_API_BASE=https://openrouter.ai/api/v1
     ```
   - You can get an API key from [OpenRouter](https://openrouter.ai/)

4. Start the development server:
   ```
   npm run dev
   ```

## How to Use

1. Scroll down to reveal the book search interface
2. Enter a book title or keywords in the search box
3. Select genre and book length preferences
4. Click "Search" to get recommendations
5. Click on a book to view more details

## AI-Powered Recommendations

The app uses OpenRouter to generate book recommendations based on:
- Book titles you enter
- Genre preferences
- Book length preferences

If no OpenRouter API key is provided, the app will fall back to mock recommendations.

## Technologies Used

- React
- Three.js (via React Three Fiber)
- TailwindCSS
- OpenRouter API
- Google Books API

## Credits

Based on the 3D book visualization by [Wassim Samad](https://github.com/wass08/r3f-animated-book-slider-final)
