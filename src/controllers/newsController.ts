// src/controllers/newsController.ts
import { Request, Response } from 'express';
import fs from 'fs/promises';
import { News } from '../models/News';
import { FileRequest, NewsInput } from '../types';

// Fetch all news
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await News.find();
    res.render('user/newsFeed', { news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Server Error');
  }
};

// Serve image for a news item
export const getNewsImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).send('Invalid ID');
      return;
    }

    const image = await News.getImageData(id);
    
    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    res.contentType(image.mime);
    res.send(image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Server Error');
  }
};

// Add news with image stored in database
export const addNews = async (req: FileRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      res.render('admin/addNews', { 
        message: 'Title, description, and image are required!' 
      });
      return;
    }

    // Read the file data
    const filePath = req.file.path;
    const imageData = await fs.readFile(filePath);
    
    // Prepare news data with binary image
    const newsData: NewsInput = {
      title,
      description,
      image_data: imageData,
      image_name: req.file.originalname,
      image_mime: req.file.mimetype
    };
    const newNews = await News.create(newsData);

    // scoket connection
    const io = req.app.get('io');
    if (io) {
      io.emit('newNews', newNews);
    }
    res.render('admin/addNews', { message: 'News posted successfully!' });
  } catch (err) {
    console.error('Error adding news:', err);
    res.status(500).render('admin/addNews', { 
      message: 'Error saving news. Please try again.' 
    });
  }
};

// Update news via AJAX
export const updateNewsAjax = async (req: FileRequest, res: Response): Promise<void> => {
  console.log('Update News AJAX called with ID:', req.params.id);
  console.log('Request body:', req.body);
  console.log('File uploaded:', req.file ? 'Yes' : 'No');
  
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      console.log('Invalid ID provided:', req.params.id);
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }

    const { title, description } = req.body;
    console.log('Received title:', title);
    console.log('Received description:', description);

    if (!title || !description) {
      console.log('Missing required fields');
      res.status(400).json({ success: false, message: 'Title and description are required' });
      return;
    }

    const existingNews = await News.findById(id);
    if (!existingNews) {
      console.log('News item not found with ID:', id);
      res.status(404).json({ success: false, message: 'News not found' });
      return;
    }

    const updateData: Partial<NewsInput> = {
      title,
      description
    };

    // If a new image is uploaded, process it
    if (req.file) {
      console.log('Processing uploaded file:', req.file.originalname);
      try {
        const filePath = req.file.path;
        const imageData = await fs.readFile(filePath);

        updateData.image_data = imageData;
        updateData.image_name = req.file.originalname;
        updateData.image_mime = req.file.mimetype;
        await fs.unlink(filePath)

          .catch(err => console.error('Error deleting temp file:', err));
      } catch (fileError) {
        console.error('Error processing uploaded file:', fileError);
      }
    }

    console.log('Updating news with data:', {
      id,
      title: updateData.title,
      hasImage: !!updateData.image_data
    });

    // Update the news item in the database
    const updatedNews = await News.update(id, updateData);

    if (!updatedNews) {
      console.log('Update operation returned null');
      res.status(500).json({ success: false, message: 'Failed to update news' });
      return;
    }

    console.log('News updated successfully:', updatedNews.id);

    // Get the io instance from the app
    const io = req.app.get('io');
    if (io) {
      console.log('Emitting newsUpdated event');
      io.emit('newsUpdated', updatedNews);
    } else {
      console.log('Socket.io instance not found');
    }

    res.json({ 
      success: true, 
      message: 'News updated successfully',
      data: {
        id: updatedNews.id,
        title: updatedNews.title,
        description: updatedNews.description
      }
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};