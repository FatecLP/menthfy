export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';


export async function fetchStudentMentorships(studentId) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/student/${studentId}`);
  return parseResponse(response, 'Erro ao carregar mentorias.');
}

export async function registerAluno(dados) {
  const response = await fetch('/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar aluno');
}