import { Request, Response } from 'express';
import Story from '../models/Story';
import { AuthRequest } from '../types';

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const stories = await Story.find(filter).populate('author', 'username profile_image').sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const getMyStories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stories = await Story.find({ author: req.user?.user_id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const getStoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('author', 'username profile_image bio');
    if (!story) { res.status(404).json({ message: 'Story not found' }); return; }
    res.json(story);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const createStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category } = req.body;
    const story = await Story.create({ title, description, category, author: req.user?.user_id });
    res.status(201).json(story);
  } catch (error) { res.status(400).json({ message: 'Validation error', error }); }
};

export const updateStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: req.params.id, author: req.user?.user_id }, req.body, { new: true, runValidators: true }
    );
    if (!story) { res.status(404).json({ message: 'Story not found or not authorized' }); return; }
    res.json(story);
  } catch (error) { res.status(400).json({ message: 'Update error', error }); }
};

export const deleteStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const story = await Story.findOneAndDelete({ _id: req.params.id, author: req.user?.user_id });
    if (!story) { res.status(404).json({ message: 'Story not found or not authorized' }); return; }
    res.json({ message: 'Story deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) { res.status(404).json({ message: 'Story not found' }); return; }
    const userId = req.user?.user_id as string;
    const liked = story.likes.some(id => id.toString() === userId);
    if (liked) story.likes = story.likes.filter(id => id.toString() !== userId) as typeof story.likes;
    else story.likes.push(userId as unknown as import('mongoose').Types.ObjectId);
    await story.save();
    res.json({ liked: !liked, total_likes: story.likes.length });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalStories = await Story.countDocuments();
    const published    = await Story.countDocuments({ status: 'published' });
    const drafts       = await Story.countDocuments({ status: 'draft' });
    const byCategory   = await Story.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    res.json({ totalStories, published, drafts, byCategory });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};
