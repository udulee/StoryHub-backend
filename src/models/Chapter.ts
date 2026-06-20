import mongoose, { Schema } from 'mongoose';
import { IChapter } from '../types';

const ChapterSchema = new Schema<IChapter>(
  {
    story:          { type: Schema.Types.ObjectId, ref: 'Story', required: true },
    chapter_number: { type: Number, required: true },
    chapter_title:  { type: String, default: '' },
    content:        { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IChapter>('Chapter', ChapterSchema);
