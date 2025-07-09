// Exibe mensagem de usuário já logado em páginas de autenticação
export function showAlreadyLogged(mainSelector = 'main') {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        const main = document.querySelector(mainSelector);
        if (main) {
            main.innerHTML = `
                <div class="already-logged-alert">
                    <div class="alert-content">
                        <h3>Você já está logado!</h3>
                        <p>Logado como: <strong>${usuario}</strong></p>
                        <button id="logoutBtn" class="logout-btn">Fazer logout</button>
                        <a href="../dashboard/dashboard-aluno.html" class="dashboard-btn">Ir para Dashboard</a>
                    </div>
                </div>
            `;
            document.getElementById('logoutBtn').onclick = function() {
                sessionStorage.removeItem("usuario");
                sessionStorage.removeItem("tipoUsuario");
                sessionStorage.removeItem("userEmail");
                sessionStorage.removeItem("userCpf");
                window.location.reload();
            }
            return true;
        }
    }
    return false;
}
