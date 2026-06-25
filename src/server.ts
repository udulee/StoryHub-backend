import dns from 'node:dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes    from './routes/authRoutes';
import storyRoutes   from './routes/storyRoutes';
import chapterRoutes from './routes/chapterRoutes';
import commentRoutes from './routes/commentRoutes';
import pdfRoutes     from './routes/pdfRoutes';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/stories',  storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/pdf',      pdfRoutes);

app.get('/', (_req, res) => res.json({ message: 'StoryHub API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
