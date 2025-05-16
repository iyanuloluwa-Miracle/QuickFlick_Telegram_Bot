import { Context } from 'telegraf';
import { getLatestMovies } from '../services/tmdbService';
import { formatDate } from '../utils/dateFormatter';

export const latestMoviesCommand = async (ctx: Context): Promise<void> => {
  try {
    await ctx.reply('Fetching the latest movies in theaters...');
    
    const movies = await getLatestMovies(5);
    
    if (movies.length === 0) {
      await ctx.reply('No movies found in the database. Please try again later.');
      return;
    }
    
    for (const movie of movies) {
      const message = `
🎬 *${movie.title}*
🗓️ Released: ${formatDate(movie.releaseDate)}
⭐ Rating: ${movie.voteAverage.toFixed(1)}/10
🎭 Genre: ${movie.genres.join(', ')}

📝 *Overview*:
${movie.overview}
      `;
      
      // Send the message with the movie poster if available
      if (movie.posterPath) {
        await ctx.replyWithPhoto({ url: movie.posterPath }, { 
          caption: message,
          parse_mode: 'Markdown'
        });
      } else {
        await ctx.reply(message, { parse_mode: 'Markdown' });
      }
    }
  } catch (error) {
    console.error('Error in latest movies command:', error);
    await ctx.reply('Sorry, there was an error fetching the latest movies. Please try again later.');
  }
};