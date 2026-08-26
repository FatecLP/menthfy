const db = require('../config/db');

exports.getAllProfessores = async (req, res) => {
    try {
        const [professores] = await db.query(`
            SELECT 
                p.id,
                p.nome,
                p.disciplina_principal,
                p.descricao,
                p.quantidade_alunos,
                p.tempo_resposta_minutos,
                p.preco_hora,
                p.foto_url,
                p.email,
                COALESCE(ROUND(AVG(a.nota), 1), p.media_avaliacao) as media_avaliacao,
                COUNT(a.id) as total_avaliacoes
            FROM professores p
            LEFT JOIN avaliacoes a ON p.id = a.professor_id
            GROUP BY p.id, p.nome, p.disciplina_principal, p.descricao, p.quantidade_alunos, p.tempo_resposta_minutos, p.preco_hora, p.foto_url, p.email, p.media_avaliacao
        `);
        res.json(professores);
    } catch (error) {
        console.error('Erro ao buscar professores:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.getProfessorById = async (req, res) => {
    const { id } = req.params;
    try {
        const [professores] = await db.query('SELECT * FROM professores WHERE id = ?', [id]);
        if (professores.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        
        const professor = professores[0];
        const [avaliacoes] = await db.query(`
            SELECT a.*, al.nome as aluno_nome 
            FROM avaliacoes a 
            JOIN alunos al ON a.aluno_id = al.id 
            WHERE a.professor_id = ?
            ORDER BY a.data_avaliacao DESC
        `, [id]);

        professor.avaliacoes = avaliacoes;
        if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce((acc, curr) => acc + Number(curr.nota), 0);
            professor.media_avaliacao = Number((soma / avaliacoes.length).toFixed(1));
        }
        
        res.json(professor);
    } catch (error) {
        console.error('Erro ao buscar professor:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.getProfessorByName = async (req, res) => {
    const { nome } = req.params;
    try {
        const [professores] = await db.query('SELECT * FROM professores WHERE nome = ?', [nome]);
        if (professores.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        
        const professor = professores[0];
        const [avaliacoes] = await db.query(`
            SELECT a.*, al.nome as aluno_nome 
            FROM avaliacoes a 
            JOIN alunos al ON a.aluno_id = al.id 
            WHERE a.professor_id = ?
            ORDER BY a.data_avaliacao DESC
        `, [professor.id]);

        professor.avaliacoes = avaliacoes;
        if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce((acc, curr) => acc + Number(curr.nota), 0);
            professor.media_avaliacao = Number((soma / avaliacoes.length).toFixed(1));
        }
        
        res.json(professor);
    } catch (error) {
        console.error('Erro ao buscar professor:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

exports.createProfessor = async (req, res) => {
    const { nome, email, senha } = req.body;

    const fotoPadrao = "/public/assets/images/default.webp";

    try {
        const [result] = await db.query(
            `
            INSERT INTO professores
            (
                nome,
                email,
                senha,
                disciplina_principal,
                descricao,
                preco_hora,
                foto_url
            )
            VALUES (?, ?, ?, 'Geral', '', 50.00, ?)
            `,
            [nome, email, senha, fotoPadrao],
        );

        res.status(201).json({
            id: result.insertId,
            nome,
            email,
            foto_url: fotoPadrao,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erro ao cadastrar professor",
        });
    }
};