"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/newsRoutes.ts
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
// Route for displaying news feed (User)
router.get('/feed', newsController_1.getAllNews);
// Route for serving news images
router.get('/image/:id', newsController_1.getNewsImage);
exports.default = router;
