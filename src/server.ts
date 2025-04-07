// src/server.ts
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import './config/db';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

import newsRoutes from './routes/newsRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

const server = http.createServer(app);

const io = new SocketIOServer(server);
app.set('io', io);

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'))); 
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/news', newsRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.redirect('/news/feed');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});