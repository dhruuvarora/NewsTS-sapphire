"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNews = exports.getNewsImage = exports.getAllNews = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const News_1 = require("../models/News");
// Fetch all news
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield News_1.News.find();
        res.render('user/newsFeed', { news });
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Server Error');
    }
});
exports.getAllNews = getAllNews;
// Serve image for a news item
const getNewsImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send('Invalid ID');
            return;
        }
        const image = yield News_1.News.getImageData(id);
        if (!image) {
            res.status(404).send('Image not found');
            return;
        }
        res.contentType(image.mime);
        res.send(image.data);
    }
    catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Server Error');
    }
});
exports.getNewsImage = getNewsImage;
// Add news with image stored in database
const addNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const imageData = yield promises_1.default.readFile(filePath);
        // Prepare news data with binary image
        const newsData = {
            title,
            description,
            image_data: imageData,
            image_name: req.file.originalname,
            image_mime: req.file.mimetype
        };
        // Insert news with image into database
        const newNews = yield News_1.News.create(newsData);
        // Delete the temporary file
        yield promises_1.default.unlink(filePath);
        // Get the io instance from the app
        const io = req.app.get('io');
        // Emit the event to clients
        if (io) {
            io.emit('newNews', newNews);
        }
        res.render('admin/addNews', { message: 'News posted successfully!' });
    }
    catch (err) {
        console.error('Error adding news:', err);
        res.status(500).render('admin/addNews', {
            message: 'Error saving news. Please try again.'
        });
    }
});
exports.addNews = addNews;
