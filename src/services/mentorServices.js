export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';

export async function fetchProfessores() {
  const response = await fetch('/api/professores');
  return parseResponse(response, 'Erro ao buscar a lista de professores');
}

export async function fetchProfessorById(id) {
  const response = await fetch(`/api/professores/${id}`);
  return parseResponse(response, 'Professor não encontrado');
}