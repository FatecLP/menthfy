import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import ScheduleLessonModal from '../components/ScheduleLessonModal';
import { getStoredUser } from '../utils/auth';
import { cancelMentorship } from '../services/mentorshipServices';
import { fetchStudentMentorships } from '../services/studentServices';
import { fetchStudentSchedules, cancelLessonSchedule } from '../services/schedulingServices';
import {
  formatFullDate,
  formatTimeRange,
  calculateDurationMinutes,
  formatDuration,
  getStatusConfig,
  getFormatConfig,
} from '../utils/schedulingUtils';

/**
 * Student dashboard page displaying enrolled mentorships and scheduled lessons.
 * @returns {JSX.Element} DashboardAlunoPage component.
 */
export default function DashboardAlunoPage() {
  const user = getStoredUser();
  const [mentorias, setMentorias] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellingScheduleId, setCancellingScheduleId] = useState(null);

  // Estado do modal de agendamento de aula
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMentorshipForSchedule, setSelectedMentorshipForSchedule] = useState(null);
  const [selectedScheduleForEdit, setSelectedScheduleForEdit] = useState(null);

  const loadMentorias = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchStudentMentorships(user.id);
      setMentorias(data || []);
    } catch (err) {
      console.error('Erro ao carregar mentorias do aluno:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadSchedules = useCallback(async () => {
    if (!user?.id) return;
    setLoadingSchedules(true);
    try {
      const data = await fetchStudentSchedules(user.id);
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar agendamentos do aluno:', err);
    } finally {
      setLoadingSchedules(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMentorias();
    loadSchedules();
  }, [loadMentorias, loadSchedules]);

  async function handleCancelarMentoria(id) {
    const result = await Swal.fire({
      title: 'Cancelar mentoria?',
      text: 'Tem certeza que deseja cancelar esta mentoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar',
    });

    if (!result.isConfirmed) return;

    setCancellingId(id);
    try {
      await cancelMentorship(id);
      await Swal.fire({
        icon: 'success',
        title: 'Mentoria cancelada!',
        text: 'A mentoria foi cancelada com sucesso.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadMentorias();
      await loadSchedules();
    } catch (err) {
      console.error('Erro ao cancelar mentoria:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Erro ao cancelar a mentoria.',
      });
    } finally {
      setCancellingId(null);
    }
  }

  function handleOpenCreateSchedule(mentorship) {
    setSelectedMentorshipForSchedule(mentorship);
    setSelectedScheduleForEdit(null);
    setIsScheduleModalOpen(true);
  }

  function handleOpenEditSchedule(schedule) {
    const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
    setSelectedMentorshipForSchedule(matchedMentorship || null);
    setSelectedScheduleForEdit(schedule);
    setIsScheduleModalOpen(true);
  }

  async function handleCancelarAgendamento(scheduleId) {
    const result = await Swal.fire({
      title: 'Cancelar agendamento?',
      text: 'Tem certeza que deseja cancelar esta aula agendada?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar aula',
      cancelButtonText: 'Manter',
    });

    if (!result.isConfirmed) return;

    setCancellingScheduleId(scheduleId);
    try {
      await cancelLessonSchedule(scheduleId, { studentId: user.id });
      await Swal.fire({
        icon: 'success',
        title: 'Aula cancelada!',
        text: 'O agendamento da aula foi cancelado.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSchedules();
    } catch (err) {
      console.error('Erro ao cancelar agendamento:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Não foi possível cancelar o agendamento.',
      });
    } finally {
      setCancellingScheduleId(null);
    }
  }

  const sessoesAprovadas = schedules.filter((s) => s.status === 'Approved').length;
  const sessoesPendentes = schedules.filter((s) => s.status === 'PendingApproval').length;
  const totalProfessores = new Set(mentorias.map((m) => m.teacherId)).size;

  return (
    <AuthGuard requiredRole="Aluno">
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Bem-vindo(a), {user?.nome || 'Aluno'}!
                </p>
              </div>

              {/* Cards de estatísticas */}
              <div className="flex flex-wrap gap-3 px-4 py-3">
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{sessoesAprovadas}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Aulas Confirmadas</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{sessoesPendentes}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Aguardando Confirmação</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{totalProfessores}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Professores</p>
                  </div>
                </div>
              </div>

              {/* Próximas sessões de aula */}
              <div className="flex items-center justify-between px-4 pb-2 pt-5">
                <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Próximas sessões de aula
                </h2>
                {schedules.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {schedules.length} {schedules.length === 1 ? 'agendamento' : 'agendamentos'}
                  </span>
                )}
              </div>

              <div className="px-4 py-2">
                {loadingSchedules ? (
                  <div className="border border-[#dce0e5] rounded-xl p-8 text-center bg-gray-50/50">
                    <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                    <p className="text-gray-500 text-sm">Carregando seus agendamentos...</p>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl mb-1">
                      <i className="fa-regular fa-calendar-plus"></i>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">Nenhuma aula agendada ainda</h3>
                    <p className="text-gray-500 text-sm max-w-md">
                      Você pode solicitar um horário de aula clicando em <strong className="text-blue-600 font-medium">"Agendar Aula"</strong> em qualquer mentoria aceita abaixo!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {schedules.map((schedule) => {
                      const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                      const teacherName = matchedMentorship?.teacherName || `Professor (Mentoria #${schedule.mentorshipId})`;
                      const teacherPhoto = matchedMentorship?.teacherPhoto || '/assets/images/default.webp';
                      const disciplina = matchedMentorship?.disciplina || 'Mentoria';

                      const statusCfg = getStatusConfig(schedule.status);
                      const formatCfg = getFormatConfig(schedule.format);
                      const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);

                      return (
                        <div
                          key={schedule.id}
                          className="border border-[#dce0e5] rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <img
                              src={teacherPhoto}
                              alt={teacherName}
                              className="w-14 h-14 rounded-full object-cover border shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/images/default.webp';
                              }}
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`}></span>
                                  {statusCfg.label}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${formatCfg.badgeClass}`}>
                                  <i className={`${formatCfg.icon} text-[10px]`}></i>
                                  {formatCfg.label}
                                </span>
                              </div>

                              <h3 className="font-semibold text-gray-900 text-base">{teacherName}</h3>
                              <p className="text-xs text-gray-500 mb-1">{disciplina}</p>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="flex items-center gap-1">
                                  <i className="fa-regular fa-calendar text-blue-600"></i>
                                  {formatFullDate(schedule.startAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="fa-regular fa-clock text-blue-600"></i>
                                  {formatTimeRange(schedule.startAt, schedule.endAt)}
                                </span>
                                <span className="text-gray-400">({formatDuration(durationMinutes)})</span>
                              </div>
                            </div>
                          </div>

                          {/* Ações do agendamento */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {schedule.status === 'Approved' && schedule.format === 'Online' && (
                              <Link
                                to="/videocall"
                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition no-underline"
                              >
                                <i className="fa-solid fa-video"></i>
                                Entrar na Aula
                              </Link>
                            )}

                            {schedule.status === 'PendingApproval' && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditSchedule(schedule)}
                                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                              >
                                <i className="fa-solid fa-pencil"></i>
                                Alterar Horário
                              </button>
                            )}

                            {(schedule.status === 'PendingApproval' || schedule.status === 'Approved') && (
                              <button
                                type="button"
                                onClick={() => handleCancelarAgendamento(schedule.id)}
                                disabled={cancellingScheduleId === schedule.id}
                                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
                              >
                                <i className="fa-solid fa-ban"></i>
                                {cancellingScheduleId === schedule.id ? 'Cancelando...' : 'Cancelar'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Minhas Mentorias */}
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-6">
                Minhas Mentorias
              </h2>
              <div id="minhasMentorias" className="px-4 py-2">
                {loading ? (
                  <p className="text-gray-500">Carregando mentorias...</p>
                ) : mentorias.length === 0 ? (
                  <p className="text-gray-500">Você ainda não possui mentorias solicitadas.</p>
                ) : (
                  mentorias.map((m) => {
                    const statusColor =
                      m.status === 'ACCEPTED'
                        ? 'text-green-600'
                        : m.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600';

                    const statusText =
                      m.status === 'ACCEPTED'
                        ? 'Aceita'
                        : m.status === 'PENDING'
                        ? 'Pendente'
                        : m.status === 'CANCELLED'
                        ? 'Cancelada'
                        : 'Recusada';

                    return (
                      <div
                        key={m.id}
                        className="border rounded-xl p-4 mb-4 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={m.teacherPhoto || '/assets/images/default.webp'}
                            alt={m.teacherName}
                            className="w-16 h-16 rounded-full object-cover border"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/default.webp';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{m.teacherName}</h3>
                            <p className="text-sm text-gray-500">{m.disciplina || 'Mentoria Geral'}</p>
                            <small className={`${statusColor} font-medium`}>{statusText}</small>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                          {m.status === 'ACCEPTED' && (
                            <button
                              type="button"
                              onClick={() => handleOpenCreateSchedule(m)}
                              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-sm shadow-blue-500/20"
                            >
                              <i className="fa-regular fa-calendar-plus"></i>
                              Agendar Aula
                            </button>
                          )}

                          {m.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelarMentoria(m.id)}
                              disabled={cancellingId === m.id}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
                            >
                              {cancellingId === m.id ? 'Cancelando...' : 'Cancelar Mentoria'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Comunicação */}
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Comunicação
              </h2>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                <div
                  className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                  data-icon="ChatCircleDots"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Mensagens</p>
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Envie uma mensagem ao Professor</p>
                </div>
              </div>

              <Link to="/videocall" className="no-underline text-inherit" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 cursor-pointer hover:bg-[#f9fafb] rounded-lg transition">
                  <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12" data-icon="Video">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Videochamada</p>
                    <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Inicie uma videochamada com seu Professor</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </div>

      {/* Modal de Agendamento */}
      <ScheduleLessonModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        mentorship={selectedMentorshipForSchedule}
        schedule={selectedScheduleForEdit}
        studentId={user?.id}
        onSuccess={() => {
          loadSchedules();
        }}
      />
    </AuthGuard>
  );
}
