import { Request, Response } from 'express';
import Chapter from '../models/Chapter';
import { AuthRequest } from '../types';

export const getChapters = async (req: Request, res: Response): Promise<void> => {
  try {
    const chapters = await Chapter.find({ story: req.params.story_id }).sort({ chapter_number: 1 });
    res.json(chapters);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const getChapterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('story', 'title');
    if (!chapter) { res.status(404).json({ message: 'Chapter not found' }); return; }
    res.json(chapter);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const createChapter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { story_id, chapter_number, chapter_title, content } = req.body;
    const chapter = await Chapter.create({ story: story_id, chapter_number, chapter_title, content });
    res.status(201).json(chapter);
  } catch (error) { res.status(400).json({ message: 'Validation error', error }); }
};

export const updateChapter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chapter) { res.status(404).json({ message: 'Chapter not found' }); return; }
    res.json(chapter);
  } catch (error) { res.status(400).json({ message: 'Update error', error }); }
};

export const deleteChapter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chapter deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};
