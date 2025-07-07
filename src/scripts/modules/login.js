if (!localStorage.getItem("bancodedados")) {
  data_base();
}

function data_base() {
  let db = [
    { id: 1, usuario: "Konan", email: "konan@mail", senha: "1234" },
    { id: 2, usuario: "Pain", email: "pain@mail", senha: "1212" },
    { id: 3, usuario: "Itachi", email: "itachi@mail", senha: "1111" },
  ];

  let json = JSON.stringify(db);
  localStorage.setItem("bancodedados", json);
}

function logar(event){
  event.preventDefault();

  let mail = document.querySelector("#email").value;
  let sn = document.querySelector("#senha").value;
  
  // Verificar primeiro nos usuários cadastrados
  let usuariosCadastrados = localStorage.getItem("menthfyUsers");
  if (usuariosCadastrados) {
    let users = JSON.parse(usuariosCadastrados);
    for (let i = 0; i < users.length; i++) {
      if (mail === users[i].email && sn === users[i].password) {
        sessionStorage.setItem("usuario", users[i].username);
        sessionStorage.setItem("tipoUsuario", users[i].tipo);
        alert(`Bem-vindo(a), ${users[i].username}!`);
        
        // Redirecionar baseado no tipo de usuário
        if (users[i].tipo === 'professor') {
          window.location.href = "../dashboard/dashboard-professor.html";
        } else {
          window.location.href = "../dashboard/dashboard-aluno.html";
        }
        return;
      }
    }
  }
  
  // Se não encontrou nos cadastrados, verificar nos usuários padrão
  let dadosPadrao = JSON.parse(localStorage.getItem("bancodedados"));
  for (let i = 0; i < dadosPadrao.length; i++) {
    if (mail === dadosPadrao[i].email && sn === String(dadosPadrao[i].senha)){
      sessionStorage.setItem("usuario", dadosPadrao[i].usuario);
      sessionStorage.setItem("tipoUsuario", "aluno");
      alert(`Bem-vindo(a), ${dadosPadrao[i].usuario}!`);
      window.location.href = "../dashboard/dashboard-aluno.html";
      return;
    }
  }
  
  alert("E-mail ou senha incorretos!");
}

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
                  window.location.reload();
              }
          }
      }
    }
});