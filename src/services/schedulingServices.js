import { customFetch, parseResponse, SCHEDULING_API_BASE_URL } from './api';

export { SCHEDULING_API_BASE_URL };

/**
 * Retrieves all lesson schedules for a given student.
 * @param {number|string} studentId - Unique identifier of the student.
 * @param {number|string} [mentorshipId] - Optional mentorship filter.
 * @returns {Promise<Array<object>>} List of lesson schedule records.
 */
export async function fetchStudentSchedules(studentId, mentorshipId = null) {
  const params = new URLSearchParams({ studentId: String(studentId) });
  if (mentorshipId) {
    params.append('mentorshipId', String(mentorshipId));
  }
  const response = await customFetch(`${SCHEDULING_API_BASE_URL}?${params.toString()}`);
  return parseResponse(response, 'Erro ao carregar agendamentos do aluno.');
}

/**
 * Retrieves all lesson schedules for a given teacher.
 * @param {number|string} teacherId - Unique identifier of the teacher.
 * @param {number|string} [mentorshipId] - Optional mentorship filter.
 * @returns {Promise<Array<object>>} List of lesson schedule records.
 */
export async function fetchTeacherSchedules(teacherId, mentorshipId = null) {
  const params = new URLSearchParams({ teacherId: String(teacherId) });
  if (mentorshipId) {
    params.append('mentorshipId', String(mentorshipId));
  }
  const response = await customFetch(`${SCHEDULING_API_BASE_URL}?${params.toString()}`);
  return parseResponse(response, 'Erro ao carregar agendamentos do professor.');
}

/**
 * Retrieves a single lesson schedule by identifier.
 * @param {number|string} id - Schedule identifier.
 * @param {{ studentId?: number|string, teacherId?: number|string }} [actor] - Identity of the querying actor.
 * @returns {Promise<object>} Schedule details.
 */
export async function fetchScheduleById(id, { studentId, teacherId } = {}) {
  const params = new URLSearchParams();
  if (studentId) params.append('studentId', String(studentId));
  if (teacherId) params.append('teacherId', String(teacherId));
  const queryString = params.toString();
  const endpoint = queryString ? `${SCHEDULING_API_BASE_URL}/${id}?${queryString}` : `${SCHEDULING_API_BASE_URL}/${id}`;
  const response = await customFetch(endpoint);
  return parseResponse(response, 'Erro ao consultar agendamento.');
}

/**
 * Submits a new lesson schedule request for an accepted mentorship.
 * @param {{ mentorshipId: number|string, studentId: number|string, startAt: string|Date, endAt: string|Date, format: 'Online'|'InPerson' }} payload - Schedule creation payload.
 * @returns {Promise<object>} Created lesson schedule record.
 */
export async function createLessonSchedule({ mentorshipId, studentId, startAt, endAt, format }) {
  const startAtIso = typeof startAt === 'string' ? startAt : new Date(startAt).toISOString();
  const endAtIso = typeof endAt === 'string' ? endAt : new Date(endAt).toISOString();

  const response = await customFetch(SCHEDULING_API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mentorshipId: Number(mentorshipId),
      studentId: Number(studentId),
      startAt: startAtIso,
      endAt: endAtIso,
      format,
    }),
  });
  return parseResponse(response, 'Erro ao agendar aula.');
}

/**
 * Updates the date, time, or format of a pending lesson schedule request.
 * @param {number|string} id - Schedule identifier.
 * @param {{ studentId: number|string, startAt: string|Date, endAt: string|Date, format: 'Online'|'InPerson' }} payload - Schedule update payload.
 * @returns {Promise<object>} Updated lesson schedule record.
 */
export async function updateLessonSchedule(id, { studentId, startAt, endAt, format }) {
  const startAtIso = typeof startAt === 'string' ? startAt : new Date(startAt).toISOString();
  const endAtIso = typeof endAt === 'string' ? endAt : new Date(endAt).toISOString();

  const response = await customFetch(`${SCHEDULING_API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: Number(studentId),
      startAt: startAtIso,
      endAt: endAtIso,
      format,
    }),
  });
  return parseResponse(response, 'Erro ao alterar agendamento.');
}

/**
 * Approves a pending lesson schedule request by the mentor teacher.
 * @param {number|string} id - Schedule identifier.
 * @param {number|string} teacherId - Mentor teacher identifier.
 * @returns {Promise<object>} Approved lesson schedule record.
 */
export async function approveLessonSchedule(id, teacherId) {
  const response = await customFetch(`${SCHEDULING_API_BASE_URL}/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId: Number(teacherId),
    }),
  });
  return parseResponse(response, 'Erro ao aprovar agendamento.');
}

/**
 * Rejects a pending lesson schedule request by the mentor teacher.
 * @param {number|string} id - Schedule identifier.
 * @param {number|string} teacherId - Mentor teacher identifier.
 * @returns {Promise<object>} Rejected lesson schedule record.
 */
export async function rejectLessonSchedule(id, teacherId) {
  const response = await customFetch(`${SCHEDULING_API_BASE_URL}/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId: Number(teacherId),
    }),
  });
  return parseResponse(response, 'Erro ao rejeitar agendamento.');
}

/**
 * Cancels a scheduled or pending lesson by either student or teacher.
 * @param {number|string} id - Schedule identifier.
 * @param {{ studentId?: number|string, teacherId?: number|string }} actor - Identity of the actor requesting cancellation.
 * @returns {Promise<null|object>} Null on success (204 No Content) or parsed response.
 */
export async function cancelLessonSchedule(id, { studentId, teacherId } = {}) {
  const body = {};
  if (studentId) body.studentId = Number(studentId);
  if (teacherId) body.teacherId = Number(teacherId);

  const response = await customFetch(`${SCHEDULING_API_BASE_URL}/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse(response, 'Erro ao cancelar agendamento.');
}
