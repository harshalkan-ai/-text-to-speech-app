import { createClient } from '@supabase/supabase-js';
import env from './env.js';

/**
 * Initialize Supabase Client with the administrative Service Role Key.
 * This client bypasses Row Level Security (RLS) to manage audio uploads
 * and write speech logs directly from the trusted backend.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

/**
 * Verifies connectivity to the Supabase Cloud Storage bucket.
 * Creates bucket if it does not already exist.
 */
export async function verifyStorageBucket() {
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
            console.warn('⚠️ Supabase Storage warning:', error.message);
            return false;
        }

        const bucketExists = buckets.some((b) => b.name === env.SUPABASE_STORAGE_BUCKET);
        if (!bucketExists) {
            console.log(`📦 Bucket "${env.SUPABASE_STORAGE_BUCKET}" not found. Attempting automatic creation...`);
            const { error: createError } = await supabase.storage.createBucket(env.SUPABASE_STORAGE_BUCKET, {
                public: true,
            });

            if (createError) {
                console.warn(`⚠️ Could not auto-create bucket: ${createError.message}. Please verify manually in Supabase dashboard.`);
            } else {
                console.log(`✅ Supabase bucket "${env.SUPABASE_STORAGE_BUCKET}" created and ready!`);
            }
        } else {
            console.log(`✅ Supabase bucket "${env.SUPABASE_STORAGE_BUCKET}" verified and connected.`);
        }
        return true;
    } catch (err) {
        console.warn('⚠️ Could not verify Supabase storage bucket:', err.message);
        return false;
    }
}

export default supabase;