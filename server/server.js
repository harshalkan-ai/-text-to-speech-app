import app from './src/app.js';
import env from './src/config/env.js';
import { verifyStorageBucket } from './src/config/supabase.js';

/**
 * Start the Express Web Server and connect to external cloud services
 */
async function startServer() {
    try {
        console.log('⏳ Initializing Text-to-Speech Studio Backend...');

        // 1. Verify connection to Supabase Cloud Storage
        console.log('📡 Connecting to Supabase Cloud Storage...');
        await verifyStorageBucket();

        // 2. Start HTTP Listener on configured Port
        const server = app.listen(env.PORT, () => {
            console.log('====================================================');
            console.log(`🚀 TTS Server successfully started!`);
            console.log(`🌐 Local URL:    http://localhost:${env.PORT}`);
            console.log(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
            console.log(`🎙️ Active TTS:   ${env.TTS_PROVIDER.toUpperCase()}`);
            console.log(`📦 Environment:  ${env.NODE_ENV}`);
            console.log('====================================================');
        });

        // 3. Graceful Shutdown Handler (Clean cleanup on exit)
        const handleShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Shutting down server gracefully...`);
            server.close(() => {
                console.log('💤 HTTP server closed. Process terminated safely.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
        process.on('SIGINT', () => handleShutdown('SIGINT'));
    } catch (error) {
        console.error('❌ FATAL: Failed to start backend server:', error.message);
        process.exit(1);
    }
}

// Ignition
startServer();