import { Context, Markup } from 'telegraf';
import axios from 'axios';
import { tmdbConfig } from '../config/tmdb';
import { formatDate } from '../utils/dateFormatter';
import {
  handleTrailerRequest,
  handleCastRequest,
  handleSimilarMoviesRequest,
  handleMoreInfoRequest
} from '../handlers/movieHandlers';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  poster_path: string;
}

export const latestMoviesCommand = async (ctx: Context): Promise<void> => {
  try {
    await ctx.reply('Fetching the latest movies in theaters...');
    
    const page = 1;
    const response = await axios.get(`${tmdbConfig.baseUrl}${tmdbConfig.endpoints.nowPlayingMovies}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page
      }
    });
    
    const movies = response.data.results.slice(0, 5);
    const totalPages = response.data.total_pages;
    
    if (movies.length === 0) {
      await ctx.reply('No movies found in theaters. Please try again later.');
      return;
    }
    
    for (const movie of movies) {
      if (!movie.release_date || !movie.poster_path) continue;
      
      const message = `
🎬 *${movie.title}*
🗓️ Released: ${formatDate(new Date(movie.release_date))}
⭐ Rating: ${movie.vote_average.toFixed(1)}/10
🎭 Genre: ${movie.genre_ids.map((id: number) => getGenreName(id)).join(', ')}

📝 *Overview*:
${movie.overview}
      `;
      
      // Create inline keyboard with movie actions
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('🎥 Watch Trailer', `trailer_${movie.id}`),
          Markup.button.callback('👥 Cast', `cast_${movie.id}`)
        ],
        [
          Markup.button.callback('🎬 Similar Movies', `similar_${movie.id}`),
          Markup.button.callback('ℹ️ More Info', `info_${movie.id}`)
        ]
      ]);
      
      // Send the message with the movie poster and interactive buttons
      await ctx.replyWithPhoto(
        { url: `${tmdbConfig.imageBaseUrl}${movie.poster_path}` },
        { 
          caption: message,
          parse_mode: 'Markdown',
          ...keyboard
        }
      );
    }

    // Add pagination controls if there are more pages
    if (totalPages > 1) {
      const paginationKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('⬅️ Previous', `prev_page_${page}`),
          Markup.button.callback('➡️ Next', `next_page_${page}`)
        ]
      ]);
      
      await ctx.reply('Browse more movies:', paginationKeyboard);
    }
  } catch (error) {
    console.error('Error in latest movies command:', error);
    await ctx.reply('Sorry, there was an error fetching the latest movies. Please try again later.');
  }
};

// Helper function to convert genre IDs to names
const getGenreName = (genreId: number): string => {
  const genres: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[genreId] || 'Unknown';
};

// Action handlers for the inline buttons
export const handleMovieActions = async (ctx: Context): Promise<void> => {
  try {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      throw new Error('Invalid callback query');
    }
    
    const [action, movieId] = ctx.callbackQuery.data.split('_');
    
    switch (action) {
      case 'trailer':
        await handleTrailerRequest(ctx, movieId);
        break;
      case 'cast':
        await handleCastRequest(ctx, movieId);
        break;
      case 'similar':
        await handleSimilarMoviesRequest(ctx, movieId);
        break;
      case 'info':
        await handleMoreInfoRequest(ctx, movieId);
        break;
      case 'prev_page':
      case 'next_page':
        await handlePagination(ctx, action, parseInt(movieId));
        break;
    }
  } catch (error) {
    console.error('Error handling movie action:', error);
    await ctx.reply('Sorry, there was an error processing your request. Please try again.');
  }
};

const handlePagination = async (ctx: Context, action: string, currentPage: number): Promise<void> => {
  try {
    const newPage = action === 'prev_page' ? currentPage - 1 : currentPage + 1;
    
    if (newPage < 1) {
      await ctx.reply('You are already on the first page.');
      return;
    }
    
    const response = await axios.get(`${tmdbConfig.baseUrl}${tmdbConfig.endpoints.nowPlayingMovies}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page: newPage
      }
    });
    
    const movies = response.data.results.slice(0, 5);
    
    if (movies.length === 0) {
      await ctx.reply('No more movies available.');
      return;
    }
    
    // Delete the previous message with pagination controls
    if (ctx.callbackQuery?.message) {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }
    
    // Send new movies
    for (const movie of movies) {
      if (!movie.release_date || !movie.poster_path) continue;
      
      const message = `
🎬 *${movie.title}*
🗓️ Released: ${formatDate(new Date(movie.release_date))}
⭐ Rating: ${movie.vote_average.toFixed(1)}/10
🎭 Genre: ${movie.genre_ids.map((id: number) => getGenreName(id)).join(', ')}

📝 *Overview*:
${movie.overview}
      `;
      
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('🎥 Watch Trailer', `trailer_${movie.id}`),
          Markup.button.callback('👥 Cast', `cast_${movie.id}`)
        ],
        [
          Markup.button.callback('🎬 Similar Movies', `similar_${movie.id}`),
          Markup.button.callback('ℹ️ More Info', `info_${movie.id}`)
        ]
      ]);
      
      await ctx.replyWithPhoto(
        { url: `${tmdbConfig.imageBaseUrl}${movie.poster_path}` },
        { 
          caption: message,
          parse_mode: 'Markdown',
          ...keyboard
        }
      );
    }
    
    // Add new pagination controls
    const paginationKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('⬅️ Previous', `prev_page_${newPage}`),
        Markup.button.callback('➡️ Next', `next_page_${newPage}`)
      ]
    ]);
    
    await ctx.reply('Browse more movies:', paginationKeyboard);
  } catch (error) {
    console.error('Error handling pagination:', error);
    await ctx.reply('Sorry, there was an error loading more movies. Please try again.');
  }
};