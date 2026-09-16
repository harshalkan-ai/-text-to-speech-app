import { AppError } from './errorHandler.js';
import { TTS_LIMITS } from '../utils/constants.js';

/**
 * Validates incoming POST /api/tts request payloads.
 * Ensures data is sanitized, bounds are respected, and types are valid.
 */
export function validateTTSRequest(req, res, next) {
    const { text, voice, speed } = req.body;

    // 1. Text presence validation
    if (!text || typeof text !== 'string') {
        return next(new AppError('Text is required and must be a valid string.', 400, 'INVALID_TEXT_TYPE'));
    }

    const trimmedText = text.trim();

    // 2. Minimum length check
    if (trimmedText.length < TTS_LIMITS.MIN_TEXT_LENGTH) {
        return next(new AppError('Text cannot be empty or contain only whitespace.', 400, 'EMPTY_TEXT'));
    }

    // 3. Maximum character limit check
    if (trimmedText.length > TTS_LIMITS.MAX_TEXT_LENGTH) {
        return next(
            new AppError(
                `Text exceeds the allowed limit of ${TTS_LIMITS.MAX_TEXT_LENGTH} characters (provided: ${trimmedText.length}).`,
                400,
                'TEXT_TOO_LONG'
            )
        );
    }

    // 4. Voice parameter check
    if (voice && typeof voice !== 'string') {
        return next(new AppError('Voice ID must be a string if provided.', 400, 'INVALID_VOICE_TYPE'));
    }

    // 5. Playback speed check (if provided)
    if (speed !== undefined) {
        const numSpeed = Number(speed);
        if (isNaN(numSpeed) || numSpeed < TTS_LIMITS.MIN_SPEED || numSpeed > TTS_LIMITS.MAX_SPEED) {
            return next(
                new AppError(
                    `Speed must be a number between ${TTS_LIMITS.MIN_SPEED} and ${TTS_LIMITS.MAX_SPEED}.`,
                    400,
                    'INVALID_SPEED'
                )
            );
        }
        req.body.speed = numSpeed;
    }

    // Attach sanitized text back to the request object
    req.body.text = trimmedText;
    next();
}

export default {
    validateTTSRequest,
};