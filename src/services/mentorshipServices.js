export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';

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

export async function cancelMentorship(id) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/${id}/cancel`, {
    method: 'PUT',
  });
  return parseResponse(response, 'Erro ao cancelar mentoria.');
}
