import { showAlreadyLogged } from "../utils/showAlreadyLogged.js";

const API_URL = "http://localhost:3333";

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("login.html")) {
        if (showAlreadyLogged()) return;
        const form = document.getElementById("loginForm");
        if (form) {
            form.addEventListener("submit", logar);
        }
    }
});

async function logar(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#senha").value;

    if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha: password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
              await Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "E-mail ou senha incorretos!",
                  footer: '<a href="#">Por que estou tendo esse problema?</a>',
              });
            } else {
              await Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Erro ao tentar logar. Tente novamente.",
                  footer: '<a href="#">Por que estou tendo esse problema?</a>',
              });
            }
            return;
        }

        const data = await response.json();

        sessionStorage.setItem("usuario", data.usuario.nome);
        sessionStorage.setItem("tipoUsuario", data.usuario.tipoUsuario);
        sessionStorage.setItem("userEmail", data.usuario.email);
        sessionStorage.setItem("userCpf", data.usuario.cpf);

        await Swal.fire({
            title: "Login realizado com sucesso!",
            text: `Bem-vindo(a), ${data.usuario.nome}!`,
            icon: "success",
            draggable: true,
        });
      
        if (data.usuario.tipoUsuario === "Professor") {
            window.location.href = "../dashboard/dashboard-professor.html";
        } else {
            window.location.href = "../dashboard/dashboard-aluno.html";
        }
    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro interno. Tente novamente mais tarde.");
    }
}