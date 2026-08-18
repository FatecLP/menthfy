# Menthfy - README

[![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](https://github.com/FatecLP/Menthfy)
[![GitHub last commit](https://img.shields.io/github/last-commit/FatecLP/Menthfy)](https://github.com/FatecLP/Menthfy/commits)

## 🌐 Acesso ao Site

**🔗 [Menthfy](https://fateclp.github.io/menthfy/public/)**

> Acesse a versão live da plataforma Menthfy hospedada no GitHub Pages.

## 👥 Nomes dos Integrantes

- André Diogo Melchior da Silva
- Juan Pablo Firmino Ferreira
- Michael Akira de Lima Kuwahara
- Murilo de Oliveira Sartori
- Vinicius Lima Carneiro
- Vitor de Almeida Bernardo

## 👨🏻‍🏫 Professores

- **PhD - Bruno Zolotareff dos Santos** (Metodologias Ágeis: FATEC Diadema - Luigi Papaiz)
- **PhD - Vinicius Heltai Pacheco** (Desenvolvimento Web II: FATEC Diadema - Luigi Papaiz)
- **MSc - Lucio Nunes de Lira** (Interação Humano-Computador: FATEC Diadema - Luigi Papaiz)

## 📝 Descrição do Projeto

**Menthfy** é uma plataforma educacional inovadora que conecta alunos e professores em um ambiente digital moderno e intuitivo. O sistema oferece uma experiência completa de ensino personalizado, permitindo que estudantes encontrem o mentor ideal para suas necessidades acadêmicas.

A plataforma aplica conceitos abordados nas matérias de **Design Digital**, **Desenvolvimento Web I** e **Algoritmos e Lógica de Programação**, criando uma solução tecnológica que será expandida ao longo dos próximos semestres com novas funcionalidades.

## 💻 Tecnologias Utilizadas

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-9.6-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3-C71A36?logo=apachemaven&logoColor=white)](https://maven.apache.org/)

**Stack:**

- **Node.js + Express, HTML5, CSS3, JavaScript** - Tecnologias principais para desenvolvimento do frontend e backend
- **Bootstrap 5, Tailwind CSS** - Frameworks de design para interface moderna e responsiva
- **MySQL 9.6** - Banco de dados relacional
- **Java 21** - Tecnologia para desenvolvimento de microserviços
- **Spring Boot 4** - Framework para construção de APIs RESTful em Java
- **Maven** - Gerenciador de dependências e build do projeto Java

## ✨ Funcionalidades

### 👤 Sistema de Autenticação

- **Cadastro de usuários** com validação de dados (CPF, email, senha)
- **Login seguro** com diferenciação entre aluno e professor
- **Recuperação de senha** via email
- **SessionStorage** para manter sessão ativa durante navegação
- **Proteção de rotas** e redirecionamento automático

### 📚 Catálogo de Professores

- **Busca avançada** por disciplinas e especialidades
- **Filtros por matéria**: Matemática, Programação, Música, Português, Tecnologia, Artes, Geografia, etc.
- **Perfis detalhados** com biografias, avaliações e especializações
- **Sistema de avaliações** com estrelas e comentários de alunos
- **Informações de contato** e valores por hora/aula

### 🎯 Dashboard Personalizado

- **Dashboard do Aluno**: Visualização de sessões agendadas, professores contratados e comunicação
- **Dashboard do Professor**: Gerenciamento de alunos e horários (em desenvolvimento)
- **Comunicação integrada**: Sistema de mensagens e videochamadas
- **Métricas em tempo real**: Estatísticas de uso e progresso

### 🎨 Interface e UX

- **Design responsivo** adaptável a diferentes dispositivos
- **Animações suaves** e transições em CSS
- **Componentes interativos** com feedback visual
- **Navegação intuitiva** com breadcrumbs e estados ativos
- **Paleta de cores profissional** com tons de azul e gradientes

### 🔒 Gerenciamento de Dados

- **LocalStorage** para persistência de dados de usuário
- **SessionStorage** para controle de sessão
- **Validação de formulários** em tempo real com regex
- **Tratamento de erros** e mensagens informativas

## 🚀 Como Executar

Clone o repositório:

```bash
git clone https://github.com/FatecLP/menthfy.git
```

Navegue até o diretório:

```bash
cd menthfy
```

Instale as dependências do Node.js:

```bash
npm install
```

Inicie o servidor Express:

```bash
npm start  # ou node server.js
```

Acesse a aplicação no seu navegador: `http://localhost:3000`

### Comandos úteis

```bash
npm run start:api   # sobe a API Java em services/mentorship-service
npm run start:all   # sobe frontend Node e API Java juntos
npm test            # executa os testes do Node
npm run build       # valida os arquivos principais do Node
```

O frontend consome a mentoria por contrato REST em `/api/mentorships`, e o Node faz o proxy para o microserviço Java. Isso evita acoplamento direto da interface com a URL do serviço.

### Executar com Microserviço Java

**Pré-requisitos:**

- JDK 21 instalado
- MySQL 9.6+ rodando com banco `menthfy_db`
- Variáveis de ambiente definidas para banco, porta e CORS (`DB_URL`, `DB_USER`, `DB_PASS`, `MENTORSHIP_PORT`, `CORS_ALLOWED_ORIGIN`)

## Passo 1: Iniciar a API Java

```bash
cd ./services/mentorship-service
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.10"  # Windows
# Substitua pela sua versão exata do JDK 21

./mvnw spring-boot:run
# A API estará disponível na porta definida por MENTORSHIP_PORT (padrão: http://localhost:8080)
```

## Passo 2: Iniciar o servidor Node.js

```bash
npm start  # ou node server.js
# Frontend em: http://localhost:3000
```

## Integração e CI

O projeto mantém portas distintas por padrão: `3000` para o Node e `8080` para a API Java. A API Java aceita o frontend somente pelo CORS configurado em `CORS_ALLOWED_ORIGIN`, e o Node centraliza o consumo REST da mentoria por meio de proxy.

O CI executa os dois lados separadamente: `npm test` e `npm run build` no frontend, e `./mvnw test package` no microserviço.

**Endpoints disponíveis (Spring Boot):**

- `GET /api/mentorships/student/{studentId}` - Listar mentorias do aluno
- `GET /api/mentorships/teacher/{teacherId}` - Listar mentorias do professor
- `POST /api/mentorships` - Criar nova mentoria
- `PUT /api/mentorships/{id}/accept` - Aceitar mentoria

## 📚 Dependências

Adicionadas via CDN para desenvolvimento ágil:

```html
<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"></script>

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
```

## 🎓 Conceitos Acadêmicos Aplicados

### Design Digital

- **Prototipagem** de interfaces centradas no usuário
- **Design System** com componentes reutilizáveis
- **Design Responsivo** para diferentes dispositivos
- **Acessibilidade** e usabilidade

### Desenvolvimento Web I

- **Desenvolvimento Front-end** com tecnologias modernas
- **Manipulação de DOM** e eventos JavaScript
- **Estrutura de dados** em JSON e localStorage
- **Validação de formulários** e tratamento de erros
- **Arquitetura de componentes** modulares

### Algoritmos e Lógica de Programação

- **Estruturas de controle**
- **Algoritmos de busca** e validação
- **Lógica de programação** aplicada em funcionalidades

## 🔮 Roadmap Futuro

À medida que avançamos nos semestres, novas funcionalidades serão implementadas:

- **Banco de dados não-relacional;**
- **Sistema de pagamentos;**
- **Aplicativo mobile.**

## 📜 Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

**Nota:** Projeto educacional desenvolvido na FATEC Luigi Papaiz como parte do curso de Desenvolvimento de Software Multiplataforma. Este projeto tem potencial comercial e será desenvolvido ao longo do curso.

---

<div align="center">
  <strong>Desenvolvido com 💙 pela equipe Menthfy</strong><br>
  FATEC Luigi Papaiz - Diadema/SP - 2026
</div>
