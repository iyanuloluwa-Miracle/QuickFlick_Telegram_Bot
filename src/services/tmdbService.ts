import axios from 'axios';
import { tmdbConfig } from '../config/tmdb';
import Movie from '../models/Movie';
import Series from '../models/Series';

// Define interfaces to match TMDB API responses
interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

interface TMDBTVShow {
  id: number;
  name: string;
  first_air_date: string;
  genre_ids: number[];
  overview: string;
  poster_path: string | null;
  vote_average: number;
  number_of_seasons?: number;
}

interface GenreMap {
  [key: number]: string;
}

// Cache for genre data
let movieGenres: GenreMap = {};
let tvGenres: GenreMap = {};

// Initialize genres
export const initializeGenres = async (): Promise<void> => {
  try {
    // Fetch movie genres
    const movieGenresResponse = await axios.get(`${tmdbConfig.baseUrl}/genre/movie/list`, {
      params: {
        api_key: tmdbConfig.apiKey
      }
    });
    
    // Fetch TV genres
    const tvGenresResponse = await axios.get(`${tmdbConfig.baseUrl}/genre/tv/list`, {
      params: {
        api_key: tmdbConfig.apiKey
      }
    });
    
    // Create lookup maps
    movieGenresResponse.data.genres.forEach((genre: { id: number, name: string }) => {
      movieGenres[genre.id] = genre.name;
    });
    
    tvGenresResponse.data.genres.forEach((genre: { id: number, name: string }) => {
      tvGenres[genre.id] = genre.name;
    });
    
    console.log('Genre data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize genre data:', error);
    throw error;
  }
};

// Convert genre IDs to genre names
const getGenreNames = (genreIds: number[], isMovie: boolean): string[] => {
  const genreMap = isMovie ? movieGenres : tvGenres;
  return genreIds.map(id => genreMap[id] || 'Unknown').filter(name => name !== 'Unknown');
};

// Fetch and update latest movies from TMDB API
export const fetchLatestMovies = async (): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}${tmdbConfig.endpoints.nowPlayingMovies}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page: 1
      }
    });
    
    const movies = response.data.results as TMDBMovie[];
    
    // Process and save each movie
    for (const movie of movies) {
      if (!movie.release_date || !movie.poster_path) continue;
      
      const movieData = {
        tmdbId: movie.id,
        title: movie.title,
        releaseDate: new Date(movie.release_date),
        genres: getGenreNames(movie.genre_ids, true),
        overview: movie.overview,
        posterPath: `${tmdbConfig.imageBaseUrl}${movie.poster_path}`,
        voteAverage: movie.vote_average,
        updatedAt: new Date()
      };
      
      // Upsert (update or insert) the movie
      await Movie.findOneAndUpdate(
        { tmdbId: movie.id },
        movieData,
        { upsert: true, new: true }
      );
    }
    
    console.log(`Updated ${movies.length} movies from TMDB API`);
  } catch (error) {
    console.error('Error fetching latest movies from TMDB:', error);
    throw error;
  }
};

// Fetch and update latest TV series from TMDB API
export const fetchLatestSeries = async (): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}${tmdbConfig.endpoints.tvOnTheAir}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page: 1
      }
    });
    
    const tvShows = response.data.results as TMDBTVShow[];
    
    // Process and save each TV show
    for (const show of tvShows) {
      if (!show.first_air_date || !show.poster_path) continue;
      
      // For each TV show, fetch additional details to get number_of_seasons
      const detailsResponse = await axios.get(`${tmdbConfig.baseUrl}/tv/${show.id}`, {
        params: {
          api_key: tmdbConfig.apiKey,
          language: 'en-US'
        }
      });
      
      const seriesData = {
        tmdbId: show.id,
        name: show.name,
        firstAirDate: new Date(show.first_air_date),
        genres: getGenreNames(show.genre_ids, false),
        overview: show.overview,
        posterPath: `${tmdbConfig.imageBaseUrl}${show.poster_path}`,
        numberOfSeasons: detailsResponse.data.number_of_seasons || 1,
        voteAverage: show.vote_average,
        updatedAt: new Date()
      };
      
      // Upsert (update or insert) the TV show
      await Series.findOneAndUpdate(
        { tmdbId: show.id },
        seriesData,
        { upsert: true, new: true }
      );
    }
    
    console.log(`Updated ${tvShows.length} TV series from TMDB API`);
  } catch (error) {
    console.error('Error fetching latest TV series from TMDB:', error);
    throw error;
  }
};

// Get movies from database
export const getLatestMovies = async (limit: number = 5): Promise<any[]> => {
  try {
    const movies = await Movie.find()
      .sort({ releaseDate: -1 })
      .limit(limit);
    return movies;
  } catch (error) {
    console.error('Error fetching latest movies from database:', error);
    throw error;
  }
};

// Get TV series from database
export const getLatestSeries = async (limit: number = 5): Promise<any[]> => {
  try {
    const series = await Series.find()
      .sort({ firstAirDate: -1 })
      .limit(limit);
    return series;
  } catch (error) {
    console.error('Error fetching latest TV series from database:', error);
    throw error;
  }
};

// Task to update data periodically
export const setupDataUpdateTask = (): NodeJS.Timeout => {
  // Update data initially
  Promise.all([fetchLatestMovies(), fetchLatestSeries()])
    .then(() => console.log('Initial data fetch completed'))
    .catch(err => console.error('Initial data fetch failed:', err));
  
  // Update data every 12 hours
  return setInterval(async () => {
    try {
      await Promise.all([fetchLatestMovies(), fetchLatestSeries()]);
      console.log('Scheduled data update completed');
    } catch (error) {
      console.error('Scheduled data update failed:', error);
    }
  }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
};