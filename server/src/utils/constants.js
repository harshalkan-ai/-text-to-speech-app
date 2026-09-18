/**
 * System Constraints and Thresholds
 */
export const TTS_LIMITS = {
    MIN_TEXT_LENGTH: 1,
    MAX_TEXT_LENGTH: 5000,
    DEFAULT_SPEED: 1.0,
    MIN_SPEED: 0.5,
    MAX_SPEED: 2.0,
};

/**
 * Supported Languages Catalog
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
];

/**
 * Curated Voice Roster: Each language features distinct Female and Male Neural AI Voices
 */
export const CURATED_VOICES = [
    // English (US)
    { id: 'en-US-JennyNeural', name: 'Jenny (Warm & Natural)', language: 'en-US', gender: 'Female', provider: 'neural-studio' },
    { id: 'en-US-GuyNeural', name: 'Guy (Confident & Clear)', language: 'en-US', gender: 'Male', provider: 'neural-studio' },
    { id: 'en-US-AriaNeural', name: 'Aria (Expressive & Melodic)', language: 'en-US', gender: 'Female', provider: 'neural-studio' },
    { id: 'en-US-ChristopherNeural', name: 'Christopher (Authoritative & Deep)', language: 'en-US', gender: 'Male', provider: 'neural-studio' },

    // English (UK)
    { id: 'en-GB-SoniaNeural', name: 'Sonia (Sophisticated British)', language: 'en-GB', gender: 'Female', provider: 'neural-studio' },
    { id: 'en-GB-RyanNeural', name: 'Ryan (Modern British)', language: 'en-GB', gender: 'Male', provider: 'neural-studio' },

    // English (India)
    { id: 'en-IN-NeerjaNeural', name: 'Neerja (Melodic Indian English)', language: 'en-IN', gender: 'Female', provider: 'neural-studio' },
    { id: 'en-IN-PrabhatNeural', name: 'Prabhat (Clear Indian English)', language: 'en-IN', gender: 'Male', provider: 'neural-studio' },

    // Hindi (India)
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Expressive Hindi)', language: 'hi-IN', gender: 'Female', provider: 'neural-studio' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Deep & Clear Hindi)', language: 'hi-IN', gender: 'Male', provider: 'neural-studio' },

    // Gujarati (India)
    { id: 'gu-IN-DhwaniNeural', name: 'Dhwani (Melodic Gujarati)', language: 'gu-IN', gender: 'Female', provider: 'neural-studio' },
    { id: 'gu-IN-NiranjanNeural', name: 'Niranjan (Crisp Gujarati)', language: 'gu-IN', gender: 'Male', provider: 'neural-studio' },

    // Marathi (India)
    { id: 'mr-IN-AarohiNeural', name: 'Aarohi (Expressive Marathi)', language: 'mr-IN', gender: 'Female', provider: 'neural-studio' },
    { id: 'mr-IN-ManoharNeural', name: 'Manohar (Confident Marathi)', language: 'mr-IN', gender: 'Male', provider: 'neural-studio' },

    // Spanish (Spain)
    { id: 'es-ES-ElviraNeural', name: 'Elvira (Dynamic Spanish)', language: 'es-ES', gender: 'Female', provider: 'neural-studio' },
    { id: 'es-ES-AlvaroNeural', name: 'Alvaro (Warm Spanish)', language: 'es-ES', gender: 'Male', provider: 'neural-studio' },

    // French (France)
    { id: 'fr-FR-DeniseNeural', name: 'Denise (Elegant French)', language: 'fr-FR', gender: 'Female', provider: 'neural-studio' },
    { id: 'fr-FR-HenriNeural', name: 'Henri (Narrative French)', language: 'fr-FR', gender: 'Male', provider: 'neural-studio' },

    // German (Germany)
    { id: 'de-DE-KatjaNeural', name: 'Katja (Clear German)', language: 'de-DE', gender: 'Female', provider: 'neural-studio' },
    { id: 'de-DE-ConradNeural', name: 'Conrad (Deep German)', language: 'de-DE', gender: 'Male', provider: 'neural-studio' },
];

export default {
    TTS_LIMITS,
    SUPPORTED_LANGUAGES,
    CURATED_VOICES,
};