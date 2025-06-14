document.addEventListener('DOMContentLoaded', function () { // aguarda o carregamento do DOM
    const form = document.getElementById('cadastroForm'); // pega o formulário

    form.addEventListener('submit', async function (e) {
        const username = document.getElementById('username').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const tipo = document.getElementById('tipo').value;

        if (!username || username.length < 3) {
            alert('Nome de usuário deve ter pelo menos 3 caracteres.');
            return;
        }
        if (!cpf || !/^\d{11}$/.test(cpf)) { // regex para verificar se o CPF tem exatamente 11 dígitos
            alert('CPF deve conter exatamente 11 dígitos numéricos.');
            return;
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) { // regex para verificar se o e-mail é válido
            alert('Informe um e-mail válido.');
            return;
        }
        if (!password || password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (!tipo || (tipo !== 'aluno' && tipo !== 'professor')) {
            alert('Selecione o tipo de usuário.');
            return;
        }

        try {
            let users = [];
            const response = await fetch('scripts/logins.json'); // busca os usuários do arquivo JSON
            if (response.ok) {
                users = await response.json(); // converte a resposta em JSON
            }
            const localUsers = localStorage.getItem('menthfyUsers'); // busca os usuários do localStorage
            if (localUsers) {
                const localArr = JSON.parse(localUsers);
                localArr.forEach(u => {
                    if (!users.some(j => j.email === u.email)) { // se usuário não estiver duplicado
                        users.push(u);
                    }
                });
            }
            if (users.some(u => u.email === email)) {
                alert('E-mail já cadastrado.');
                return;
            }
            if (users.some(u => u.cpf === cpf)) {
                alert('CPF já cadastrado.');
                return;
            }
            users.push({ username, cpf, email, password, tipo }); // adiciona o novo usuário ao array

            localStorage.setItem('menthfyUsers', JSON.stringify(users));
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = 'login.html';
        } catch (err) {
            alert('Erro.');
        }
    });
});
