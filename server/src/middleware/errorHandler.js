import env from '../config/env.js';

/**
 * Custom application error class to carry standard HTTP status codes.
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
    const error = new AppError(`Endpoint not found: [${req.method}] ${req.originalUrl}`, 404, 'NOT_FOUND');
    next(error);
}

/**
 * Global Centralized Error Handling Middleware
 * Ensures the API never leaks stack traces to users in production
 * and always returns a uniform JSON response.
 */
export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'An unexpected server error occurred.';

    // Log error to server console for debugging
    console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, {
        code: errorCode,
        status: statusCode,
        message: err.message,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            code: errorCode,
            status: statusCode,
            // Only attach stack trace in local development mode
            ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
}

export default {
    AppError,
    notFoundHandler,
    errorHandler,
};