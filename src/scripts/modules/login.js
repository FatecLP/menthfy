import { showAlreadyLogged } from "../utils/showAlreadyLogged.js";
import { API_BASE_URL } from "../config/api.js";

document.addEventListener("DOMContentLoaded", function () {
    if (
        window.location.pathname.includes("/login") ||
        window.location.pathname.includes("login.html")
    ) {
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
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
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
        sessionStorage.setItem("userId", data.usuario.id);
        sessionStorage.setItem("usuario", data.usuario.nome);
        sessionStorage.setItem("tipoUsuario", data.usuario.tipoUsuario);
        sessionStorage.setItem("userEmail", data.usuario.email);
        sessionStorage.setItem("userId", data.usuario.id);

        await Swal.fire({
            title: "Login realizado com sucesso!",
            text: `Bem-vindo(a), ${data.usuario.nome}!`,
            icon: "success",
            draggable: true,
        });

        if (data.usuario.tipoUsuario === "Professor") {
            window.location.href = "/dashboard-professor";
        } else {
            window.location.href = "/dashboard";
        }
    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro interno. Tente novamente mais tarde.");
    }
}
