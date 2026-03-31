export function showAuthRequiredPopup(options = {}) {
    const {
        title = 'Acesso ao Dashboard',
        message = 'Para entrar no dashboard, faça login ou crie sua conta.'
    } = options;

    const popupExistente = document.getElementById('auth-required-popup');
    if (popupExistente) {
        popupExistente.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'auth-required-popup';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0, 0, 0, 0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '16px';
    overlay.style.zIndex = '9999';

    overlay.innerHTML = `
        <div style="width: 100%; max-width: 420px; background: #fff; border-radius: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.22); padding: 20px; font-family: Inter, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 22px;">${title}</h3>
            <p style="margin: 0 0 16px 0; color: #4B5563; line-height: 1.4;">${message}</p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button type="button" id="popup-login-btn" style="border: none; border-radius: 10px; background: #3E8EFF; color: #fff; padding: 10px 16px; font-weight: 600; cursor: pointer;">Login</button>
                <button type="button" id="popup-cadastro-btn" style="border: 1px solid #D1D5DB; border-radius: 10px; background: #fff; color: #111827; padding: 10px 16px; font-weight: 600; cursor: pointer;">Cadastro</button>
                <button type="button" id="popup-close-btn" style="margin-left: auto; border: none; border-radius: 10px; background: #F3F4F6; color: #374151; padding: 10px 16px; font-weight: 500; cursor: pointer;">Fechar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closePopup = function () {
        overlay.remove();
    };

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closePopup();
        }
    });

    const popupLoginBtn = document.getElementById('popup-login-btn');
    const popupCadastroBtn = document.getElementById('popup-cadastro-btn');
    const popupCloseBtn = document.getElementById('popup-close-btn');

    if (popupLoginBtn) {
        popupLoginBtn.addEventListener('click', function () {
            window.location.href = '/login';
        });
    }

    if (popupCadastroBtn) {
        popupCadastroBtn.addEventListener('click', function () {
            window.location.href = '/cadastro';
        });
    }

    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', closePopup);
    }
}