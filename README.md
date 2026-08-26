# Menthfy - Plataforma de Mentorias

[![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](https://github.com/FatecLP/menthfy)
[![GitHub last commit](https://img.shields.io/github/last-commit/FatecLP/menthfy)](https://github.com/FatecLP/menthfy/commits)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**Menthfy** é uma plataforma educacional inovadora que conecta alunos e professores em um ambiente digital moderno, responsivo e intuitivo. O sistema oferece uma experiência completa de ensino personalizado, permitindo que estudantes encontrem o mentor ideal para suas necessidades acadêmicas.

---

## 👥 Integrantes da Equipe

- André Diogo Melchior da Silva
- Juan Pablo Firmino Ferreira
- Michael Akira de Lima Kuwahara
- Murilo de Oliveira Sartori
- Vinicius Lima Carneiro
- Vitor de Almeida Bernardo

## 👨🏻‍🏫 Professores e Orientadores

- **PhD - Bruno Zolotareff dos Santos** (Metodologias Ágeis: FATEC Diadema - Luigi Papaiz)
- **PhD - Vinicius Heltai Pacheco** (Desenvolvimento Web II: FATEC Diadema - Luigi Papaiz)
- **MSc - Lucio Nunes de Lira** (Interação Humano-Computador: FATEC Diadema - Luigi Papaiz)

---

## 🏛️ Arquitetura de Microsserviços & Repositórios

A plataforma **Menthfy** é dividida em três camadas independentes e desacopladas:

| Repositório | Descrição | Tecnologias |
| :--- | :--- | :--- |
| **[FatecLP/menthfy](https://github.com/FatecLP/menthfy)** | **Frontend SPA** (Repositório Principal) | React 19, Vite, React Router, SweetAlert2 |
| **[FatecLP/menthfy-backend](https://github.com/FatecLP/menthfy-backend)** | **Backend API & Gateway** | Node.js, Express, MySQL2, CORS |
| **[FatecLP/mentorship-service](https://github.com/FatecLP/mentorship-service)** | **Microsserviço de Mentorias** | Java 21, Spring Boot 4, Spring Data JPA, Maven |

---

## 💻 Tecnologias do Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Funcionalidades do Frontend

### 👤 Sistema de Autenticação e Guards
- Cadastro e Login com validação em tempo real e diferenciação de perfil (**Aluno** / **Professor**).
- `AuthGuard` e `GuestGuard` para controle de acesso a rotas privadas e públicas.
- Menu de usuário responsivo com suporte a logout e redirecionamento dinâmico ao dashboard correspondente.

### 📚 Catálogo Dinâmico de Professores
- Listagem integrada via API com suporte a filtros por disciplina.
- Cálculo dinâmico e preciso da média de avaliações a partir dos dados do banco.
- Modal de perfil detalhado com cálculo de avaliação, bio e botão para solicitação de mentorias.

### 🎯 Dashboards Personalizados
- **Dashboard do Aluno:** Visualização das mentorias solicitadas e aceitas, professores contratados e acesso direto à sala de videochamada.
- **Dashboard do Professor:** Gerenciamento de solicitações de mentoria (aceitar / recusar) e acesso às salas de aula.

### 📹 Videochamada Integrada
- Interface com layout imersivo para sessões online de mentoria.

---

## 🚀 Como Executar o Frontend Localmente

### 1. Pré-requisitos
- **Node.js** (versão 20+)
- **npm**

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/FatecLP/menthfy.git

# Acesse o diretório
cd menthfy

# Instale as dependências
npm install
```

### 3. Executando em Modo Desenvolvimento

```bash
npm run dev
```
Acesse no seu navegador: **`http://localhost:5173`**

### 4. Build de Produção

```bash
npm run build
```

---

## 📜 Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este projeto está sob a licença MIT.

---

<div align="center">
  <strong>Desenvolvido com 💙 pela equipe Menthfy</strong><br>
  FATEC Luigi Papaiz - Diadema/SP - 2026
</div>
