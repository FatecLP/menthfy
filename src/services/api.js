export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';

async function parseResponse(response, defaultErrorMessage) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || defaultErrorMessage };
  }

  if (!response.ok) {
    throw new Error(data.message || defaultErrorMessage);
  }
  return data;
}

export async function fetchProfessores() {
  const response = await fetch('/api/professores');
  return parseResponse(response, 'Erro ao buscar a lista de professores');
}

export async function fetchProfessorById(id) {
  const response = await fetch(`/api/professores/${id}`);
  return parseResponse(response, 'Professor não encontrado');
}

export async function loginUser(email, senha) {
  const response = await fetch('/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return parseResponse(response, 'Erro ao realizar login');
}

export async function registerAluno(dados) {
  const response = await fetch('/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar aluno');
}

export async function registerProfessor(dados) {
  const response = await fetch('/api/professores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return parseResponse(response, 'Erro ao cadastrar professor');
}

export async function requestMentorship(studentId, teacherId) {
  const response = await fetch(MENTORSHIP_API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: Number(studentId),
      teacherId: Number(teacherId),
    }),
  });
  return parseResponse(response, 'Erro ao solicitar mentoria');
}

export async function fetchStudentMentorships(studentId) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/student/${studentId}`);
  return parseResponse(response, 'Erro ao carregar mentorias.');
}

export async function fetchTeacherMentorships(teacherId) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/teacher/${teacherId}`);
  return parseResponse(response, 'Erro ao buscar mentorias do professor.');
}

export async function acceptMentorship(id) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/${id}/accept`, {
    method: 'PUT',
  });
  return parseResponse(response, 'Erro ao aceitar mentoria.');
}

export async function cancelMentorship(id) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/${id}/cancel`, {
    method: 'PUT',
  });
  return parseResponse(response, 'Erro ao cancelar mentoria.');
}
