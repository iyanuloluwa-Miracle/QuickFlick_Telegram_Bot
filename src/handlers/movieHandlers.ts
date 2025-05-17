import { Context } from 'telegraf';
import axios from 'axios';
import { tmdbConfig } from '../config/tmdb';

export const handleTrailerRequest = async (ctx: Context, movieId: string): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}/movie/${movieId}/videos`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US'
      }
    });

    const trailers = response.data.results.filter((video: any) => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    if (trailers.length > 0) {
      const trailer = trailers[0];
      await ctx.reply(`🎥 *${trailer.name}*\n\nWatch here: https://www.youtube.com/watch?v=${trailer.key}`, {
        parse_mode: 'Markdown'
      });
    } else {
      await ctx.reply('Sorry, no trailer available for this movie.');
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
    await ctx.reply('Sorry, there was an error fetching the trailer.');
  }
};

export const handleCastRequest = async (ctx: Context, movieId: string): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}/movie/${movieId}/credits`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US'
      }
    });

    const cast = response.data.cast.slice(0, 5); // Get top 5 cast members
    const message = cast.map((actor: any) => 
      `👤 *${actor.name}* as ${actor.character}`
    ).join('\n\n');

    await ctx.reply(`*Top Cast Members:*\n\n${message}`, {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error fetching cast:', error);
    await ctx.reply('Sorry, there was an error fetching the cast information.');
  }
};

export const handleSimilarMoviesRequest = async (ctx: Context, movieId: string): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}/movie/${movieId}/similar`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page: 1
      }
    });

    const similarMovies = response.data.results.slice(0, 3); // Get top 3 similar movies
    const message = similarMovies.map((movie: any) => 
      `🎬 *${movie.title}*\n⭐ ${movie.vote_average.toFixed(1)}/10\n${movie.overview.substring(0, 100)}...`
    ).join('\n\n');

    await ctx.reply(`*Similar Movies You Might Like:*\n\n${message}`, {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    await ctx.reply('Sorry, there was an error fetching similar movies.');
  }
};

export const handleMoreInfoRequest = async (ctx: Context, movieId: string): Promise<void> => {
  try {
    const response = await axios.get(`${tmdbConfig.baseUrl}/movie/${movieId}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        append_to_response: 'videos,credits'
      }
    });

    const movie = response.data;
    const message = `
🎬 *${movie.title}*
🗓️ Released: ${new Date(movie.release_date).toLocaleDateString()}
⭐ Rating: ${movie.vote_average.toFixed(1)}/10
⏱️ Runtime: ${movie.runtime} minutes
💰 Budget: $${movie.budget.toLocaleString()}
💵 Revenue: $${movie.revenue.toLocaleString()}
🌐 Homepage: ${movie.homepage || 'N/A'}

📝 *Overview*:
${movie.overview}

🎭 *Genres*:
${movie.genres.map((genre: any) => genre.name).join(', ')}

🎬 *Production Companies*:
${movie.production_companies.map((company: any) => company.name).join(', ')}
    `;

    await ctx.reply(message, {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    await ctx.reply('Sorry, there was an error fetching the movie details.');
  }
}; 