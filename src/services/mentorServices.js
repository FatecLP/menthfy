import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

export async function fetchProfessores() {
  const response = await customFetch('/api/professores');
  return parseResponse(response, 'Erro ao buscar a lista de professores');
}

export async function fetchProfessorById(id) {
  const response = await customFetch(`/api/professores/${id}`);
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
