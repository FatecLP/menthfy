// se não houver dados no localStorage, inicializa com os usuários em logins.json
if (!localStorage.getItem("menthfyUsers")) {
  initializeDefaultUsers();
}

// async para carregar ao mesmo tempo que a página
async function initializeDefaultUsers() {
  try {
    const response = await fetch('./logins.json');
    const defaultUsers = await response.json();
    localStorage.setItem("menthfyUsers", JSON.stringify(defaultUsers));
  } catch (error) {
    console.error('Erro ao carregar logins:', error);
  }
}

function logar(event){
  event.preventDefault();

  let email = document.querySelector("#email").value;
  let password = document.querySelector("#senha").value;
  
  // verificar primeiro nos usuários cadastrados
  let usuariosCadastrados = localStorage.getItem("menthfyUsers");
  if (usuariosCadastrados) {
    let users = JSON.parse(usuariosCadastrados);
    for (let i = 0; i < users.length; i++) {
      if (email === users[i].email && password === users[i].password) {
        sessionStorage.setItem("usuario", users[i].username);
        sessionStorage.setItem("tipoUsuario", users[i].tipo);
        sessionStorage.setItem("userEmail", users[i].email);
        sessionStorage.setItem("userCpf", users[i].cpf);
        alert(`Bem-vindo(a), ${users[i].username}!`);
        
        // redirecionar baseado no tipo de usuário
        if (users[i].tipo === 'professor') {
          window.location.href = "../dashboard/dashboard-professor.html";
        } else {
          window.location.href = "../dashboard/dashboard-aluno.html";
        }
        return;
      }
    }
  }
  
  alert("E-mail ou senha incorretos!");
}

// verifica se o usuário já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('login.html')) {
      const usuario = sessionStorage.getItem("usuario");
      if (usuario) {
          const main = document.querySelector('main');
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
          }
      }
    }
});