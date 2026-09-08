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


export async function loginUser(email, senha) {
  const response = await fetch('/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return parseResponse(response, 'Erro ao realizar login');
}


