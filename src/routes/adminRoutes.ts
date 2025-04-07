// src/routes/adminRoutes.ts
import express from 'express';
import { addNews } from '../controllers/newsController';
import { upload } from '../config/multer';

const router = express.Router();

// Route for displaying the add news form (Admin)
router.get('/add', (req, res) => {
  res.render('admin/addNews', { message: null }); // Render the addNews.ejs template
});

// Route for handling form submission (Admin)
router.post('/add', upload.single('image'), addNews);

export default router;