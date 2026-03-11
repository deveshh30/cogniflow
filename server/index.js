import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import authRoutes from './src/routes/Auth.Routes.js';
import GoalRoutes from "./src/routes/Goal.routes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://cogniflow-self.vercel.app'
];

app.use(express.json());
app.use((req, res, next) => { req.io = io; next(); });
const server = http.createServer(app);
const io = new Server(server , {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    },
})


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


//middleware
app.use('/api/auth', authRoutes);
app.use('/api/goals' , GoalRoutes);


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.join('goals-room'); 

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
        errors: err?.error || err?.errors || null,
    });
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_DB || undefined,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("mongodb connected successfully");
    } catch (error) {
        console.error("Connection failed due to:", error?.message || error);
        process.exit(1);
    }
};

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));