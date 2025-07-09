import { showAlreadyLogged } from '../utils/showAlreadyLogged.js';

// aguarda o carregamento do DOM para inicializar formulário de recuperação
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('recuperar.html')) {
        // verifica se o usuário já está logado
        // se estiver, exibe mensagem e não exibe o formulário de recuperação
        if (showAlreadyLogged()) return;
        const form = document.getElementById('recuperarForm');
        if (form) {
            form.addEventListener('submit', recuperarSenha);
        }
    }
});

async function recuperarSenha(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    // validar formato do e-mail
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Informe um e-mail válido.');
        return;
    }
    
    try {
        let users = [];
        
        // buscar usuários do arquivo JSON
        const response = await fetch('scripts/logins.json');
        if (response.ok) {
            users = await response.json();
        }
        
        // buscar usuários do localStorage
        const localUsers = localStorage.getItem('menthfyUsers');
        if (localUsers) {
            const localArr = JSON.parse(localUsers);
            localArr.forEach(u => {
                // adicionar usuário se não estiver duplicado
                if (!users.some(j => j.email === u.email)) {
                    users.push(u);
                }
            });
        }
        
        // procurar usuário pelo e-mail
        const user = users.find(u => u.email === email);
        if (user) {
            alert('Um e-mail de recuperação foi enviado para ' + email);
            window.location.href = 'login.html';
        } else {
            alert('E-mail não cadastrado.');
        }
    } catch (err) {
        alert('Erro.');
    }
}
