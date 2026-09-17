import { Router } from 'express';
import { getHistory, deleteHistoryItem } from '../controllers/history.controller.js';

const router = Router();

/**
 * @route   GET /api/history
 * @desc    Fetch recent speech synthesis history records
 * @access  Public
 */
router.get('/', getHistory);

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a speech history entry and remove its audio file from cloud storage
 * @access  Public
 */
router.delete('/:id', deleteHistoryItem);

export default router;