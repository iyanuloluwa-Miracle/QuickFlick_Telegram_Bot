import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { startCommand, latestMoviesCommand, latestSeriesCommand } from './commands';
import { handleMovieActions } from './commands/latestMoviesCommand';
import { addSampleData } from './services/movieService';

// Load environment variables
dotenv.config();

// Create a bot instance
const bot = new Telegraf(process.env.BOT_TOKEN as string);

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log('Connected to database');
    
    // Add sample data for testing
    return addSampleData();
  })
  .then(() => {
    console.log('Sample data added (if needed)');
    
    // Register bot commands
    bot.start(startCommand);
    bot.command('latest_movies', latestMoviesCommand);
    bot.command('latest_series', latestSeriesCommand);
    
    // Register callback handlers for movie actions
    bot.action(/^(trailer|cast|similar|info|prev_page|next_page)_/, handleMovieActions);
    
    // Set command descriptions for Telegram menu
    bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'latest_movies', description: 'Get latest movies' },
      { command: 'latest_series', description: 'Get latest TV series' }
    ]);
    
    // Start the bot
    bot.launch();
    console.log('Bot is running!');
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  })
  .catch((error) => {
    console.error('Failed to start the application:', error);
    process.exit(1);
  });