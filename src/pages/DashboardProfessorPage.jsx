import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  Bell,
  BookOpen,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  Users,
  Video,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
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
        confirmButtonColor: '#5F688F',
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
      cancelButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
      });
    } finally {
      setCancellingId(null);
    }
  }

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
        confirmButtonColor: '#5F688F',
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
      cancelButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
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
      cancelButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
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
      <div className="min-h-screen flex flex-col bg-slate-50/50 text-[#111418] font-['Inter',sans-serif]">
        <Header />

        {/* Welcome Header Banner */}
        <section className="bg-gradient-to-b from-[#F4F6FB] via-white to-slate-50/50 py-8 md:py-10 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20 inline-block">
                Painel do Professor
              </span>
              <h1 id="welcomeMsg" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-0">
                Bem-vindo(a), {user?.nome || 'Professor'}!
              </h1>
              <p className="text-sm text-gray-600 mb-0">
                Aprove solicitações de mentoria, confirme horários e acompanhe suas aulas.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-2xs text-decoration-none shrink-0 self-start sm:self-center"
            >
              <BookOpen className="size-4 text-[#5F688F]" />
              <span>Ver Catálogo</span>
            </Link>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Aulas Confirmadas
                </p>
                {loadingSchedules ? (
                  <Loader2 className="size-6 animate-spin text-[#5F688F]/60 my-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight mb-0">
                    {approvedSchedules.length}
                  </p>
                )}
              </div>
              <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CalendarCheck className="size-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Solicitações de Aulas
                </p>
                {loadingSchedules ? (
                  <Loader2 className="size-6 animate-spin text-[#5F688F]/60 my-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight mb-0">
                    {pendingSchedules.length}
                  </p>
                )}
              </div>
              <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Bell className="size-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Alunos
                </p>
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-[#5F688F]/60 my-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight mb-0">
                    {totalAlunos}
                  </p>
                )}
              </div>
              <div className="size-12 rounded-xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center shrink-0">
                <Users className="size-6" />
              </div>
            </div>
          </div>

          {/* Pending Schedule Approvals Spotlight */}
          {pendingSchedules.length > 0 && (
            <section className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Bell className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
                      Solicitações de Aula Aguardando Sua Aprovação
                    </h2>
                    <p className="text-xs text-gray-600 mb-0">
                      Alunos solicitaram horários para mentoria. Aprove ou recuse cada proposta abaixo.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-center text-xs font-bold px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 shrink-0">
                  {pendingSchedules.length} {pendingSchedules.length === 1 ? 'pendente' : 'pendentes'}
                </span>
              </div>

              <div className="space-y-3">
                {pendingSchedules.map((schedule) => {
                  const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                  const studentName = matchedMentorship?.studentName || `Aluno (Mentoria #${schedule.mentorshipId})`;
                  const disciplina = matchedMentorship?.disciplina || 'Mentoria Geral';
                  const formatCfg = getFormatConfig(schedule.format);
                  const FormatIcon = schedule.format === 'Online' ? Video : MapPin;
                  const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);
                  const isProcessing = processingScheduleId === schedule.id;

                  return (
                    <div
                      key={schedule.id}
                      className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className="size-12 rounded-2xl bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                          {studentName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-base text-gray-900 truncate">{studentName}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${formatCfg.badgeClass}`}>
                              <FormatIcon className="size-3" />
                              {formatCfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mb-2">{disciplina}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 font-medium">
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-gray-200">
                              <Calendar className="size-3.5 text-amber-600" />
                              {formatFullDate(schedule.startAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-gray-200">
                              <Clock className="size-3.5 text-amber-600" />
                              {formatTimeRange(schedule.startAt, schedule.endAt)}
                            </span>
                            <span className="text-gray-400 font-normal">({formatDuration(durationMinutes)})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRejeitarAula(schedule.id)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        >
                          <X className="size-3.5" />
                          <span>Recusar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAprovarAula(schedule.id)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer border-0 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>Processando...</span>
                            </>
                          ) : (
                            <>
                              <Check className="size-3.5" />
                              <span>Aprovar Horário</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Confirmed Sessions Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
                Próximas sessões confirmadas
              </h2>
              {loadingSchedules ? (
                <LoadingSpinner variant="inline" size="sm" label="Consultando sessões..." className="text-xs" />
              ) : approvedSchedules.length > 0 ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {approvedSchedules.length} {approvedSchedules.length === 1 ? 'aula confirmada' : 'aulas confirmadas'}
                </span>
              ) : null}
            </div>

            {loadingSchedules ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : approvedSchedules.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white flex flex-col items-center justify-center gap-2">
                <div className="size-12 rounded-2xl bg-slate-100 text-gray-500 flex items-center justify-center mb-1">
                  <Calendar className="size-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-0">
                  Nenhuma aula agendada confirmada
                </h3>
                <p className="text-gray-500 text-sm max-w-md mb-0">
                  Quando seus alunos solicitarem agendamentos e você os aprovar, as próximas sessões aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedSchedules.map((schedule) => {
                  const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                  const studentName = matchedMentorship?.studentName || `Aluno (Mentoria #${schedule.mentorshipId})`;
                  const disciplina = matchedMentorship?.disciplina || 'Mentoria Geral';
                  const statusCfg = getStatusConfig(schedule.status);
                  const formatCfg = getFormatConfig(schedule.format);
                  const FormatIcon = schedule.format === 'Online' ? Video : MapPin;
                  const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);
                  const isProcessing = processingScheduleId === schedule.id;

                  return (
                    <div
                      key={schedule.id}
                      className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5F688F]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="size-12 rounded-2xl bg-[#5F688F]/10 text-[#5F688F] font-bold text-base flex items-center justify-center shrink-0 uppercase">
                          {studentName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                              <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />
                              {statusCfg.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${formatCfg.badgeClass}`}>
                              <FormatIcon className="size-3" />
                              {formatCfg.label}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-gray-900 truncate mb-0.5">
                            {studentName}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium mb-2">{disciplina}</p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-gray-200/80">
                              <Calendar className="size-3.5 text-[#5F688F]" />
                              {formatFullDate(schedule.startAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-gray-200/80">
                              <Clock className="size-3.5 text-[#5F688F]" />
                              {formatTimeRange(schedule.startAt, schedule.endAt)}
                            </span>
                            <span className="text-gray-400">({formatDuration(durationMinutes)})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                        {schedule.format === 'Online' && (
                          <Link
                            to="/videocall"
                            className="inline-flex items-center gap-1.5 bg-[#5F688F] hover:bg-[#4d5577] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition text-decoration-none"
                          >
                            <Video className="size-3.5" />
                            <span>Videochamada</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCancelarAula(schedule.id)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Ban className="size-3.5" />
                          )}
                          <span>{isProcessing ? 'Cancelando...' : 'Cancelar'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Pending Mentorship Requests */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
                Solicitações de Mentoria
              </h2>
              {loading ? (
                <LoadingSpinner variant="inline" size="sm" label="Consultando solicitações..." className="text-xs" />
              ) : pendentesMentoria.length > 0 ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5F688F]/10 text-[#5F688F] border border-[#5F688F]/20">
                  {pendentesMentoria.length} {pendentesMentoria.length === 1 ? 'solicitação' : 'solicitações'}
                </span>
              ) : null}
            </div>

            <div id="solicitacoesMentoria" className="space-y-3">
              {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ) : pendentesMentoria.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-white">
                  <p className="text-gray-500 text-sm mb-0">
                    Nenhuma solicitação de mentoria pendente no momento.
                  </p>
                </div>
              ) : (
                pendentesMentoria.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5F688F]/30 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-12 rounded-2xl bg-[#5F688F]/10 text-[#5F688F] font-bold text-base flex items-center justify-center shrink-0 uppercase">
                        {(m.studentName || 'A').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-base text-gray-900 truncate">
                          {m.studentName || 'Aluno'}
                        </strong>
                        <p className="text-xs text-gray-500 mb-0">
                          Solicitou início de mentoria com você
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCancelarMentoria(m.id)}
                        disabled={cancellingId === m.id || acceptingId === m.id}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === m.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                        <span>{cancellingId === m.id ? 'Cancelando...' : 'Recusar'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAceitarMentoria(m.id)}
                        disabled={acceptingId === m.id || cancellingId === m.id}
                        className="inline-flex items-center gap-1.5 bg-[#5F688F] hover:bg-[#4d5577] text-white px-4 py-2 rounded-xl transition cursor-pointer font-semibold text-xs shadow-xs border-0 disabled:opacity-50"
                      >
                        {acceptingId === m.id ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Aceitando...</span>
                          </>
                        ) : (
                          <>
                            <Check className="size-3.5" />
                            <span>Aceitar Mentoria</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Active Mentorships */}
          {aceitasMentoria.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
                Mentorias em Andamento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aceitasMentoria.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5F688F]/30 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                        {(m.studentName || 'A').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-gray-900 truncate mb-0.5">
                          {m.studentName || 'Aluno'}
                        </h3>
                        <span className="text-emerald-600 text-xs font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          Mentoria Ativa
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCancelarMentoria(m.id)}
                      disabled={cancellingId === m.id}
                      className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {cancellingId === m.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Ban className="size-3.5" />
                      )}
                      <span>{cancellingId === m.id ? 'Cancelando...' : 'Encerrar'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Communication Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
              Comunicação
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/videocall"
                className="group bg-white border border-gray-200/80 hover:border-[#5F688F]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex items-center justify-between gap-4 text-decoration-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-12 rounded-xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center shrink-0">
                    <Video className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">Videochamada</h3>
                    <p className="text-xs text-gray-500 mb-0 line-clamp-2">
                      Inicie ou entre em uma videochamada com seu aluno
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-gray-400 group-hover:text-[#5F688F] group-hover:translate-x-1 transition shrink-0" />
              </Link>

              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 opacity-85">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-12 rounded-xl bg-slate-100 text-gray-500 flex items-center justify-center shrink-0">
                    <MessageSquare className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-bold text-gray-900 mb-0">Mensagens</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-gray-500 border border-gray-200">
                        Em breve
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-0 line-clamp-2">
                      Envie mensagens diretas aos seus alunos pela plataforma
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
