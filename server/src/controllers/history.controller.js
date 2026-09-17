import supabase from '../config/supabase.js';
import { deleteAudioFile } from '../services/storage.service.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Controller: Handles GET /api/history
 * Fetches recent synthesis history records from Supabase database.
 */
export async function getHistory(req, res, next) {
    try {
        const { data, error } = await supabase
            .from('synthesis_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        // If table doesn't exist yet, return empty list gracefully
        if (error) {
            console.warn('⚠️ Notice: synthesis_history table query note:', error.message);
            return res.status(200).json({
                success: true,
                history: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: data?.length || 0,
            history: data || [],
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Controller: Handles DELETE /api/history/:id
 * Removes a record from the database and deletes its MP3 file from storage.
 */
export async function deleteHistoryItem(req, res, next) {
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError('History item ID is required.', 400, 'MISSING_ID');
        }

        // 1. Fetch file name from database record
        const { data: record, error: fetchError } = await supabase
            .from('synthesis_history')
            .select('file_name')
            .eq('id', id)
            .single();

        if (fetchError || !record) {
            throw new AppError('History record not found.', 404, 'NOT_FOUND');
        }

        // 2. Delete file from Supabase Storage
        if (record.file_name) {
            await deleteAudioFile(record.file_name);
        }

        // 3. Delete row from database
        await supabase.from('synthesis_history').delete().eq('id', id);

        return res.status(200).json({
            success: true,
            message: 'Audio history record and file removed successfully.',
        });
    } catch (error) {
        next(error);
    }
}

export default {
    getHistory,
    deleteHistoryItem,
};