# Movie Series Bot

A Telegram bot that provides information about the latest movies and TV series.

## Features

- Get the latest movies in theaters
- Get the latest TV series on air
- Get popular movies
- Get popular TV series
- Detailed movie and series information including ratings, genres, and overviews
- Interactive command menu for easy navigation

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-series-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Telegram bot token:
   ```
   BOT_TOKEN=your_telegram_bot_token
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Usage

- `/start` - Start the bot and see available commands
- `/latest_movies` - Get the latest movies in theaters
- `/latest_series` - Get the latest TV series on air
- `/popular_movies` - Get popular movies
- `/popular_series` - Get popular TV series

### Example

To get the latest movies, simply send `/latest_movies` to the bot, and it will respond with a list of the latest movies in theaters, including their titles, release dates, ratings, genres, and overviews.

## Contributing

Feel free to submit issues and pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License. 