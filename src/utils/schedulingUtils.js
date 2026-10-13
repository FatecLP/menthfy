/**
 * Utility functions for formatting and manipulating lesson schedules.
 */

/**
 * Formats an ISO date string into Brazilian date format (DD/MM/YYYY).
 * @param {string} dateString - ISO date string.
 * @returns {string} Formatted date.
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats an ISO date string into a verbose human-readable date.
 * @param {string} dateString - ISO date string.
 * @returns {string} Verbose formatted date.
 */
export function formatFullDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats an ISO date string into hours and minutes (HH:MM).
 * @param {string} dateString - ISO date string.
 * @returns {string} Formatted time.
 */
export function formatTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats start and end ISO date strings into a time range string.
 * @param {string} startString - Start date string.
 * @param {string} endString - End date string.
 * @returns {string} Formatted range (e.g., "14:00 - 15:00").
 */
export function formatTimeRange(startString, endString) {
  if (!startString) return '-';
  const start = formatTime(startString);
  if (!endString) return start;
  const end = formatTime(endString);
  return `${start} - ${end}`;
}

/**
 * Calculates duration between two ISO date strings in minutes.
 * @param {string} startString - Start date string.
 * @param {string} endString - End date string.
 * @returns {number} Duration in minutes.
 */
export function calculateDurationMinutes(startString, endString) {
  if (!startString || !endString) return 60;
  const start = new Date(startString).getTime();
  const end = new Date(endString).getTime();
  const diffMinutes = Math.round((end - start) / (1000 * 60));
  return diffMinutes > 0 ? diffMinutes : 60;
}

/**
 * Formats a duration in minutes into a human-friendly string (e.g., "1h", "45min", "1h 30min").
 * @param {number} minutes - Duration in minutes.
 * @returns {string} Formatted duration.
 */
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '1h';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${remainingMinutes}min`;
}

/**
 * Returns label, badge styling classes and icon for a lesson schedule status.
 * @param {string} status - Schedule status enum name.
 * @returns {{ label: string, badgeClass: string, dotClass: string, icon: string }} Status UI configuration.
 */
export function getStatusConfig(status) {
  switch (status) {
    case 'Approved':
      return {
        label: 'Confirmada',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
        icon: 'fa-regular fa-circle-check',
      };
    case 'PendingApproval':
      return {
        label: 'Aguardando Confirmação',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
        icon: 'fa-regular fa-clock',
      };
    case 'Rejected':
      return {
        label: 'Recusada',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
        icon: 'fa-regular fa-circle-xmark',
      };
    case 'Cancelled':
      return {
        label: 'Cancelada',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        dotClass: 'bg-slate-400',
        icon: 'fa-solid fa-ban',
      };
    default:
      return {
        label: status || 'Desconhecido',
        badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
        dotClass: 'bg-gray-400',
        icon: 'fa-regular fa-circle',
      };
  }
}

/**
 * Returns label, badge styling classes and icon for a lesson format.
 * @param {string} format - Lesson format enum name.
 * @returns {{ label: string, badgeClass: string, icon: string }} Format UI configuration.
 */
export function getFormatConfig(format) {
  switch (format) {
    case 'Online':
      return {
        label: 'Online',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: 'fa-solid fa-video',
      };
    case 'InPerson':
      return {
        label: 'Presencial',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: 'fa-solid fa-location-dot',
      };
    default:
      return {
        label: format || 'Não definido',
        badgeClass: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: 'fa-regular fa-calendar',
      };
  }
}
