import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createLessonSchedule, updateLessonSchedule } from '../services/schedulingServices';

/**
 * Modal dialog for requesting or rescheduling a mentorship lesson.
 * @param {object} props - Component properties.
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Modal close handler.
 * @param {object} [props.mentorship] - Target mentorship data.
 * @param {object} [props.schedule] - Existing schedule data when editing.
 * @param {number|string} props.studentId - Authenticated student identifier.
 * @param {Function} [props.onSuccess] - Callback executed on successful submission.
 */
export default function ScheduleLessonModal({
  isOpen,
  onClose,
  mentorship,
  schedule,
  studentId,
  onSuccess,
}) {
  const isEditing = Boolean(schedule?.id);

  // Valores padrão do formulário
  const [dataAula, setDataAula] = useState('');
  const [horaInicio, setHoraInicio] = useState('14:00');
  const [duracaoMinutos, setDuracaoMinutos] = useState(60);
  const [formato, setFormato] = useState('Online');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && schedule) {
      const startDate = new Date(schedule.startAt);
      const endDate = new Date(schedule.endAt);

      const yyyy = startDate.getFullYear();
      const mm = String(startDate.getMonth() + 1).padStart(2, '0');
      const dd = String(startDate.getDate()).padStart(2, '0');
      setDataAula(`${yyyy}-${mm}-${dd}`);

      const hh = String(startDate.getHours()).padStart(2, '0');
      const min = String(startDate.getMinutes()).padStart(2, '0');
      setHoraInicio(`${hh}:${min}`);

      const diffMin = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
      setDuracaoMinutos(diffMin > 0 ? diffMin : 60);

      setFormato(schedule.format || 'Online');
    } else {
      // Modo criação: sugere o dia seguinte às 14:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setDataAula(`${yyyy}-${mm}-${dd}`);
      setHoraInicio('14:00');
      setDuracaoMinutos(60);
      setFormato('Online');
    }
  }, [isOpen, isEditing, schedule]);

  if (!isOpen) return null;

  // Data mínima selecionável (data atual local)
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Calcula o horário de término para exibição prévia
  const getEndTimeDisplay = () => {
    if (!horaInicio) return '';
    const [h, m] = horaInicio.split(':').map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() + Number(duracaoMinutos));
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!dataAula) {
      Swal.fire({
        icon: 'warning',
        title: 'Data obrigatória',
        text: 'Por favor, selecione a data da aula.',
      });
      return;
    }

    if (!horaInicio) {
      Swal.fire({
        icon: 'warning',
        title: 'Horário obrigatório',
        text: 'Por favor, selecione o horário de início.',
      });
      return;
    }

    // Monta os objetos Date no fuso horário local
    const [year, month, day] = dataAula.split('-').map(Number);
    const [startHour, startMinute] = horaInicio.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, startHour, startMinute, 0);
    const endDate = new Date(startDate.getTime() + Number(duracaoMinutos) * 60 * 1000);

    const now = new Date();
    if (startDate <= now) {
      Swal.fire({
        icon: 'warning',
        title: 'Horário no passado',
        text: 'O início da aula deve estar no futuro. Escolha uma data e horário posteriores ao momento atual.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        const updated = await updateLessonSchedule(schedule.id, {
          studentId,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          format: formato,
        });

        await Swal.fire({
          icon: 'success',
          title: 'Agendamento atualizado!',
          text: 'Os horários da aula foram alterados com sucesso.',
          timer: 2000,
          showConfirmButton: false,
        });

        if (onSuccess) onSuccess(updated);
        onClose();
      } else {
        const created = await createLessonSchedule({
          mentorshipId: mentorship?.id,
          studentId,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          format: formato,
        });

        await Swal.fire({
          icon: 'success',
          title: 'Aula solicitada!',
          text: 'Sua solicitação de agendamento foi enviada ao professor. Aguarde a confirmação!',
          timer: 2500,
          showConfirmButton: false,
        });

        if (onSuccess) onSuccess(created);
        onClose();
      }
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao agendar aula',
        text: err.message || 'Não foi possível processar o agendamento. Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const teacherName = mentorship?.teacherName || schedule?.teacherName || 'Professor';
  const disciplina = mentorship?.disciplina || schedule?.disciplina || 'Mentoria';
  const teacherPhoto = mentorship?.teacherPhoto || schedule?.teacherPhoto || '/assets/images/default.webp';

  return (
    <div
      className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-fadeIn"
      style={{ minHeight: '100vh' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Cabeçalho com a cor oficial do Menthfy (#5F688F) */}
          <div className="shrink-0 bg-[#5F688F] px-6 py-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25">
                <i className="fa-regular fa-calendar-check text-xl text-white"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight text-white m-0">
                  {isEditing ? 'Alterar Horário da Aula' : 'Agendar Nova Aula'}
                </h2>
                <p className="text-xs text-white/80 mt-0.5 m-0">
                  Defina a data, duração e formato da sua sessão
                </p>
              </div>
            </div>
            {/* Botão de fechar com alto contraste e visibilidade */}
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/40 text-white flex items-center justify-center transition cursor-pointer border border-white/40 shadow-sm"
              aria-label="Fechar modal"
              title="Fechar"
            >
              <i className="fa-solid fa-xmark text-sm font-bold text-white"></i>
            </button>
          </div>

          {/* Conteúdo com scroll interno */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {/* Informações da mentoria */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#5F688F]/10 border border-[#5F688F]/20 shrink-0">
              <img
                src={teacherPhoto}
                alt={teacherName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/default.webp';
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-[#5F688F] uppercase tracking-wider block">
                  Mentoria Aceita
                </span>
                <p className="font-semibold text-gray-900 truncate text-sm m-0">{teacherName}</p>
                <p className="text-xs text-gray-500 truncate m-0">{disciplina}</p>
              </div>
            </div>

            {/* Data da Aula */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                <i className="fa-regular fa-calendar mr-1.5 text-[#5F688F]"></i> Data da Aula
              </label>
              <input
                type="date"
                min={minDate}
                value={dataAula}
                onChange={(e) => setDataAula(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5F688F]/20 focus:border-[#5F688F] text-sm font-medium transition"
              />
            </div>

            {/* Horário e Duração */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  <i className="fa-regular fa-clock mr-1.5 text-[#5F688F]"></i> Horário de Início
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5F688F]/20 focus:border-[#5F688F] text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  <i className="fa-solid fa-hourglass-half mr-1.5 text-[#5F688F]"></i> Duração
                </label>
                <select
                  value={duracaoMinutos}
                  onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5F688F]/20 focus:border-[#5F688F] text-sm font-medium transition bg-white"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora (padrão)</option>
                  <option value={90}>1 hora e 30 min</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            </div>

            {/* Prévia do intervalo de horário */}
            {horaInicio && (
              <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200/80 flex items-center justify-between shrink-0">
                <span>
                  Horário da sessão: <strong className="text-gray-800">{horaInicio} às {getEndTimeDisplay()}</strong>
                </span>
                <span className="text-[#5F688F] font-semibold">({duracaoMinutos} min)</span>
              </div>
            )}

            {/* Formato da Aula */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                <i className="fa-solid fa-chalkboard-user mr-1.5 text-[#5F688F]"></i> Formato da Aula
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormato('Online')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                    formato === 'Online'
                      ? 'border-[#5F688F] bg-[#5F688F]/10 text-[#5F688F] shadow-sm ring-2 ring-[#5F688F]/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fa-solid fa-video text-lg mb-1 ${formato === 'Online' ? 'text-[#5F688F]' : 'text-gray-400'}`}></i>
                  <span className="text-sm font-bold">Online</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">Videochamada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormato('InPerson')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                    formato === 'InPerson'
                      ? 'border-[#5F688F] bg-[#5F688F]/10 text-[#5F688F] shadow-sm ring-2 ring-[#5F688F]/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fa-solid fa-location-dot text-lg mb-1 ${formato === 'InPerson' ? 'text-[#5F688F]' : 'text-gray-400'}`}></i>
                  <span className="text-sm font-bold">Presencial</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">No campus / local</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-amber-700 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2 shrink-0">
              <i className="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
              <span>
                Ao enviar, o professor receberá a solicitação para aprovar o horário proposto.
              </span>
            </div>
          </div>

          {/* Rodapé fixo na base com botão no padrão Menthfy */}
          <div className="shrink-0 bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#5F688F] hover:bg-[#4d5577] text-white text-sm font-semibold shadow-md shadow-[#5F688F]/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-calendar-plus'}`}></i>
                  <span>{isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
