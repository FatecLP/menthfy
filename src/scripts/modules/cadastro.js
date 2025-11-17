import { showAlreadyLogged } from "../utils/showAlreadyLogged.js";

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("cadastro.html")) {
        if (showAlreadyLogged()) return;
        const form = document.getElementById("cadastroForm");
        if (form) {
            form.addEventListener("submit", cadastrarUsuario);
        }
    }
});

async function cadastrarUsuario(e) {
    e.preventDefault();

    // dados do formulário
    const username = document.getElementById("username").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
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

    // Verificar duplicados no localStorage (opcional)
    const localUsers = JSON.parse(localStorage.getItem("menthfyUsers") || "[]");
    if (localUsers.some((u) => u.email === email)) {
        alert("E-mail já cadastrado.");
        return;
    }
    if (localUsers.some((u) => u.cpf === cpf)) {
        alert("CPF já cadastrado.");
        return;
    }

    const novoUsuario = {
        nome: username,
        cpf: Number(cpf),
        email,
        senha: password,
        tipoUsuario: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    };

    try {
        const res = await fetch("http://localhost:3333/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Erro ao cadastrar: ${data.message}`);
            return;
        }

        // Salvar localmente (opcional)
        localUsers.push(novoUsuario);
        localStorage.setItem("menthfyUsers", JSON.stringify(localUsers));

        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        window.location.href = "login.html";
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        alert("Erro interno ao cadastrar. Tente novamente.");
    }
}