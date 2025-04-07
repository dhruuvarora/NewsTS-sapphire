"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
// Load environment variables
dotenv_1.default.config();
// Import routes
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Import database connection (this will execute the pool.connect)
require("./config/db");
// Create Express app
const app = (0, express_1.default)();
// Create HTTP server
const server = http_1.default.createServer(app);
// Initialize Socket.IO on the server
const io = new socket_io_1.Server(server);
// Make io available globally in the app
app.set('io', io);
// Define port
const PORT = process.env.PORT || 8000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public'))); // Serve static files from public folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads'))); // Serve image files
// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Routes
app.use('/news', newsRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
// Home route
app.get('/', (req, res) => {
    res.redirect('/news/feed');
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
