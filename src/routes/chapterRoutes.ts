import { Router } from 'express';
import { getChapters, getChapterById, createChapter, updateChapter, deleteChapter } from '../controllers/chapterController';
import { protect, writerOnly } from '../middleware/auth';

const router = Router();
router.get('/:story_id', getChapters);
router.get('/single/:id', getChapterById);
router.post('/', protect, writerOnly, createChapter);
router.put('/:id', protect, writerOnly, updateChapter);
router.delete('/:id', protect, writerOnly, deleteChapter);
export default router;
