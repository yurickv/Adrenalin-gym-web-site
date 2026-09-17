import { model, models, Schema } from 'mongoose';

const CalcRatingSchema = new Schema(
  {
    calcId: { type: String, required: true, unique: true },
    sum: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

const CalcRatingVoteSchema = new Schema(
  {
    calcId: { type: String, required: true },
    ipHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

CalcRatingVoteSchema.index({ calcId: 1, ipHash: 1 }, { unique: true });
CalcRatingVoteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const CalcRating =
  models.CalcRating || model('CalcRating', CalcRatingSchema);
export const CalcRatingVote =
  models.CalcRatingVote || model('CalcRatingVote', CalcRatingVoteSchema);
