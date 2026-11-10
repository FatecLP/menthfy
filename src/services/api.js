import Swal from 'sweetalert2';

export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';
export const SCHEDULING_API_BASE_URL =
  import.meta.env.VITE_SCHEDULING_API_URL
    ? `${import.meta.env.VITE_SCHEDULING_API_URL.replace(/\/$/, '')}/api/lesson-schedules`
    : '/api/lesson-schedules';

/**
 * Parses an HTTP fetch response into JSON, supporting 204 No Content and standard ProblemDetails.
 * @param {Response} response - Fetch API Response object.
 * @param {string} defaultErrorMessage - Fallback message if no error details are provided.
 * @returns {Promise<any>} Parsed response data or null on status 204.
 */
export async function parseResponse(response, defaultErrorMessage) {
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || defaultErrorMessage };
  }

  if (!response.ok) {
    const errorMsg =
      data.message ||
      data.title ||
      (data.errors && Object.values(data.errors).flat().join(', ')) ||
      defaultErrorMessage;
    throw new Error(errorMsg);
  }
  return data;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let activeColdStartModal = false;
let activeNetworkRequests = 0;

function notifyNetworkListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('menthfy:network-loading', {
        detail: { count: activeNetworkRequests },
      })
    );
  }
}

/**
 * Performs an HTTP request with retry attempts to tolerate container cold starts.
 * @param {string} url - Target URL.
 * @param {RequestInit} [options={}] - Fetch configuration options.
 * @param {object} [config={}] - Custom retry configuration.
 * @returns {Promise<Response>} Resolved response from fetch.
 */
export async function customFetch(url, options = {}, config = {}) {
  // Em desenvolvimento local, não exibe modal de cold start nem bloqueia a interface
  const isDev = Boolean(import.meta.env?.DEV);
  const maxRetries = config.maxRetries ?? (isDev ? 0 : 3);
  const retryIntervalSec = config.retryIntervalSec ?? 8;
  const showFeedback = isDev ? false : (config.showFeedback ?? true);

  let lastError = null;
  let lastResponse = null;

  activeNetworkRequests += 1;
  notifyNetworkListeners();

  try {
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const response = await fetch(url, options);

        // Status 429 (Rate Limit / Cold start) ou falhas transitórias 502/503/504
        const isColdStart = [429, 502, 503, 504].includes(response.status);

        if (!isColdStart || attempt > maxRetries) {
          if (activeColdStartModal) {
            Swal.close();
            activeColdStartModal = false;
          }
          return response;
        }

        lastResponse = response;
      } catch (error) {
        lastError = error;
        if (attempt > maxRetries) {
          if (activeColdStartModal) {
            Swal.close();
            activeColdStartModal = false;
          }
          throw error;
        }
      }

      if (showFeedback) {
        activeColdStartModal = true;
        for (let sec = retryIntervalSec; sec > 0; sec--) {
          Swal.fire({
            title: 'Servidor Iniciando',
            html: `O servidor de mentorias está iniciando (cold start gratuito). Por favor, aguarde alguns segundos...<br><br><span style="font-size: 14px; color: #666;">Tentativa ${attempt} de ${maxRetries} &bull; Próxima tentativa em <b>${sec}s</b></span>`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await sleep(1000);
        }
      } else {
        await sleep(retryIntervalSec * 1000);
      }
    }

    if (activeColdStartModal) {
      Swal.close();
      activeColdStartModal = false;
    }

    if (lastResponse) return lastResponse;
    throw lastError || new Error('Serviço temporariamente indisponível.');
  } finally {
    activeNetworkRequests = Math.max(0, activeNetworkRequests - 1);
    notifyNetworkListeners();
  }
}

/**
 * Authenticates user credentials.
 * @param {string} email - User email address.
 * @param {string} senha - User password.
 * @returns {Promise<object>} Authenticated session payload.
 */
export async function loginUser(email, senha) {
  const response = await customFetch('/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return parseResponse(response, 'Erro ao realizar login');
}

export * from './studentServices';
export * from './mentorServices';
export * from './mentorshipServices';
export * from './schedulingServices';
