import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import Day 3 Route Handlers
import ttsRoutes from './routes/tts.routes.js';
import historyRoutes from './routes/history.routes.js';

// Initialize Express application
const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Configuration
app.use(
    cors({
        origin: (origin, callback) => {
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

// 3. HTTP Request Logging
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global Rate Limiter
app.use('/api', generalLimiter);

// 6. Base Health Check
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

// 7. Mount Core Day 3 REST Endpoints
app.use('/api', ttsRoutes);              // /api/voices, /api/tts
app.use('/api/history', historyRoutes);  // /api/history

// 8. 404 Route Not Found Handler
app.use(notFoundHandler);

// 9. Centralized Global Error Handler
app.use(errorHandler);

export default app;