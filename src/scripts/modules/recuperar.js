document.addEventListener('DOMContentLoaded', function () { // aguarda o carregamento do DOM
    const form = document.getElementById('recuperarForm'); // pega o formulário

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // previne recarregamento da página
        const email = document.getElementById('email').value.trim();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) { // regex para validar o e-mail
            alert('Informe um e-mail válido.');
            return;
        }
        try {
            let users = [];
            const response = await fetch('scripts/logins.json'); // busca os usuários do arquivo JSON
            if (response.ok) {
                users = await response.json();
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
            const user = users.find(u => u.email === email); // procura o usuário
            if (user) {
                alert('Um e-mail de recuperação foi enviado para ' + email);
                window.location.href = 'login.html';
            } else {
                alert('E-mail não cadastrado.');
            }
        } catch (err) {
            alert('Erro.');
        }
    });
});
