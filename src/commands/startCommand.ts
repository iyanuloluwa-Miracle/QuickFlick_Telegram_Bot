import { Context } from 'telegraf';

export const startCommand = async (ctx: Context): Promise<void> => {
  try {
    const message = `
Welcome to the Movies & Series Bot! 🎬

I can help you discover the latest movies and TV series. Use these commands:

/latest_movies - Get the latest movies in theaters
/latest_series - Get the latest TV series on air
/popular_movies - Get popular movies
/popular_series - Get popular TV series

Happy watching! 🍿
    `;
    
    await ctx.reply(message);
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply('Sorry, something went wrong. Please try again later.');
  }
};