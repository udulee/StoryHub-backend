import { Router } from 'express';
import { getStories, getMyStories, getStoryById, createStory, updateStory, deleteStory, toggleLike, getStats } from '../controllers/storyController';
import { protect, writerOnly, adminOnly } from '../middleware/auth';

const router = Router();
router.get('/', getStories);
router.get('/my', protect, writerOnly, getMyStories);
router.get('/stats', protect, adminOnly, getStats);
router.get('/:id', getStoryById);
router.post('/', protect, writerOnly, createStory);
router.put('/:id', protect, writerOnly, updateStory);
router.delete('/:id', protect, writerOnly, deleteStory);
router.post('/like/:id', protect, toggleLike);
export default router;
