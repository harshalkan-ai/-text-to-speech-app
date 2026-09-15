import rateLimit from 'express-rate-limit';

/**
 * General API Limiter:
 * Prevents basic bot flooding across all routes.
 * Max 100 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            message: 'Too many requests from this IP address. Please try again after 15 minutes.',
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
        },
    },
});

/**
 * Strict TTS Generation Limiter:
 * AI voice synthesis uses cloud quota and memory.
 * Limits TTS generation to 20 synthesis calls per 15 minutes per IP.
 */
export const ttsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            message: 'Synthesis quota limit reached for this session. Please wait a few minutes before generating more audio.',
            code: 'TTS_LIMIT_EXCEEDED',
            status: 429,
        },
    },
});

export default {
    generalLimiter,
    ttsLimiter,
};