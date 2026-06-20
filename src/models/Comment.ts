import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const CommentSchema = new Schema<IComment>(
  {
    story:        { type: Schema.Types.ObjectId, ref: 'Story', required: true },
    user:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment_text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
