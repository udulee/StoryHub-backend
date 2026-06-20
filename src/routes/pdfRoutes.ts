import { Router } from 'express';
import { downloadStoryPDF, downloadWriterReport } from '../controllers/pdfController';
import { protect, writerOnly } from '../middleware/auth';

const router = Router();
router.get('/story/:id', protect, downloadStoryPDF);
router.get('/my-report', protect, writerOnly, downloadWriterReport);
export default router;
