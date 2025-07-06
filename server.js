require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dishesRouter = require('./routes/dishes');
const Dish = require('./models/dish');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH']
    }
});

app.use(cors());
app.use(express.json());
app.use('/api/dishes', dishesRouter);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Watch changes on the dishes collection
const changeStream = Dish.watch();

// When a change happens, emit to all clients
changeStream.on('change', (change) => {
    console.log('Change detected:', change);

    io.emit('dishUpdated', change);
});
