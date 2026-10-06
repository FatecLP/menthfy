import { customFetch, parseResponse, MENTORSHIP_API_BASE_URL } from './api';

export const API_BASE_URL = '';
export { MENTORSHIP_API_BASE_URL };

export async function fetchStudentMentorships(studentId) {
  const response = await customFetch(`${MENTORSHIP_API_BASE_URL}/student/${studentId}`);
  return parseResponse(response, 'Erro ao carregar mentorias.');
}

export async function registerAluno(dados) {
  const response = await customFetch('/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar aluno');
}