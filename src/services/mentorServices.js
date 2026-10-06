import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

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

export async function fetchProfessorById(id) {
  const response = await customFetch(`/api/professores/${id}`);
  return parseResponse(response, 'Professor não encontrado');
}

export async function fetchProfessorByName(nome) {
  const response = await customFetch(`/api/professores/nome/${encodeURIComponent(nome)}`);
  return parseResponse(response, 'Professor não encontrado');
}

export async function registerProfessor(dados) {
  const response = await customFetch('/api/professores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar professor');
}

export async function fetchTeacherMentorships(teacherId) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/teacher/${teacherId}`);
  return parseResponse(response, 'Erro ao buscar mentorias do professor.');
}
