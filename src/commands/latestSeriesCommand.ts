import { Context } from 'telegraf';
import { getLatestSeries } from '../services/tmdbService';
import { formatDate } from '../utils/dateFormatter';

export const latestSeriesCommand = async (ctx: Context): Promise<void> => {
  try {
    await ctx.reply('Fetching the latest TV series on air...');
    
    const series = await getLatestSeries(5);
    
    if (series.length === 0) {
      await ctx.reply('No TV series found in the database. Please try again later.');
      return;
    }
    
    for (const show of series) {
      const message = `
📺 *${show.name}*
🗓️ First aired: ${formatDate(show.firstAirDate)}
⭐ Rating: ${show.voteAverage.toFixed(1)}/10
🎭 Genre: ${show.genres.join(', ')}
🔢 Seasons: ${show.numberOfSeasons}

📝 *Overview*:
${show.overview}
      `;
      
      // Send the message with the series poster if available
      if (show.posterPath) {
        await ctx.replyWithPhoto({ url: show.posterPath }, { 
          caption: message,
          parse_mode: 'Markdown'
        });
      } else {
        await ctx.reply(message, { parse_mode: 'Markdown' });
      }
    }
  } catch (error) {
    console.error('Error in latest series command:', error);
    await ctx.reply('Sorry, there was an error fetching the latest TV series. Please try again later.');
  }
};