import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

/**
 * Creates a new mentorship connection request from a student to a teacher.
 * @param {number|string} studentId - Student identifier.
 * @param {number|string} teacherId - Teacher identifier.
 * @returns {Promise<object>} Created mentorship record.
 */
export async function requestMentorship(studentId, teacherId) {
  const response = await customFetch(MENTORSHIP_API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: Number(studentId),
      teacherId: Number(teacherId),
    }),
  });
  return parseResponse(response, 'Erro ao solicitar mentoria');
}

/**
 * Cancels or terminates an existing mentorship.
 * @param {number|string} id - Mentorship identifier.
 * @returns {Promise<object>} Updated mentorship record.
 */
export async function cancelMentorship(id) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/${id}/cancel`, {
    method: 'PUT',
  });
  return parseResponse(response, 'Erro ao cancelar mentoria.');
}

/**
 * Accepts an incoming pending mentorship request by the teacher.
 * @param {number|string} id - Mentorship identifier.
 * @returns {Promise<object>} Updated mentorship record with accepted status.
 */
export async function acceptMentorship(id) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/${id}/accept`, {
    method: 'PUT',
  });
  return parseResponse(response, 'Erro ao aceitar mentoria.');
}