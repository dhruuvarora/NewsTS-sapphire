// src/routes/newsRoutes.ts
import express from 'express';
import { getAllNews, getNewsImage, updateNewsAjax } from '../controllers/newsController';
import { upload } from '../config/multer';

const router = express.Router();

// Route for displaying news feed (User)
router.get('/feed', getAllNews);

// Route for serving news images
router.get('/image/:id', getNewsImage);

// Route for updating news via AJAX - using absolute path
router.post('/update/:id', upload.single('image'), updateNewsAjax);

export default router;