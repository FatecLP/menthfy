import { showAlreadyLogged } from "../utils/showAlreadyLogged.js";

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("/cadastro") || window.location.pathname.includes("cadastro.html")) {
        if (showAlreadyLogged()) return;
        const form = document.getElementById("cadastroForm");
        const cpfInput = document.getElementById("cpf");

        if (cpfInput) {
            cpfInput.addEventListener("input", formatCpfInput);
        }

        if (form) {
            form.addEventListener("submit", cadastrarUsuario);
        }
    }
});

function formatCpfInput(event) {
    let value = event.target.value.replace(/\D/g, "");
    value = value.slice(0, 11);
    value = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    event.target.value = value;
}


async function cadastrarUsuario(e) {
    e.preventDefault();

    // dados do formulário
    const username = document.getElementById("username").value.trim();
    const rawCpf = document.getElementById("cpf").value.trim();
    const cpf = rawCpf.replace(/\D/g, "");
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const tipo = document.getElementById("tipo").value;

    // Validações
    if (!username || username.length < 3) {
        alert("Nome de usuário deve ter pelo menos 3 caracteres.");
        return;
    }

    if (!cpf || !/^\d{11}$/.test(cpf)) {
        alert("CPF deve conter exatamente 11 números.");
        return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert("Informe um e-mail válido.");
        return;
    }

    if (!password || password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (!tipo || (tipo !== "aluno" && tipo !== "professor")) {
        alert("Selecione o tipo de usuário.");
        return;
    }

    const novoUsuario = {
        nome: username,
        cpf,
        email,
        senha: password,
        tipoUsuario: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    };

    try {
        const res = await fetch("/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Erro ao cadastrar: ${data.message}`);
            return;
        }

        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        window.location.href = "/login";
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        alert("Erro interno ao cadastrar. Tente novamente.");
    }
}