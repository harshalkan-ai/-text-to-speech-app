import { apiRequest } from './api';

/**
 * Fetch available voices from backend REST API
 */
export async function fetchVoices() {
  return await apiRequest('/api/voices', { method: 'GET' });
}

/**
 * Synthesize speech from text
 * @param {Object} payload { text, voice, language, speed }
 */
export async function generateSpeechApi(payload) {
  return await apiRequest('/api/tts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch synthesis history
 */
export async function fetchHistory() {
  return await apiRequest('/api/history', { method: 'GET' });
}

/**
 * Delete a history item by ID
 * @param {string|number} id 
 */
export async function deleteHistoryApi(id) {
  return await apiRequest(`/api/history/${id}`, { method: 'DELETE' });
}
