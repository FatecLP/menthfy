import { showAuthRequiredPopup } from './authRequiredPopup.js';

export function verifyDashboardAuthentication() {
    try {
        const usuario = sessionStorage.getItem('usuario');

        if (!usuario || usuario === 'null' || usuario === '') {
            showAuthRequiredPopup({
                title: 'Acesso restrito',
                message: 'Você precisa estar logado para acessar o dashboard.'
            });

            return false;
        }
        return true;
    } catch (error) {
        showAuthRequiredPopup({
            title: 'Acesso restrito',
            message: 'Você precisa estar logado para acessar o dashboard.'
        });

        return false;
    }
}

export function initializeDashboardLayout() {
    const usuario = sessionStorage.getItem('usuario');

    const welcomeText = document.querySelector('p[class*="text-[32px]"]');
    if (welcomeText) {
        welcomeText.textContent = `Bem-vindo(a), ${usuario}!`;
    }

    const topoBtn = document.querySelector('.topo-btn');
    if (topoBtn) {
        topoBtn.addEventListener('click', function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}