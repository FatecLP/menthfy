# Menthfy - README

[![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)]()
[![GitHub last commit](https://img.shields.io/github/last-commit/FatecLP/Menthfy)]()

## 👥 Nomes dos Integrantes
- André Diogo Melchior da Silva
- Juan Pablo Firmino Ferreira
- Michael Akira de Lima Kuwahara
- Murilo de Oliveira Sartori
- Nickolas Lopes Araújo
- Vinicius Lima Carneiro
- Vitor de Almeida Bernardo

## 👨🏻‍🏫 Professores
- **PhD - Bruno Zolotareff dos Santos** (Desenvolvimento Web I: FATEC Diadema - Luigi Papaiz)
- **PhD - Patrícia Gallo de França** (Design Digital: FATEC Diadema - Luigi Papaiz)
- **MSc - Lucio Nunes de Lira** (Algoritmos e Lógica de Programação: FATEC Diadema - Luigi Papaiz)

## 📝 Descrição do Projeto

**Menthfy** é uma plataforma educacional inovadora que conecta alunos e professores em um ambiente digital moderno e intuitivo. O sistema oferece uma experiência completa de ensino personalizado, permitindo que estudantes encontrem o mentor ideal para suas necessidades acadêmicas.

A plataforma aplica conceitos abordados nas matérias de **Design Digital**, **Desenvolvimento Web I** e **Algoritmos e Lógica de Programação**, criando uma solução tecnológica que será expandida ao longo dos próximos semestres com novas funcionalidades. <br><br>

## 💻 Tecnologias Utilizadas

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square)]()
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)]()
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?logo=font-awesome&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)]()

- **HTML5** - Estruturação semântica e acessível do conteúdo
- **CSS3** - Estilização avançada com layouts responsivos e animações
- **JavaScript** - Interatividade dinâmica e manipulação de dados locais
- **Bootstrap 5** - Framework para componentes responsivos e design system
- **Tailwind CSS** - Utilitários CSS para prototipagem rápida
- **Font Awesome 6** - Biblioteca completa de ícones
- **Google Fonts** - Tipografia moderna com Baumans, Inter e Lexend

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
git clone https://github.com/FatecLP/Menthfy.git
```

Navegue até o diretório:
```bash
cd Menthfy
```

Abra o arquivo `index.html` no navegador ou use um servidor local:
```bash
# Com Python
python -m http.server 8000

# Com Node.js (live-server)
npx live-server

# Com PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## 📚 Dependências

Adicionadas via CDN para desenvolvimento ágil:

```html
<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Baumans&family=Inter:wght@100..900&family=Lexend:wght@400;500;700;900&display=swap" rel="stylesheet">
```

## 🎓 Conceitos Acadêmicos Aplicados

### Design Digital
- **Prototipagem** de interfaces centradas no usuário
- **Design System** com componentes reutilizáveis
- **Design Responsivo** para diferentes dispositivos
- **Acessibilidade** e usabilidade

### Desenvolvimento Web I
- **Desenvolvimento Front-end** com tecnologias modernas
- **Manipulação do DOM** e eventos JavaScript
- **Estrutura de dados** em JSON e localStorage
- **Validação de formulários** e tratamento de erros
- **Arquitetura de componentes** modulares

### Algoritmos e Lógica de Programação
- **Estruturas de controle**
- **Algoritmos de busca** e validação
- **Lógica de programação** aplicada em funcionalidades

## 🔮 Roadmap Futuro

À medida que avançamos nos semestres, novas funcionalidades serão implementadas:

- **Banco de Dados;**
- **Back-end;**
- **Sistema de Pagamentos;**
- **Aplicativo Mobile.**

## 📜 Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

**Nota:** Projeto educacional desenvolvido na FATEC Luigi Papaiz como parte do curso de Desenvolvimento de Software Multiplataforma. Este projeto tem potencial comercial e será desenvolvido ao longo do curso.

---

<div align="center">
  <strong>Desenvolvido com 💙 pela equipe Menthfy</strong><br>
  FATEC Luigi Papaiz - Diadema/SP - 2025
</div>