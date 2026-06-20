import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = Router();
router.get('/:story_id', getComments);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
export default router;
