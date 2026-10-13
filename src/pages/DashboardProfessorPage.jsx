import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { getStoredUser } from '../utils/auth';
import { cancelMentorship, acceptMentorship } from '../services/mentorshipServices';
import { fetchTeacherMentorships } from '../services/mentorServices';
import {
  fetchTeacherSchedules,
  approveLessonSchedule,
  rejectLessonSchedule,
  cancelLessonSchedule,
} from '../services/schedulingServices';
import {
  formatFullDate,
  formatTimeRange,
  calculateDurationMinutes,
  formatDuration,
  getStatusConfig,
  getFormatConfig,
} from '../utils/schedulingUtils';

/**
 * Teacher dashboard page for managing mentorship requests, lesson approvals, and confirmed sessions.
 * @returns {JSX.Element} DashboardProfessorPage component.
 */
export default function DashboardProfessorPage() {
  const user = getStoredUser();
  const [mentorias, setMentorias] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // Estados de carregamento das ações
  const [acceptingId, setAcceptingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [processingScheduleId, setProcessingScheduleId] = useState(null);

  const loadSolicitacoes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchTeacherMentorships(user.id);
      setMentorias(data || []);
    } catch (err) {
      console.error('Erro ao buscar solicitações do professor:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadSchedules = useCallback(async () => {
    if (!user?.id) return;
    setLoadingSchedules(true);
    try {
      const data = await fetchTeacherSchedules(user.id);
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar agendamentos do professor:', err);
    } finally {
      setLoadingSchedules(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSolicitacoes();
    loadSchedules();
  }, [loadSolicitacoes, loadSchedules]);

  async function handleAceitarMentoria(id) {
    setAcceptingId(id);
    try {
      await acceptMentorship(id);
      await Swal.fire({
        icon: 'success',
        title: 'Mentoria aceita!',
        text: 'A mentoria foi aceita com sucesso.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSolicitacoes();
    } catch (err) {
      console.error('Erro ao aceitar mentoria:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Erro ao aceitar a mentoria.',
      });
    } finally {
      setAcceptingId(null);
    }
  }

  async function handleCancelarMentoria(id) {
    const result = await Swal.fire({
      title: 'Cancelar mentoria?',
      text: 'Tem certeza que deseja cancelar/recusar esta mentoria?',
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
      await loadSolicitacoes();
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

  // Ações de agendamento de aula do professor
  async function handleAprovarAula(scheduleId) {
    setProcessingScheduleId(scheduleId);
    try {
      await approveLessonSchedule(scheduleId, user.id);
      await Swal.fire({
        icon: 'success',
        title: 'Aula confirmada!',
        text: 'O horário da aula foi aprovado com sucesso.',
        timer: 2000,
        showConfirmButton: false,
      });
      await loadSchedules();
    } catch (err) {
      console.error('Erro ao aprovar aula:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao aprovar aula',
        text: err.message || 'Não foi possível aprovar o agendamento.',
      });
    } finally {
      setProcessingScheduleId(null);
    }
  }

  async function handleRejeitarAula(scheduleId) {
    const result = await Swal.fire({
      title: 'Rejeitar solicitação?',
      text: 'Deseja realmente recusar este horário de aula solicitado pelo aluno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, recusar horário',
      cancelButtonText: 'Voltar',
    });

    if (!result.isConfirmed) return;

    setProcessingScheduleId(scheduleId);
    try {
      await rejectLessonSchedule(scheduleId, user.id);
      await Swal.fire({
        icon: 'success',
        title: 'Solicitação recusada',
        text: 'A proposta de horário foi rejeitada.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSchedules();
    } catch (err) {
      console.error('Erro ao rejeitar aula:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao recusar',
        text: err.message || 'Não foi possível recusar o agendamento.',
      });
    } finally {
      setProcessingScheduleId(null);
    }
  }

  async function handleCancelarAula(scheduleId) {
    const result = await Swal.fire({
      title: 'Cancelar aula agendada?',
      text: 'Tem certeza que deseja cancelar esta aula confirmada?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar aula',
      cancelButtonText: 'Manter',
    });

    if (!result.isConfirmed) return;

    setProcessingScheduleId(scheduleId);
    try {
      await cancelLessonSchedule(scheduleId, { teacherId: user.id });
      await Swal.fire({
        icon: 'success',
        title: 'Aula cancelada',
        text: 'O agendamento da aula foi cancelado.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSchedules();
    } catch (err) {
      console.error('Erro ao cancelar aula:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cancelar',
        text: err.message || 'Não foi possível cancelar a aula.',
      });
    } finally {
      setProcessingScheduleId(null);
    }
  }

  const pendentesMentoria = mentorias.filter((m) => m.status === 'PENDING');
  const aceitasMentoria = mentorias.filter((m) => m.status === 'ACCEPTED');

  const pendingSchedules = schedules.filter((s) => s.status === 'PendingApproval');
  const approvedSchedules = schedules.filter((s) => s.status === 'Approved');

  const totalAlunos = new Set(mentorias.map((m) => m.studentId)).size;

  return (
    <AuthGuard requiredRole="Professor">
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p id="welcomeMsg" className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Bem-vindo(a), {user?.nome || 'Professor'}!
                </p>
              </div>

              {/* Cards de estatísticas */}
              <div className="flex flex-wrap gap-3 px-4 py-3">
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{approvedSchedules.length}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Aulas Confirmadas</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{pendingSchedules.length}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Solicitações de Aulas</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{totalAlunos}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Alunos</p>
                  </div>
                </div>
              </div>

              {/* Solicitações de agendamento de aulas aguardando aprovação */}
              {pendingSchedules.length > 0 && (
                <div className="px-4 pt-4">
                  <div className="border-2 border-amber-300 bg-amber-50/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-sm">
                          <i className="fa-solid fa-bell"></i>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 leading-tight">
                            Solicitações de Aula Aguardando Sua Aprovação
                          </h2>
                          <p className="text-xs text-gray-600">
                            Alunos solicitaram horários para mentoria. Aprove ou recuse cada proposta abaixo.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-200/80 text-amber-900">
                        {pendingSchedules.length} pendente{pendingSchedules.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {pendingSchedules.map((schedule) => {
                        const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                        const studentName = matchedMentorship?.studentName || `Aluno (Mentoria #${schedule.mentorshipId})`;
                        const disciplina = matchedMentorship?.disciplina || 'Mentoria Geral';
                        const formatCfg = getFormatConfig(schedule.format);
                        const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);
                        const isProcessing = processingScheduleId === schedule.id;

                        return (
                          <div
                            key={schedule.id}
                            className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-bold text-base text-gray-900">{studentName}</span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${formatCfg.badgeClass}`}>
                                  <i className={`${formatCfg.icon} text-[10px]`}></i>
                                  {formatCfg.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{disciplina}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 font-medium">
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                  <i className="fa-regular fa-calendar text-amber-600"></i>
                                  {formatFullDate(schedule.startAt)}
                                </span>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                  <i className="fa-regular fa-clock text-amber-600"></i>
                                  {formatTimeRange(schedule.startAt, schedule.endAt)}
                                </span>
                                <span className="text-gray-500 font-normal">({formatDuration(durationMinutes)})</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                type="button"
                                onClick={() => handleRejeitarAula(schedule.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                              >
                                <i className="fa-solid fa-xmark"></i>
                                Recusar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAprovarAula(schedule.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Processando...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-check"></i>
                                    Aprovar Horário
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Próximas sessões confirmadas */}
              <div className="flex items-center justify-between px-4 pb-2 pt-6">
                <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Próximas sessões confirmadas
                </h2>
                {approvedSchedules.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {approvedSchedules.length} {approvedSchedules.length === 1 ? 'aula confirmada' : 'aulas confirmadas'}
                  </span>
                )}
              </div>

              <div className="px-4 py-2">
                {loadingSchedules ? (
                  <div className="border border-[#dce0e5] rounded-xl p-8 text-center bg-gray-50/50">
                    <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                    <p className="text-gray-500 text-sm">Carregando sessões...</p>
                  </div>
                ) : approvedSchedules.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl mb-1">
                      <i className="fa-regular fa-calendar"></i>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">Nenhuma aula agendada confirmada</h3>
                    <p className="text-gray-500 text-sm max-w-md">
                      Quando seus alunos solicitarem agendamentos e você os aprovar, as próximas sessões aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {approvedSchedules.map((schedule) => {
                      const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                      const studentName = matchedMentorship?.studentName || `Aluno (Mentoria #${schedule.mentorshipId})`;
                      const disciplina = matchedMentorship?.disciplina || 'Mentoria Geral';
                      const statusCfg = getStatusConfig(schedule.status);
                      const formatCfg = getFormatConfig(schedule.format);
                      const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);
                      const isProcessing = processingScheduleId === schedule.id;

                      return (
                        <div
                          key={schedule.id}
                          className="border border-[#dce0e5] rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-base text-gray-900">{studentName}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${formatCfg.badgeClass}`}>
                                <i className={`${formatCfg.icon} text-[10px]`}></i>
                                {formatCfg.label}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`}></span>
                                {statusCfg.label}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-2">{disciplina}</p>

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

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {schedule.format === 'Online' && (
                              <Link
                                to="/videocall"
                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition no-underline"
                              >
                                <i className="fa-solid fa-video"></i>
                                Videochamada
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCancelarAula(schedule.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
                            >
                              <i className="fa-solid fa-ban"></i>
                              {isProcessing ? 'Cancelando...' : 'Cancelar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Solicitações de mentoria geral pendentes */}
              <h2 className="text-[#111418] text-[22px] font-bold px-4 pb-3 pt-6">
                Solicitações de Mentoria
              </h2>
              <div id="solicitacoesMentoria" className="px-4 py-2">
                {loading ? (
                  <p className="text-gray-500">Carregando solicitações...</p>
                ) : pendentesMentoria.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma solicitação de mentoria pendente no momento.</p>
                ) : (
                  pendentesMentoria.map((m) => (
                    <div
                      key={m.id}
                      className="border rounded-xl p-4 mb-3 flex flex-col sm:flex-row justify-between sm:items-center bg-white shadow-sm gap-3 hover:shadow-md transition"
                    >
                      <div>
                        <strong className="text-base text-gray-900">{m.studentName || 'Aluno'}</strong>
                        <p className="text-xs text-gray-500 mt-0.5">Solicitou início de mentoria com você</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleCancelarMentoria(m.id)}
                          disabled={cancellingId === m.id || acceptingId === m.id}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === m.id ? 'Cancelando...' : 'Recusar'}
                        </button>
                        <button
                          onClick={() => handleAceitarMentoria(m.id)}
                          disabled={acceptingId === m.id || cancellingId === m.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition cursor-pointer font-semibold text-xs shadow-sm disabled:opacity-50"
                        >
                          {acceptingId === m.id ? 'Aceitando...' : 'Aceitar Mentoria'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Mentorias em andamento */}
              {aceitasMentoria.length > 0 && (
                <>
                  <h2 className="text-[#111418] text-[22px] font-bold px-4 pb-3 pt-5">Mentorias em Andamento</h2>
                  <div className="px-4 py-2">
                    {aceitasMentoria.map((m) => (
                      <div
                        key={m.id}
                        className="border rounded-xl p-4 mb-3 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition"
                      >
                        <div>
                          <h3 className="font-semibold text-base text-gray-900">{m.studentName || 'Aluno'}</h3>
                          <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1 mt-0.5">
                            <i className="fa-solid fa-circle-check text-[10px]"></i> Mentoria Ativa
                          </span>
                        </div>
                        <button
                          onClick={() => handleCancelarMentoria(m.id)}
                          disabled={cancellingId === m.id}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === m.id ? 'Cancelando...' : 'Encerrar Mentoria'}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

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
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Envie uma mensagem para um Aluno</p>
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
                    <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Inicie uma videochamada com seu Aluno</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
