import { showAuthRequiredPopup } from '../utils/authRequiredPopup.js';

// script para gerenciar autenticação dinâmica no header
(function () {
    "use strict";

    // aguardar DOM carregar antes de processar
    document.addEventListener("DOMContentLoaded", function () {
        processarHeader();
    });

    // função para processar e modificar o header
    function processarHeader() {
        // procurar pelo div do usuário no header
        const headerUserDiv = document.querySelector("header .header-1 > div");

        if (!headerUserDiv) {
            // seletores alternativos para encontrar o elemento
            const seletoresAlternativos = [
                "header div.header-1 > div",
                "header .header-1 div:last-child",
                "header .header-1 > div:last-child",
                "header div:last-child",
            ];

            let elemento = null;
            for (let seletor of seletoresAlternativos) {
                elemento = document.querySelector(seletor);
                if (elemento) {
                    break;
                }
            }

            if (!elemento) {
                return;
            }

            processarAuthentication(elemento);
        } else {
            processarAuthentication(headerUserDiv);
        }
    }

    // processar a autenticação e atualizar o header
    function processarAuthentication(headerUserDiv) {
        // obter dados do usuário da sessão
        const usuario = sessionStorage.getItem("usuario");
        const tipoUsuario = sessionStorage.getItem("tipoUsuario");

        function getDashboardPath() {
            const tipo = (tipoUsuario || "").toLowerCase();
            return tipo === "professor" ? "/dashboard-professor" : "/dashboard";
        }

        function abrirPopupAutenticacao() {
            showAuthRequiredPopup({
                title: "Acesso ao Dashboard",
                message: "Para entrar no dashboard, faça login ou crie sua conta."
            });
        }

        // determinar caminhos baseado na localização atual
        let basePath = "";
        const { pathname } = window.location;

        if (
            pathname.includes("/catalog/") ||
            pathname.includes("/dashboard/")
        ) {
            basePath = "../../";
        } else if (pathname.includes("/auth/")) {
            basePath = "../../";
        } else {
            basePath = "./";
        }

        // verificar se usuário está logado
        if (usuario && usuario !== "null" && usuario !== "") {
            headerUserDiv.innerHTML = `
                <div class="user-profile" style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; position: relative;">
                    <a href="${getDashboardPath()}" class="dashboard-link-btn header-action-btn header-action-btn-primary">Dashboard</a>
                    <div class="user-right" style="display: flex; align-items: center; gap: 8px;">
                        <div id="user-menu-trigger" class="user-avatar" title="Abrir menu de usuário">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                                <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="#9CA3AF"/>
                                <path d="M20 22C14.4771 22 10 26.4771 10 32V34C10 35.1046 10.8954 36 12 36H28C29.1046 36 30 35.1046 30 34V32C30 26.4771 25.5229 22 20 22Z" fill="#9CA3AF"/>
                            </svg>
                        </div>
                        <h2 id="user-menu-name" style="margin: 0; color: #fff; font-size: 18px; font-weight: 500; cursor: pointer;">${usuario}</h2>
                    </div>
                    <div class="user-menu user-menu-hidden" id="user-menu">
                        <ul>
                            <li><button id="logout-btn" class="menu-action-btn" type="button">Logout</button></li>
                        </ul>
                    </div>
                </div>
            `;

            // menu de logout
            const menuTrigger = headerUserDiv.querySelector('#user-menu-trigger');
            const menuName = headerUserDiv.querySelector('#user-menu-name');
            const userMenu = headerUserDiv.querySelector('#user-menu');
            const logoutBtn = headerUserDiv.querySelector('#logout-btn');

            const toggleMenu = function (event) {
                event.stopPropagation();
                if (!userMenu) return;
                if (userMenu.classList.contains('user-menu-visible')) {
                    userMenu.classList.remove('user-menu-visible');
                    userMenu.classList.add('user-menu-hidden');
                } else {
                    userMenu.classList.remove('user-menu-hidden');
                    userMenu.classList.add('user-menu-visible');
                }
            };

            if (menuTrigger) {
                menuTrigger.addEventListener('click', toggleMenu);
            }
            if (menuName) {
                menuName.addEventListener('click', toggleMenu);
            }

            document.addEventListener('click', function (event) {
                if (userMenu && !headerUserDiv.contains(event.target)) {
                    userMenu.classList.remove('user-menu-visible');
                    userMenu.classList.add('user-menu-hidden');
                }
            });

            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                    sessionStorage.removeItem('usuario');
                    sessionStorage.removeItem('tipoUsuario');
                    sessionStorage.removeItem('userEmail');
                    sessionStorage.removeItem('userCpf');

                    window.location.href = '/';
                });
            }
        } else {
            // usuário não logado
            const isLoginPage = pathname.includes("/login");
            const isCadastroPage = pathname.includes("/cadastro");
            const isRecuperarPage = pathname.includes("/recuperar");

            let authLinksHtml = "";

            if (isLoginPage) {
                authLinksHtml = `<a href="/cadastro" class="signup-btn header-action-btn header-action-btn-primary">Cadastro</a>`;
            } else if (isCadastroPage) {
                authLinksHtml = `<a href="/login" class="login-btn header-action-btn header-action-btn-primary">Login</a>`;
            } else if (isRecuperarPage) {
                authLinksHtml = `
                    <a href="/login" class="login-btn header-action-btn header-action-btn-primary">Login</a>
                    <a href="/cadastro" class="signup-btn header-action-btn header-action-btn-primary">Cadastro</a>
                `;
            } else {
                authLinksHtml = `
                    <a href="/login" class="login-btn header-action-btn header-action-btn-primary">Login</a>
                    <a href="/cadastro" class="signup-btn header-action-btn header-action-btn-primary">Cadastro</a>
                `;
            }

            headerUserDiv.innerHTML = `
                <div style="display: flex; gap: 8px; align-items: center;">
                    ${authLinksHtml}
                </div>
            `;
        }
    }
})();
