import { config, configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from './route/user.route.js';
import authRoutes from './route/auth.route.js';
import adminRoutes from './route/admin.route.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

dotenv.config({ path: '../.env' });

config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const app = express();


const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    credentials: true,
};


app.use(cors(corsOptions));
const __dirname = path.resolve();

app.use("/uploads",express.static(path.join(__dirname,'backend', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/backend/user', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/admin', adminRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Start  server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
