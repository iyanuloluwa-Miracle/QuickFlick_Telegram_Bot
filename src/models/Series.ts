import mongoose, { Document, Schema } from 'mongoose';

// Interface for Series document
export interface ISeries extends Document {
  tmdbId: number;
  name: string;
  firstAirDate: Date;
  genres: string[];
  overview: string;
  posterPath: string;
  numberOfSeasons: number;
  voteAverage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Series
const seriesSchema = new Schema<ISeries>({
  tmdbId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  firstAirDate: { type: Date, required: true },
  genres: [{ type: String, required: true }],
  overview: { type: String, required: true },
  posterPath: { type: String, required: true },
  numberOfSeasons: { type: Number, required: true },
  voteAverage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
export default mongoose.model<ISeries>('Series', seriesSchema);