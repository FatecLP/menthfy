# Configuração do Banco de Dados (MySQL)

Este documento contém as instruções para configurar e utilizar o banco de dados MySQL para o projeto.

## Pré-requisitos

- Ter o **MySQL Server** instalado e rodando em sua máquina local.

## Passo a Passo para Configuração

1. **Configurar as Variáveis de Ambiente:**
   Na raiz do projeto, crie um arquivo chamado `.env` com as seguintes chaves de configuração do seu ambiente MySQL:

   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario_do_mysql
   DB_PASSWORD=sua_senha
   DB_NAME=menthfy_db
   ```

2. **Inicializar o Banco de Dados:**
   Acesse seu console do MySQL e execute em ordem os scripts disponibilizados na pasta `docs/database/`:

   - **Estrutura (Schema):**
     Execute o conteúdo de `docs/database/schema.sql` para criar o banco de dados `menthfy_db` e as tabelas `professores`, `alunos` e `avaliacoes`.

   - **Dados de Teste (Seed):**
     Execute o conteúdo de `docs/database/seed.sql` para inserir os dados de professor, 3 alunos para testes, bem como as 3 avaliações da página.

3. **Instalar Dependências:**
   Caso ainda não tenha feito, rode o comando abaixo na raiz do projeto para garantir a instalação dos pacotes necessários:

   ```bash
   npm install
   ```

4. **Rodar a Aplicação:**
   Inicie o servidor normalmente com:

   ```bash
   npm start
   ```

   Acesse a página do catálogo ou o perfil do Professor Alberto (ex: `http://localhost:3000/alberto`). Se tudo estiver correto, a página será populada com os dados recuperados dinamicamente via `async/await` do MySQL.
