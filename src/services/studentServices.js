export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';


export async function fetchStudentMentorships(studentId) {
  const response = await fetch(`${MENTORSHIP_API_BASE_URL}/student/${studentId}`);
  return parseResponse(response, 'Erro ao carregar mentorias.');
}
