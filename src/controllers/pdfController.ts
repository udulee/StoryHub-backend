import { Response } from 'express';
import Story from '../models/Story';
import Chapter from '../models/Chapter';
import User from '../models/User';
import { generateStoryPDF, generateWriterReportPDF } from '../utils/pdfGenerator';
import { AuthRequest } from '../types';

export const downloadStoryPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'username');
    if (!story) { res.status(404).json({ message: 'Story not found' }); return; }
    const chapters = await Chapter.find({ story: req.params.id }).sort({ chapter_number: 1 });
    generateStoryPDF({ story: story as never, chapters }, res);
  } catch (error) { res.status(500).json({ message: 'PDF generation failed', error }); }
};

export const downloadWriterReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.user_id).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    const stories = await Story.find({ author: req.user?.user_id });
    generateWriterReportPDF(
      { username: user.username, email: user.email },
      stories.map(s => ({ title: s.title, category: s.category, status: s.status, views: s.views, likes: s.likes, createdAt: s.createdAt })),
      res
    );
  } catch (error) { res.status(500).json({ message: 'Report generation failed', error }); }
};
