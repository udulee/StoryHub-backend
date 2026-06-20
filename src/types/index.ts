import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface AuthRequest extends Request {
  user?: { user_id: string; role: string };
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'reader' | 'writer' | 'admin';
  profile_image: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStory extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: 'Fantasy' | 'Romance' | 'Horror' | 'Mystery' | 'Action' | 'Webtoon';
  cover_image: string;
  author: Types.ObjectId;
  status: 'draft' | 'published';
  likes: Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChapter extends Document {
  _id: Types.ObjectId;
  story: Types.ObjectId;
  chapter_number: number;
  chapter_title: string;
  content: string;
  createdAt: Date;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  story: Types.ObjectId;
  user: Types.ObjectId;
  comment_text: string;
  createdAt: Date;
}
