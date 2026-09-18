import { synthesizeSpeech, getVoicesList } from '../services/tts.service.js';
import { uploadAudioBuffer } from '../services/storage.service.js';
import supabase from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Controller: Handles POST /api/tts
 * Converts text to audio, uploads to Supabase, and saves synthesis metadata.
 */
export async function generateSpeech(req, res, next) {
    try {
        const { text, voice, language = 'en-US', speed = 1.0 } = req.body;

        // 1. Synthesize audio buffer using ElevenLabs or high-fidelity neural fallback
        const { audioBuffer, mimeType, voiceId, translatedText } = await synthesizeSpeech({
            text,
            voiceId: voice,
            speed,
            language,
        });

        // 2. Upload generated audio to Supabase Cloud Storage
        const { fileName, publicUrl, size } = await uploadAudioBuffer(audioBuffer, mimeType);

        // 3. Save generation record to Supabase database (Non-blocking safeguard)
        try {
            await supabase.from('synthesis_history').insert([
                {
                    text_snippet: text.length > 100 ? `${text.substring(0, 100)}...` : text,
                    character_count: text.length,
                    language,
                    voice_id: voiceId,
                    audio_url: publicUrl,
                    file_name: fileName,
                    file_size_bytes: size,
                    created_at: new Date().toISOString(),
                },
            ]);
        } catch (dbErr) {
            console.warn('⚠️ Non-fatal: Could not log to synthesis_history table:', dbErr.message);
        }

        // 4. Return successful response with streaming audio URL
        return res.status(200).json({
            success: true,
            message: 'Audio generated and uploaded successfully',
            data: {
                audioUrl: publicUrl,
                fileName,
                characterCount: text.length,
                voiceId,
                language,
                fileSizeBytes: size,
                translatedText: translatedText || text,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Controller: Handles GET /api/voices
 * Returns all available languages and curated voices.
 */
export async function getVoices(req, res, next) {
    try {
        const voices = await getVoicesList();

        return res.status(200).json({
            success: true,
            count: voices.length,
            voices,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    generateSpeech,
    getVoices,
};