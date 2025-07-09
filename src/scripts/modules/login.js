import { showAlreadyLogged } from '../utils/showAlreadyLogged.js';

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
        // verifica se o usuário já está logado
        // se estiver, exibe mensagem e não exibe o formulário de recuperação
        if (showAlreadyLogged()) return;
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', logar);
        }
    }
});