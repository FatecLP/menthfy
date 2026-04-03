import { showAlreadyLogged } from "../utils/showAlreadyLogged.js";

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("/cadastro") || window.location.pathname.includes("cadastro.html")) {
        if (showAlreadyLogged()) return;
        const form = document.getElementById("cadastroForm");
        const cpfInput = document.getElementById("cpf");
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirmPassword");

        if (cpfInput) {
            cpfInput.addEventListener("input", formatCpfInput);
        }

        if (passwordInput && confirmPasswordInput) {
            passwordInput.addEventListener("input", checkPasswordMatch);
            confirmPasswordInput.addEventListener("input", checkPasswordMatch);
        }

        const toggleIcons = document.querySelectorAll(".password-toggle-icon");
        toggleIcons.forEach((icon) => {
            icon.addEventListener("click", togglePasswordVisibility);
        });

        if (form) {
            form.addEventListener("submit", cadastrarUsuario);
        }
    }
});

function checkPasswordMatch() {
    const passwordValue = document.getElementById("password").value;
    const confirmPasswordValue = document.getElementById("confirmPassword").value;
    const messageEl = document.getElementById("passwordMatchMessage");

    if (!messageEl) return;

    if (confirmPasswordValue === "") {
        messageEl.style.display = "none";
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        messageEl.style.display = "block";
        messageEl.textContent = "As senhas não coincidem.";
    } else {
        messageEl.style.display = "none";
        messageEl.textContent = "";
    }
}

function togglePasswordVisibility(event) {
    const icon = event.currentTarget;
    const targetId = icon.dataset.target;
    const input = document.getElementById(targetId);

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        icon.src = "https://www.svgrepo.com/show/380010/eye-password-show.svg";
        icon.alt = "Ocultar senha";
        icon.setAttribute("title", "Ocultar senha");
    } else {
        input.type = "password";
        icon.src = "https://www.svgrepo.com/show/380007/eye-password-hide.svg";
        icon.alt = "Mostrar senha";
        icon.setAttribute("title", "Mostrar senha");
    }
}

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
    const confirmPassword = document.getElementById("confirmPassword").value;
    const tipo = document.getElementById("tipo").value;

    // Validações
    const usernameRegex = /^(?!.*\s)[a-zA-Z0-9_\-]{3,32}$/; // sem espaços, 3-32, alfanum + _ -
    if (!username) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Nome de usuário não pode ficar vazio."
        });
        return;
    }

    if (!usernameRegex.test(username)) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Nome de usuário deve ter 3-32 caracteres e conter apenas letras, números, sublinhado ou hífen sem espaços."
        });
        return;
    }

    if (/^\d+$/.test(username)) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Nome de usuário não pode conter somente números."
        });
        return;
    }

    if (!cpf || !/^\d{11}$/.test(cpf)) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "CPF deve conter exatamente 11 números."
        });
        return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Informe um e-mail válido."
        });
        return;
    }

    if (!password || password.length < 6) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "A senha deve ter pelo menos 6 caracteres."
        });
        return;
    }

    if (password !== confirmPassword) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "As senhas não coincidem."
        });
        return;
    }

    if (!tipo || (tipo !== "aluno" && tipo !== "professor")) {
        await Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Selecione o tipo de usuário."
        });
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
            await Swal.fire({
                icon: "error",
                title: "Erro ao cadastrar",
                text: data.message || "Ocorreu um erro ao cadastrar."
            });
            return;
        }

        await Swal.fire({
            icon: "success",
            title: "Cadastro realizado",
            text: "Cadastro realizado com sucesso! Faça login para continuar."
        });

        window.location.href = "/login";
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        await Swal.fire({
            icon: "error",
            title: "Erro interno",
            text: "Erro interno ao cadastrar. Tente novamente."
        });
    }
}