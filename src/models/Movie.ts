import mongoose, { Document, Schema } from 'mongoose';

// Interface for Movie document
export interface IMovie extends Document {
  tmdbId: number;
  title: string;
  releaseDate: Date;
  genres: string[];
  overview: string;
  posterPath: string;
  voteAverage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Movie
const movieSchema = new Schema<IMovie>({
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: [{ type: String, required: true }],
  overview: { type: String, required: true },
  posterPath: { type: String, required: true },
  voteAverage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
export default mongoose.model<IMovie>('Movie', movieSchema);