import { Router } from 'express';
import { generateSpeech, getVoices } from '../controllers/tts.controller.js';
import { validateTTSRequest } from '../middleware/validateRequest.js';
import { ttsLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * @route   GET /api/voices
 * @desc    Get curated list of supported languages and voices
 * @access  Public
 */
router.get('/voices', getVoices);

/**
 * @route   POST /api/tts
 * @desc    Synthesize text into speech and store in Supabase
 * @access  Public (Rate limited to 20 requests per 15 min window)
 */
router.post('/tts', ttsLimiter, validateTTSRequest, generateSpeech);

export default router;