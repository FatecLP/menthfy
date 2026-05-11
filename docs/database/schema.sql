CREATE DATABASE IF NOT EXISTS menthfy_db;
USE menthfy_db;
DROP DATABASE menthfy_db;
CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    disciplina_principal VARCHAR(255) NOT NULL,
    descricao TEXT,
    media_avaliacao DECIMAL(3, 2) DEFAULT 0.00,
    quantidade_alunos INT DEFAULT 0,
    tempo_resposta_minutos INT DEFAULT 60,
    preco_hora DECIMAL(10,2) DEFAULT 50.00,
    foto_url VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    aluno_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

CREATE TABLE mentorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    professor_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mentorships (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   student_id BIGINT,
   teacher_id BIGINT,
   status VARCHAR(30)
);


select * from alunos;

ALTER TABLE alunos ADD senha VARCHAR(255);
ALTER TABLE professores ADD senha VARCHAR(255);
