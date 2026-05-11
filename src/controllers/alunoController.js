const db = require("../config/db");

exports.createAluno = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const [result] = await db.query(
            "INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, senha],
        );

        res.status(201).json({
            id: result.insertId,
            nome,
            email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao cadastrar aluno",
        });
    }
};
