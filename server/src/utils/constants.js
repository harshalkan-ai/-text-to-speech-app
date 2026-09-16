/**
 * System Constraints and Thresholds
 */
export const TTS_LIMITS = {
    MIN_TEXT_LENGTH: 1,
    MAX_TEXT_LENGTH: 5000, // Safe threshold to avoid token/credit exhaustion
    DEFAULT_SPEED: 1.0,
    MIN_SPEED: 0.5,
    MAX_SPEED: 2.0,
};

/**
 * Supported Languages Catalog
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en-US', name: 'English (United States)' },
    { code: 'en-GB', name: 'English (United Kingdom)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'gu-IN', name: 'Gujarati (India)' },
    { code: 'mr-IN', name: 'Marathi (India)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
];

/**
 * Curated Voice Roster:
 * Contains high-fidelity ElevenLabs voice IDs as well as universal fallback tags.
 */
export const CURATED_VOICES = [
    {
        id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel (Calm & Natural)',
        language: 'en-US',
        gender: 'Female',
        provider: 'elevenlabs',
    },
    {
        id: 'AZnzlk1XvdvUeBnXmlld',
        name: 'Domi (Strong & Confident)',
        language: 'en-US',
        gender: 'Female',
        provider: 'elevenlabs',
    },
    {
        id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Bella (Warm & Expressive)',
        language: 'en-US',
        gender: 'Female',
        provider: 'elevenlabs',
    },
    {
        id: 'ErXwobaYiN019PkySvjV',
        name: 'Antoni (Crisp & Professional)',
        language: 'en-US',
        gender: 'Male',
        provider: 'elevenlabs',
    },
    {
        id: 'VR6AewLTigWG4xSOukaG',
        name: 'Arnold (Deep & Narrative)',
        language: 'en-US',
        gender: 'Male',
        provider: 'elevenlabs',
    },
    {
        id: 'hi-IN-Swara',
        name: 'Swara (Hindi Expressive)',
        language: 'hi-IN',
        gender: 'Female',
        provider: 'neural-fallback',
    },
    {
        id: 'hi-IN-Madhur',
        name: 'Madhur (Hindi Clear)',
        language: 'hi-IN',
        gender: 'Male',
        provider: 'neural-fallback',
    },
];

export default {
    TTS_LIMITS,
    SUPPORTED_LANGUAGES,
    CURATED_VOICES,
};