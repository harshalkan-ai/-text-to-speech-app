import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validates that all required environment variables are present.
 * Prevents the application from starting in an undefined or broken state.
 */
const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const envKey of requiredEnvs) {
    if (!process.env[envKey]) {
        console.error(`❌ CRITICAL CONFIG ERROR: Missing environment variable [${envKey}]. Check server/.env`);
        process.exit(1);
    }
}

export const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'tts-audio',

    // Text to Speech
    TTS_PROVIDER: process.env.TTS_PROVIDER || 'web-speech',
    TTS_API_KEY: process.env.TTS_API_KEY || '',
    TTS_REGION: process.env.TTS_REGION || 'eastus',
};

export default env;