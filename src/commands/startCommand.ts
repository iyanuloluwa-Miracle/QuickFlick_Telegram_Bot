import { Context } from 'telegraf';

export const startCommand = async (ctx: Context): Promise<void> => {
  try {
    const message = `
🍿 Hey there, Movie Buff! 🎬

Ready to binge, discover, and become the ultimate film & series guru? I’m your trusty bot sidekick! Here’s what I can do for you:

✨ /latest_movies – Hot off the reel! See what’s rocking theaters now
📺 /latest_series – Fresh TV shows, just for you
🔥 /popular_movies – Crowd favorites you can’t miss
🌟 /popular_series – Series everyone’s talking about

So grab your popcorn, get comfy, and let’s dive into the world of movies & series together! If you get lost, just shout (or type) for help. 🚀

Let the binge begin!
    `;
    
    await ctx.reply(message);
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply('Oops! Something went wrong. Even bots have bad hair days. Try again soon!');
  }
};