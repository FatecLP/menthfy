import { verifyDashboardAuthentication } from '../utils/dashboardAuth.js';

document.addEventListener('DOMContentLoaded', () => {
    const ok = verifyDashboardAuthentication();
    if (!ok) {
        setTimeout(() => { window.location.href = '/login'; }, 800);
        return;
    }

    const usuario = sessionStorage.getItem('usuario') || 'Usuário';
    const tipo = (sessionStorage.getItem('tipoUsuario') || 'aluno').toLowerCase();

    const userEl = document.querySelector('#username');
    if (userEl) userEl.textContent = usuario;

    const vcTitle = document.querySelector('#vcTitle');
    const roleBadge = document.querySelector('#participantRole');

    if (vcTitle) {
        vcTitle.textContent = tipo === 'professor' ? 'Videochamada — Professor' : 'Videochamada — Aluno';
    }
    if (roleBadge) {
        roleBadge.textContent = tipo === 'professor' ? 'Professor' : 'Aluno';
    }

    const thumbnails = document.getElementById('thumbnails');
    const participants = tipo === 'professor'
        ? ['Aluno 1', 'Aluno 2', 'Aluno 3']
        : ['Professor João', 'Assistente'];

    participants.forEach(name => {
        const d = document.createElement('div');
        d.className = 'thumb';
        d.innerHTML = `<div class="name">${name}</div>`;
        thumbnails.appendChild(d);
    });

    const connectingDots = document.getElementById('connectingDots');
    let dots = 0;
    const dotInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        if (connectingDots) connectingDots.textContent = 'Conectando' + '.'.repeat(dots);
    }, 400);

    setTimeout(() => {
        clearInterval(dotInterval);
        if (connectingDots) connectingDots.textContent = 'Conectado';
        const mainVideo = document.getElementById('mainVideo');
        if (mainVideo) {
            mainVideo.classList.remove('pulse');
        }
    }, 2400);

    const messages = document.getElementById('messages');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    function appendMessage(text, me = false) {
        const el = document.createElement('div');
        el.className = 'message' + (me ? ' me' : '');
        el.textContent = text;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    }

    setTimeout(() => appendMessage('Olá! Seja bem-vindo(a) à sessão.'), 600);
    setTimeout(() => appendMessage(tipo === 'professor' ? 'Alunos conectados: 3' : 'Professor conectado: Professor João'), 1200);

    chatForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, true);
        chatInput.value = '';

        // simular resposta
        setTimeout(() => {
            appendMessage('Mensagem automática: Recebido — ' + text);
        }, 900 + Math.random() * 700);
    });

    document.getElementById('btnMute')?.addEventListener('click', (e) => {
        const b = e.currentTarget;
        if (b.textContent.includes('Silenciar')) b.textContent = 'Ativar som'; else b.textContent = 'Silenciar';
    });
    document.getElementById('btnCam')?.addEventListener('click', (e) => {
        const b = e.currentTarget;
        if (b.textContent.includes('Câmera')) b.textContent = 'Ligar câmera'; else b.textContent = 'Câmera';
    });
    document.getElementById('btnScreen')?.addEventListener('click', (e) => {
        const b = e.currentTarget;
        b.classList.add('pulse');
        setTimeout(() => b.classList.remove('pulse'), 900);
    });
});
