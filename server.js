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

app.get('/alberto', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'catalog', 'Alberto.html'));
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

app.post('/usuarios/login', (req, res) => {
    const { email, senha } = req.body; 

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) {
        return res.status(401).json({ error: true, message: "Credenciais inválidas" });
    }

    res.status(200).json({ 
        success: true, 
        usuario: {
            nome: usuario.nome,
            email: usuario.email,
            tipoUsuario: usuario.tipoUsuario
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
