import Swal from 'sweetalert2';

export const API_BASE_URL = '';
export const MENTORSHIP_API_BASE_URL = '/api/mentorships';

export async function parseResponse(response, defaultErrorMessage) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || defaultErrorMessage };
  }

  if (!response.ok) {
    throw new Error(data.message || defaultErrorMessage);
  }
  return data;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let activeColdStartModal = false;

export async function customFetch(url, options = {}, config = {}) {
  const maxRetries = config.maxRetries ?? 3;
  const retryIntervalSec = config.retryIntervalSec ?? 8;
  const showFeedback = config.showFeedback ?? true;

  let lastError = null;
  let lastResponse = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const response = await fetch(url, options);

      // Status 429 (Rate Limit / Cold start) or transient cold-start 502/503/504
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
}

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
