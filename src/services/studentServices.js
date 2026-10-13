import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

/**
 * Fetches all mentorship requests associated with a student.
 * @param {number|string} studentId - Unique identifier of the student.
 * @returns {Promise<Array<object>>} List of mentorships for the student.
 */
export async function fetchStudentMentorships(studentId) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/student/${studentId}`);
  return parseResponse(response, 'Erro ao carregar mentorias.');
}

/**
 * Registers a new student account in the platform.
 * @param {object} dados - Registration payload containing student profile details.
 * @returns {Promise<object>} Created student record.
 */
export async function registerAluno(dados) {
  const response = await customFetch('/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar aluno');
}