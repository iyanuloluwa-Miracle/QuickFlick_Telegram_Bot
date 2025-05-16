import { Context } from 'telegraf';
import axios from 'axios';
import { tmdbConfig } from '../config/tmdb';
import { formatDate } from '../utils/dateFormatter';

export const popularSeriesCommand = async (ctx: Context): Promise<void> => {
  try {
    await ctx.reply('Fetching popular TV series...');
    
    const response = await axios.get(`${tmdbConfig.baseUrl}${tmdbConfig.endpoints.popularTv}`, {
      params: {
        api_key: tmdbConfig.apiKey,
        language: 'en-US',
        page: 1
      }
    });
    
    const tvShows = response.data.results.slice(0, 5);
    
    if (tvShows.length === 0) {
      await ctx.reply('No popular TV series found. Please try again later.');
      return;
    }
    
    for (const show of tvShows) {
      if (!show.first_air_date || !show.poster_path) continue;
      
      const message = `
📺 *${show.name}*
🗓️ First aired: ${formatDate(new Date(show.first_air_date))}
⭐ Rating: ${show.vote_average.toFixed(1)}/10

📝 *Overview*:
${show.overview}
      `;
      
      // Send the message with the series poster if available
      await ctx.replyWithPhoto({ url: `${tmdbConfig.imageBaseUrl}${show.poster_path}` }, { 
        caption: message,
        parse_mode: 'Markdown'
      });
    }
  } catch (error) {
    console.error('Error in popular series command:', error);
    await ctx.reply('Sorry, there was an error fetching popular TV series. Please try again later.');
  }
};