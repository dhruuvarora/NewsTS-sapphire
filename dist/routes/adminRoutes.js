"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
// Set up storage engine for multer (to save uploaded files)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads'); // Save uploaded files in the 'uploads' folder inside 'public'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Add timestamp to file name to avoid conflict
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Route for displaying the add news form (Admin)
router.get('/add', (req, res) => {
    res.render('admin/addNews', { message: null }); // Render the addNews.ejs template
});
// Route for handling form submission (Admin)
router.post('/add', upload.single('image'), newsController_1.addNews);
exports.default = router;
