import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Initialize the Express application
const app = express();

// 1. Security Headers Middleware
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS) Configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, or Postman)
            if (!origin) return callback(null, true);

            const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'];
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS policy blocks access from origin: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// 3. HTTP Request Logging (Only during development)
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Body Parsing Middleware (Converts incoming request body into JSON)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global Rate Limiter (Protects all routes from bot flooding)
app.use('/api', generalLimiter);

// 6. Root & Health Check Endpoints
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Text-to-Speech API Studio',
        status: 'online',
        version: '1.0.0',
        documentation: '/api/health',
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())} seconds`,
        provider: env.TTS_PROVIDER,
    });
});

// Note: Day 3 routes (/api/tts and /api/voices) will be mounted right here!

// 7. 404 Route Not Found Handler (Catches any typos in URL)
app.use(notFoundHandler);

// 8. Centralized Global Error Handler (Catches all exceptions)
app.use(errorHandler);

export default app;