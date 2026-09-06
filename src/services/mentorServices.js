export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';

export async function fetchProfessores() {
  const response = await fetch('/api/professores');
  return parseResponse(response, 'Erro ao buscar a lista de professores');
}