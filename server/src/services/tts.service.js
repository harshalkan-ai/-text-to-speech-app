import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { CURATED_VOICES } from '../utils/constants.js';

// Map ElevenLabs voice IDs to Azure Neural Voices as seamless backup
const ELEVEN_FALLBACK_MAP = {
    '21m00Tcm4TlvDq8ikWAM': 'en-US-JennyNeural',      // Rachel -> Jenny (Warm & Natural)
    'AZnzlk1XvdvUeBnXmlld': 'en-US-AriaNeural',       // Domi -> Aria (Expressive & Strong)
    'EXAVITQu4vr4xnSDxMaL': 'en-US-EmmaNeural',       // Bella -> Emma (Warm)
    'ErXwobaYiN019PkySvjV': 'en-US-GuyNeural',        // Antoni -> Guy (Crisp & Professional)
    'VR6AewLTigWG4xSOukaG': 'en-US-ChristopherNeural',// Arnold -> Christopher (Deep Narrative)
};

// Map each language to a default Female and Male voice
const DEFAULT_LANGUAGE_VOICES = {
    'en-US': { female: 'en-US-JennyNeural', male: 'en-US-GuyNeural' },
    'en-GB': { female: 'en-GB-SoniaNeural', male: 'en-GB-RyanNeural' },
    'en-IN': { female: 'en-IN-NeerjaNeural', male: 'en-IN-PrabhatNeural' },
    'hi-IN': { female: 'hi-IN-SwaraNeural', male: 'hi-IN-MadhurNeural' },
    'gu-IN': { female: 'gu-IN-DhwaniNeural', male: 'gu-IN-NiranjanNeural' },
    'mr-IN': { female: 'mr-IN-AarohiNeural', male: 'mr-IN-ManoharNeural' },
    'es-ES': { female: 'es-ES-ElviraNeural', male: 'es-ES-AlvaroNeural' },
    'fr-FR': { female: 'fr-FR-DeniseNeural', male: 'fr-FR-HenriNeural' },
    'de-DE': { female: 'de-DE-KatjaNeural', male: 'de-DE-ConradNeural' },
};

/**
 * Automatically translates text to the target language if required.
 * Returns translated text (or original text if translation fails or not needed).
 */
export async function translateTextToTarget(text, targetLang = 'en-US') {
    if (!text || !text.trim()) return text;
    
    // Extract 2-letter language code
    const lang = targetLang.split('-')[0].toLowerCase();
    
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text.trim())}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });

        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data[0])) {
                const translated = data[0].map(segment => segment[0]).join('').trim();
                if (translated) {
                    return translated;
                }
            }
        }
    } catch (err) {
        console.warn(`⚠️ Translation to [${lang}] failed, using original text:`, err.message);
    }

    return text;
}

/**
 * Resolves the appropriate Neural Voice name given voiceId, language, and gender preference
 */
function resolveVoice(voiceId, language = 'en-US') {
    // 1. Direct match with a curated voice
    const directVoice = CURATED_VOICES.find(v => v.id === voiceId);
    if (directVoice) {
        return directVoice.id;
    }

    // 2. ElevenLabs fallback mapping
    if (voiceId && ELEVEN_FALLBACK_MAP[voiceId]) {
        return ELEVEN_FALLBACK_MAP[voiceId];
    }

    // 3. Language default fallback
    const langConfig = DEFAULT_LANGUAGE_VOICES[language] || DEFAULT_LANGUAGE_VOICES['en-US'];
    return langConfig.female;
}

/**
 * Convert numeric speed (0.75, 1.0, 1.25, 1.5) to Edge TTS rate string ('-25%', '+0%', '+25%', '+50%')
 */
function formatSpeedRate(speed = 1.0) {
    const s = parseFloat(speed);
    if (isNaN(s) || s === 1.0) return '+0%';
    const pct = Math.round((s - 1.0) * 100);
    return (pct >= 0 ? `+${pct}%` : `${pct}%`);
}

/**
 * Synthesizes speech using Microsoft Azure Neural TTS engine
 */
async function synthesizeWithEdgeTTS({ text, voiceName, speed = 1.0 }) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const rate = formatSpeedRate(speed);
    const { audioStream } = tts.toStream(text, { rate });

    return new Promise((resolve, reject) => {
        const chunks = [];
        audioStream.on('data', chunk => chunks.push(chunk));
        audioStream.on('end', () => {
            const fullBuffer = Buffer.concat(chunks);
            if (fullBuffer.length === 0) {
                reject(new Error('Edge TTS returned empty audio buffer'));
            } else {
                resolve(fullBuffer);
            }
        });
        audioStream.on('error', err => reject(err));
    });
}

/**
 * Universal Secondary Fallback TTS using Google Translate TTS
 */
async function synthesizeUniversalFallback({ text, language = 'en-US' }) {
    const langCode = language ? language.split('-')[0].toLowerCase() : 'en';
    const sentences = text.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const s of sentences) {
        if ((currentChunk + ' ' + s).trim().length <= 150) {
            currentChunk = (currentChunk + ' ' + s).trim();
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = s.trim();
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    const audioBuffers = [];
    for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Accept: 'audio/mpeg',
            },
        });

        if (res.ok) {
            const arrayBuf = await res.arrayBuffer();
            audioBuffers.push(Buffer.from(arrayBuf));
        }
    }

    if (audioBuffers.length === 0) {
        throw new Error('Universal fallback generated no audio');
    }

    return Buffer.concat(audioBuffers);
}

/**
 * Main Speech Synthesis function
 * Supports distinct Female and Male voices for all languages with automatic script translation
 */
export async function synthesizeSpeech({ text, voiceId, speed = 1.0, language = 'en-US' }) {
    // 1. Determine target language and translate script if needed
    let textToSpeak = text.trim();
    const isEnglish = language.startsWith('en');

    if (!isEnglish) {
        textToSpeak = await translateTextToTarget(textToSpeak, language);
        console.log(`🌐 Translated to [${language}]: "${textToSpeak.substring(0, 40)}..."`);
    }

    // 2. Resolve the exact neural voice
    const activeVoice = resolveVoice(voiceId, language);
    console.log(`🎙️ Synthesizing with Voice: [${activeVoice}] (${language}) at ${speed}x`);

    // 3. Try Microsoft Azure Neural TTS first
    try {
        const audioBuffer = await synthesizeWithEdgeTTS({
            text: textToSpeak,
            voiceName: activeVoice,
            speed,
        });

        return {
            audioBuffer,
            mimeType: 'audio/mpeg',
            voiceId: activeVoice,
            format: 'mp3',
            translatedText: textToSpeak,
        };
    } catch (edgeError) {
        console.warn(`⚠️ Edge Neural TTS issue (${edgeError.message}). Using universal fallback...`);
    }

    // 4. Secondary fallback
    try {
        const audioBuffer = await synthesizeUniversalFallback({
            text: textToSpeak,
            language,
        });

        return {
            audioBuffer,
            mimeType: 'audio/mpeg',
            voiceId: activeVoice,
            format: 'mp3',
            translatedText: textToSpeak,
        };
    } catch (fallbackError) {
        console.error('❌ All TTS engines failed:', fallbackError);
        throw new AppError(`Speech synthesis failed: ${fallbackError.message}`, 500, 'TTS_FAILED');
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
    translateTextToTarget,
};