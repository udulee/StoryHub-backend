import { Request, Response } from 'express';
import Comment from '../models/Comment';
import { AuthRequest } from '../types';

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ story: req.params.story_id })
      .populate('user', 'username profile_image').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { story_id, comment_text } = req.body;
    const comment = await Comment.create({ story: story_id, user: req.user?.user_id, comment_text });
    const populated = await comment.populate('user', 'username profile_image');
    res.status(201).json(populated);
  } catch (error) { res.status(400).json({ message: 'Validation error', error }); }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user?.user_id });
    if (!comment) { res.status(404).json({ message: 'Comment not found or not authorized' }); return; }
    res.json({ message: 'Comment deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};
