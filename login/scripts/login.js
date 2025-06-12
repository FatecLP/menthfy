document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-container'); // pega o formulário

    form.addEventListener('submit', async function (e) {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Preencha todos os campos.');
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

            const user = users.find(u => u.email === email && u.password === password); // procura o usuário com o e-mail e senha informados
            if (user) {
                localStorage.setItem('menthfyUser', JSON.stringify({ email: user.email, loginTime: Date.now(), tipo: user.tipo }));
                alert('Login realizado com sucesso!');
                if (user.tipo === 'professor') {
                    window.location.href = 'dashboard-professor.html';
                } else {
                    window.location.href = '/jp/menthfy/dashboard-aluno.html';
                }
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } catch (err) {
            alert('Erro.');
        }
    });
});