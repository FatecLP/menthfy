import { showAlreadyLogged } from '../utils/showAlreadyLogged.js';

// aguarda o carregamento do DOM para inicializar o formulário de cadastro
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('cadastro.html')) {
        // verifica se o usuário já está logado
        // se estiver, exibe mensagem e não exibe o formulário de cadastro
        if (showAlreadyLogged()) return;
        const form = document.getElementById('cadastroForm');
        if (form) {
            form.addEventListener('submit', cadastrarUsuario);
        }
    }
});

function cadastrarUsuario(e) {
    e.preventDefault();

    // dados do formulário
    const username = document.getElementById('username').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;

    // validar nome de usuário
    if (!username || username.length < 3) {
        alert('Nome de usuário deve ter pelo menos 3 caracteres.');
        return;
    }
    
    // validar CPF (11 números)
    if (!cpf || !/^\d{11}$/.test(cpf)) {
        alert('CPF deve conter exatamente 11 números.');
        return;
    }
    
    // validar e-mail
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Informe um e-mail válido.');
        return;
    }
    
    // validar senha (mínimo 6 caracteres)
    if (!password || password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    // validar tipo de usuário
    if (!tipo || (tipo !== 'aluno' && tipo !== 'professor')) {
        alert('Selecione o tipo de usuário.');
        return;
    }

    try {
        // carregar usuários existentes do localStorage
        let users = [];
        const localUsers = localStorage.getItem('menthfyUsers');
        if (localUsers) {
            users = JSON.parse(localUsers);
        }

        // verificar se email já existe
        if (users.some(u => u.email === email)) {
            alert('E-mail já cadastrado.');
            return;
        }

        // verificar se CPF já existe
        if (users.some(u => u.cpf === cpf)) {
            alert('CPF já cadastrado.');
            return;
        }
        
        // adicionar novo usuário ao array
        const novoUsuario = {
            username: username,
            cpf: cpf,
            email: email,
            password: password,
            tipo: tipo,
            dataCadastro: new Date().toISOString()
        };

        users.push(novoUsuario);

        // salvar lista atualizada no localStorage
        localStorage.setItem('menthfyUsers', JSON.stringify(users));
        
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        window.location.href = 'login.html';

    } catch (err) {
        console.error('Erro no cadastro:', err);
        alert('Erro interno. Tente novamente.');
    }
}
