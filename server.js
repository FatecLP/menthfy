require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// autenticação
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'auth', 'login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'auth', 'cadastro.html'));
});

app.get('/recuperar', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'auth', 'recuperar.html'));
});

// catálogo
app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'catalog', 'catalogo.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'catalog', 'perfil.html'));
});

// contato
app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contato.html'));
});

// dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'dashboard', 'dashboard-aluno.html'));
});

app.get('/dashboard-professor', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'dashboard', 'dashboard-professor.html'));
});

// videochamada
app.get('/videocall', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'videocall.html'));
});

// rotas de API
const professorRoutes = require('./src/routes/professorRoutes');
app.use('/api/professores', professorRoutes);

const alunoRoutes = require("./src/routes/alunosRoutes");

app.use("/api/alunos", alunoRoutes);

// API mock
const usuarios = [
    { id: 1, nome: "Professor Teste", cpf: 12345678901, email: "prof@teste.com", senha: "123", tipoUsuario: "Professor" },
    { id: 2, nome: "Aluno Teste", cpf: 10987654321, email: "aluno@teste.com", senha: "123", tipoUsuario: "Aluno" }
];

app.post('/usuarios', (req, res) => {
    const { nome, cpf, email, senha, tipoUsuario } = req.body;

    if (usuarios.some(u => u.email === email)) {
        return res.status(400).json({ error: true, message: "E-mail já cadastrado" });
    }

    if (usuarios.some(u => u.cpf === cpf)) {
        return res.status(400).json({ error: true, message: "CPF já cadastrado" });
    }

    const novoUsuario = { id: Date.now(), nome, cpf, email, senha, tipoUsuario };
    usuarios.push(novoUsuario);

    res.status(201).json(novoUsuario);
});

const db = require("./src/config/db");

app.post("/usuarios/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const db = require("./src/config/db");

        // procura aluno
        const [alunos] = await db.query(
            "SELECT * FROM alunos WHERE email = ?",
            [email],
        );

        if (alunos.length > 0) {
            const aluno = alunos[0];

            if (aluno.senha !== senha) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            return res.json({
                usuario: {
                    id: aluno.id,
                    nome: aluno.nome,
                    email: aluno.email,
                    tipoUsuario: "Aluno",
                },
            });
        }

        // procura professor
        const [professores] = await db.query(
            "SELECT * FROM professores WHERE email = ?",
            [email],
        );

        if (professores.length > 0) {
            const professor = professores[0];

            if (professor.senha !== senha) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            return res.json({
                usuario: {
                    id: professor.id,
                    nome: professor.nome,
                    email: professor.email,
                    tipoUsuario: "Professor",
                },
            });
        }

        return res.status(401).json({
            message: "Usuário não encontrado",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro interno" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
