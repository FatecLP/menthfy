const db = require('../config/db');

exports.getAllProfessores = async (req, res) => {
    try {
        const [professores] = await db.query('SELECT * FROM professores');
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
        
        res.json(professor);
    } catch (error) {
        console.error('Erro ao buscar professor:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
