require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const mentorshipApiBaseUrl =
    process.env.MENTORSHIP_API_URL ||
    `http://localhost:${process.env.MENTORSHIP_PORT || 8080}`;

const distPath = path.join(__dirname, 'dist');
const distIndexPath = path.join(distPath, 'index.html');
const devIndexPath = path.join(__dirname, 'index.html');

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

const professorRoutes = require('./src/routes/professorRoutes');
app.use('/api/professores', professorRoutes);

const alunoRoutes = require('./src/routes/alunosRoutes');
app.use('/api/alunos', alunoRoutes);

const db = require('./src/config/db');

app.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [alunos] = await db.query('SELECT * FROM alunos WHERE email = ?', [email]);

        if (alunos.length > 0) {
            const aluno = alunos[0];

            if (aluno.senha !== senha) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            return res.json({
                usuario: {
                    id: aluno.id,
                    nome: aluno.nome,
                    email: aluno.email,
                    tipoUsuario: 'Aluno',
                },
            });
        }

        const [professores] = await db.query('SELECT * FROM professores WHERE email = ?', [email]);

        if (professores.length > 0) {
            const professor = professores[0];

            if (professor.senha !== senha) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            return res.json({
                usuario: {
                    id: professor.id,
                    nome: professor.nome,
                    email: professor.email,
                    tipoUsuario: 'Professor',
                },
            });
        }

        return res.status(401).json({ message: 'Usuário não encontrado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro interno' });
    }
});

async function proxyMentorshipRequest(req, res) {
    const targetUrl = new URL(req.originalUrl, mentorshipApiBaseUrl);
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
        const normalizedKey = key.toLowerCase();

        if (['host', 'connection', 'content-length', 'origin', 'referer'].includes(normalizedKey)) {
            return;
        }

        if (typeof value === 'string') {
            headers.set(key, value);
        }
    });

    const methodAllowsBody = !['GET', 'HEAD'].includes(req.method);
    const body = methodAllowsBody && req.body && Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : undefined;

    if (body && !headers.has('content-type')) {
        headers.set('content-type', 'application/json');
    }

    try {
        const upstreamResponse = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        res.status(upstreamResponse.status);

        upstreamResponse.headers.forEach((value, key) => {
            if (!['connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        });

        const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
        res.send(responseBuffer);
    } catch (error) {
        res.status(502).json({ message: 'Serviço de mentoria indisponível.' });
    }
}

app.all(/^\/api\/mentorships(?:\/.*)?$/, proxyMentorshipRequest);

function sendSpa(req, res) {
    if (fs.existsSync(distIndexPath)) {
        res.sendFile(distIndexPath);
    } else {
        res.sendFile(devIndexPath);
    }
}

app.get([
    '/',
    '/login',
    '/cadastro',
    '/recuperar',
    '/catalogo',
    '/perfil',
    '/contato',
    '/dashboard',
    '/dashboard-professor',
    '/videocall'
], sendSpa);

module.exports = app;