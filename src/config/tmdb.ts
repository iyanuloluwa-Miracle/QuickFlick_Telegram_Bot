import dotenv from 'dotenv';

dotenv.config();

// TMDB API configuration
export const tmdbConfig = {
  apiKey: process.env.TMDB_API_KEY,
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
  
  // API endpoints
  endpoints: {
    nowPlayingMovies: '/movie/now_playing',
    popularMovies: '/movie/popular',
    upcomingMovies: '/movie/upcoming',
    tvOnTheAir: '/tv/on_the_air',
    popularTv: '/tv/popular'
  }
};

// Validate API key
if (!tmdbConfig.apiKey) {
  console.error('TMDB API key is not defined in environment variables');
  process.exit(1);
}