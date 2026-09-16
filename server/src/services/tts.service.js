import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { CURATED_VOICES } from '../utils/constants.js';

// Default ElevenLabs voice (Rachel - natural and expressive)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Converts text into speech using ElevenLabs Neural AI API.
 * @param {Object} params
 * @param {string} params.text - The text to synthesize
 * @param {string} [params.voiceId] - Optional voice ID
 * @param {number} [params.speed=1.0] - Optional playback rate
 * @returns {Promise<{ audioBuffer: Buffer, mimeType: string, voiceId: string }>}
 */
export async function synthesizeSpeech({ text, voiceId, speed = 1.0 }) {
    // If voiceId is not provided, use default
    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;

    // 1. Verify API Key is configured
    if (!env.TTS_API_KEY || env.TTS_API_KEY.trim() === '') {
        throw new AppError(
            'TTS API Key is missing. Please configure TTS_API_KEY in server/.env',
            503,
            'TTS_KEY_MISSING'
        );
    }

    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`;

    try {
        // 2. Call ElevenLabs API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': env.TTS_API_KEY,
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2', // High quality multilingual support (English, Hindi, etc.)
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true,
                },
            }),
        });

        // 3. Handle API errors from ElevenLabs (quota exhausted, invalid key, etc.)
        if (!response.ok) {
            let errorMessage = 'Failed to generate speech with ElevenLabs.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail?.message || errorData.message || errorMessage;
            } catch (e) {
                errorMessage = `ElevenLabs error status: ${response.status} ${response.statusText}`;
            }

            console.error(`❌ ElevenLabs API Error (${response.status}):`, errorMessage);

            if (response.status === 401) {
                throw new AppError('Invalid ElevenLabs API Key. Please verify your key in server/.env', 401, 'INVALID_API_KEY');
            }
            if (response.status === 429) {
                throw new AppError('ElevenLabs monthly quota exceeded or rate limited. Please check your credit balance.', 429, 'QUOTA_EXCEEDED');
            }

            throw new AppError(errorMessage, response.status, 'TTS_SYNTHESIS_FAILED');
        }

        // 4. Convert response stream into a Node.js Buffer
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        return {
            audioBuffer,
            mimeType: 'audio/mpeg',
            voiceId: selectedVoiceId,
            format: 'mp3',
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(`Speech synthesis service error: ${error.message}`, 500, 'TTS_SERVICE_ERROR');
    }
}

/**
 * Returns the list of supported voices for the frontend dropdowns.
 */
export async function getVoicesList() {
    return CURATED_VOICES;
}

export default {
    synthesizeSpeech,
    getVoicesList,
};