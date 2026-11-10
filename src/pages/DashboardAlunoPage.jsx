import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  BookOpen,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquare,
  Pencil,
  Search,
  Video,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
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
      await loadMentorias();
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
      cancelButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
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
      <div className="min-h-screen flex flex-col bg-slate-50/50 text-[#111418] font-['Inter',sans-serif]">
        <Header />

        {/* Welcome Header Banner */}
        <section className="bg-gradient-to-b from-[#F4F6FB] via-white to-slate-50/50 py-8 md:py-10 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20 inline-block">
                Painel do Aluno
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-0">
                Bem-vindo(a), {user?.nome || 'Aluno'}!
              </h1>
              <p className="text-sm text-gray-600 mb-0">
                Acompanhe suas aulas agendadas, organize horários e gerencie suas mentorias.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-xs text-decoration-none shrink-0 self-start sm:self-center"
            >
              <Search className="size-4" />
              <span>Explorar Mentores</span>
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
                    {sessoesAprovadas}
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
                  Aguardando Confirmação
                </p>
                {loadingSchedules ? (
                  <Loader2 className="size-6 animate-spin text-[#5F688F]/60 my-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight mb-0">
                    {sessoesPendentes}
                  </p>
                )}
              </div>
              <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="size-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Professores
                </p>
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-[#5F688F]/60 my-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight mb-0">
                    {totalProfessores}
                  </p>
                )}
              </div>
              <div className="size-12 rounded-xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center shrink-0">
                <GraduationCap className="size-6" />
              </div>
            </div>
          </div>

          {/* Upcoming Lessons Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
                Próximas sessões de aula
              </h2>
              {loadingSchedules ? (
                <LoadingSpinner variant="inline" size="sm" label="Consultando agenda..." className="text-xs" />
              ) : schedules.length > 0 ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5F688F]/10 text-[#5F688F] border border-[#5F688F]/20">
                  {schedules.length} {schedules.length === 1 ? 'agendamento' : 'agendamentos'}
                </span>
              ) : null}
            </div>

            {loadingSchedules ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white flex flex-col items-center justify-center gap-2">
                <div className="size-12 rounded-2xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center mb-1">
                  <CalendarPlus className="size-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-0">
                  Nenhuma aula agendada ainda
                </h3>
                <p className="text-gray-500 text-sm max-w-md mb-0">
                  Você pode solicitar um horário clicando em <strong className="text-[#5F688F] font-semibold">"Agendar Aula"</strong> em qualquer mentoria aceita abaixo.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => {
                  const matchedMentorship = mentorias.find((m) => m.id === schedule.mentorshipId);
                  const teacherName = matchedMentorship?.teacherName || `Professor (Mentoria #${schedule.mentorshipId})`;
                  const teacherPhoto = matchedMentorship?.teacherPhoto || '/assets/images/default.webp';
                  const disciplina = matchedMentorship?.disciplina || 'Mentoria';

                  const statusCfg = getStatusConfig(schedule.status);
                  const formatCfg = getFormatConfig(schedule.format);
                  const durationMinutes = calculateDurationMinutes(schedule.startAt, schedule.endAt);
                  const FormatIcon = schedule.format === 'Online' ? Video : MapPin;

                  return (
                    <div
                      key={schedule.id}
                      className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5F688F]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <img
                          src={teacherPhoto}
                          alt={teacherName}
                          className="size-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/default.webp';
                          }}
                        />
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

                          <h3 className="font-bold text-gray-900 text-base truncate mb-0.5">
                            {teacherName}
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
                        {schedule.status === 'Approved' && schedule.format === 'Online' && (
                          <Link
                            to="/videocall"
                            className="inline-flex items-center gap-1.5 bg-[#5F688F] hover:bg-[#4d5577] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition text-decoration-none"
                          >
                            <Video className="size-3.5" />
                            <span>Entrar na Aula</span>
                          </Link>
                        )}

                        {schedule.status === 'PendingApproval' && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditSchedule(schedule)}
                            className="inline-flex items-center gap-1.5 bg-[#5F688F]/10 hover:bg-[#5F688F]/15 text-[#5F688F] border border-[#5F688F]/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                            <span>Alterar Horário</span>
                          </button>
                        )}

                        {(schedule.status === 'PendingApproval' || schedule.status === 'Approved') && (
                          <button
                            type="button"
                            onClick={() => handleCancelarAgendamento(schedule.id)}
                            disabled={cancellingScheduleId === schedule.id}
                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                          >
                            {cancellingScheduleId === schedule.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Ban className="size-3.5" />
                            )}
                            <span>{cancellingScheduleId === schedule.id ? 'Cancelando...' : 'Cancelar'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* My Mentorships Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0">
                Minhas Mentorias
              </h2>
              {loading ? (
                <LoadingSpinner variant="inline" size="sm" label="Consultando mentorias..." className="text-xs" />
              ) : mentorias.length > 0 ? (
                <span className="text-xs font-semibold text-gray-500">
                  {mentorias.length} {mentorias.length === 1 ? 'mentoria' : 'mentorias'}
                </span>
              ) : null}
            </div>

            <div id="minhasMentorias" className="space-y-3">
              {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ) : mentorias.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white flex flex-col items-center justify-center gap-3">
                  <div className="size-12 rounded-2xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center">
                    <BookOpen className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      Você ainda não possui mentorias solicitadas
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mb-0">
                      Encontre o mentor ideal no catálogo para iniciar suas aulas particulares.
                    </p>
                  </div>
                  <Link
                    to="/catalogo"
                    className="inline-flex items-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition text-decoration-none"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                mentorias.map((m) => {
                  const statusBadge =
                    m.status === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : m.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';

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
                      className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5F688F]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={m.teacherPhoto || '/assets/images/default.webp'}
                          alt={m.teacherName}
                          className="size-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/default.webp';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-base text-gray-900 truncate mb-0">
                              {m.teacherName}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge}`}>
                              {statusText}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mb-0">
                            {m.disciplina || 'Mentoria Geral'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center shrink-0">
                        {m.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCreateSchedule(m)}
                            className="inline-flex items-center gap-1.5 bg-[#5F688F] hover:bg-[#4d5577] text-white px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border-0 shadow-xs"
                          >
                            <CalendarPlus className="size-3.5" />
                            <span>Agendar Aula</span>
                          </button>
                        )}

                        {m.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => handleCancelarMentoria(m.id)}
                            disabled={cancellingId === m.id}
                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                          >
                            {cancellingId === m.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Ban className="size-3.5" />
                            )}
                            <span>{cancellingId === m.id ? 'Cancelando...' : 'Cancelar Mentoria'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

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
                      Inicie ou entre em uma videochamada com seu professor
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
                      Envie mensagens diretas ao professor pela plataforma
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
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
