import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

/**
 * Retrieves the catalog of teachers/mentors with optional filtering criteria.
 * @param {object} [filters={}] - Query filters such as subject, name, rating, or order.
 * @returns {Promise<Array<object>>} List of mentor profiles matching criteria.
 */
export async function fetchProfessores(filters = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/professores?${queryString}` : '/api/professores';

  const response = await customFetch(endpoint);
  return parseResponse(response, 'Erro ao buscar a lista de professores');
}

/**
 * Retrieves a single teacher profile by identifier.
 * @param {number|string} id - Teacher identifier.
 * @returns {Promise<object>} Teacher profile data.
 */
export async function fetchProfessorById(id) {
  const response = await customFetch(`/api/professores/${id}`);
  return parseResponse(response, 'Professor não encontrado');
}

/**
 * Searches for a teacher by full or partial name.
 * @param {string} nome - Teacher name query.
 * @returns {Promise<object>} Teacher profile match.
 */
export async function fetchProfessorByName(nome) {
  const response = await customFetch(`/api/professores/nome/${encodeURIComponent(nome)}`);
  return parseResponse(response, 'Professor não encontrado');
}

/**
 * Registers a new teacher account in the platform.
 * @param {object} dados - Registration payload containing teacher details.
 * @returns {Promise<object>} Created teacher record.
 */
export async function registerProfessor(dados) {
  const response = await customFetch('/api/professores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar professor');
}

/**
 * Retrieves all mentorship requests received by a teacher.
 * @param {number|string} teacherId - Teacher identifier.
 * @returns {Promise<Array<object>>} List of mentorships assigned to the teacher.
 */
export async function fetchTeacherMentorships(teacherId) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/teacher/${teacherId}`);
  return parseResponse(response, 'Erro ao buscar mentorias do professor.');
}
