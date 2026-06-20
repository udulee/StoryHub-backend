import mongoose, { Schema } from 'mongoose';
import { IStory } from '../types';

const StorySchema = new Schema<IStory>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category:    { type: String, enum: ['Fantasy','Romance','Horror','Mystery','Action','Webtoon'], default: 'Fantasy' },
    cover_image: { type: String, default: '' },
    author:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
    likes:       [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IStory>('Story', StorySchema);
