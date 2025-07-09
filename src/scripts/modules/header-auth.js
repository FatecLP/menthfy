// script para gerenciar autenticação dinâmica no header
(function() {
    'use strict';
    
    // aguardar DOM carregar antes de processar
    document.addEventListener('DOMContentLoaded', function() {        
        // verificar se é página que deve ser processada
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('/auth/')) {
            debugLog('Página não elegível para alteração do header');
            return;
        }
        
        
        // aguardar para garantir que o DOM está carregado
        setTimeout(processarHeader, 100);
    });
    
    // função para processar e modificar o header
    function processarHeader() {
        
        // procurar pelo div do usuário no header
        const headerUserDiv = document.querySelector('header .header-1 > div');
        
        if (!headerUserDiv) {
            
            // seletores alternativos para encontrar o elemento
            const seletoresAlternativos = [
                'header div.header-1 > div',
                'header .header-1 div:last-child',
                'header .header-1 > div:last-child',
                'header div:last-child'
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
        const userEmail = sessionStorage.getItem("userEmail");
        const userCpf = sessionStorage.getItem("userCpf");
        
        // determinar caminhos baseado na localização atual
        let basePath = '';
        const pathname = window.location.pathname;
        
        if (pathname.includes('/catalog/') || pathname.includes('/dashboard/')) {
            basePath = '../../';
        } else if (pathname.includes('/auth/')) {
            basePath = '../../';
        } else {
            basePath = './';
        }
        
        // verificar se usuário está logado
        if (usuario && usuario !== 'null' && usuario !== '') {
            debugLog('Usuário logado - atualizando header com perfil');
            
            headerUserDiv.innerHTML = `
                <div class="user-profile" style="display: flex; align-items: center; gap: 12px;">
                    <h2 style="margin: 0; color: #fff; font-size: 18px; font-weight: 500;">${usuario}</h2>
                    <div class="user-avatar" style="cursor: pointer;" title="Clique para fazer logout">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                            <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="#9CA3AF"/>
                            <path d="M20 22C14.4771 22 10 26.4771 10 32V34C10 35.1046 10.8954 36 12 36H28C29.1046 36 30 35.1046 30 34V32C30 26.4771 25.5229 22 20 22Z" fill="#9CA3AF"/>
                        </svg>
                    </div>
                </div>
            `;
            
            // logout ao clicar no avatar
            const avatar = headerUserDiv.querySelector('.user-avatar');
            if (avatar) {
                avatar.addEventListener('click', function() {
                    if (confirm('Tem certeza que deseja fazer logout?')) {
                        // limpar dados da sessão
                        sessionStorage.removeItem("usuario");
                        sessionStorage.removeItem("tipoUsuario");
                        sessionStorage.removeItem("userEmail");
                        sessionStorage.removeItem("userCpf");
                        
                        alert('Logout realizado com sucesso!');
                        window.location.href = basePath + 'public/index.html';
                    }
                });
                debugLog('Event listener de logout adicionado');
            }
        } else {
            debugLog('Usuário não logado - atualizando header com botões');
            
            // usuário não logado - mostrar botões de login e cadastro
            headerUserDiv.innerHTML = `
                <div style="display: flex; gap: 8px; align-items: center;">
                    <a href="${basePath}pages/auth/login.html" class="login-btn" style="border-radius: 20px; background-color: #3E8EFF; border: none; padding: 8px 16px; text-decoration: none; color: white; font-size: 14px; font-weight: 500;">Login</a>
                    <a href="${basePath}pages/auth/cadastro.html" class="signup-btn" style="border-radius: 20px; background-color: #3E8EFF; border: none; padding: 8px 16px; text-decoration: none; color: white; font-size: 14px; font-weight: 500;">Cadastro</a>
                </div>
            `;
        }
        
        debugLog('Header atualizado com sucesso!');
    }
    
})();
