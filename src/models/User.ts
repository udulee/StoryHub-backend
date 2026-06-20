import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>(
  {
    username:      { type: String, required: true, unique: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true },
    password:      { type: String, required: true, minlength: 6 },
    role:          { type: String, enum: ['reader', 'writer', 'admin'], default: 'reader' },
    profile_image: { type: String, default: '' },
    bio:           { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
