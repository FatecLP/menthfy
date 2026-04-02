USE menthfy_db;

-- Inserir alunos
INSERT INTO alunos (nome, email) VALUES
('André Diogo', 'andre.diogo@email.com'),
('Jefferson Grande', 'jefferson.grande@email.com'),
('Scott Pilgrim', 'scott.pilgrim@email.com')
ON DUPLICATE KEY UPDATE nome=nome;

-- Inserir professor
INSERT INTO professores (nome, disciplina_principal, descricao, media_avaliacao, quantidade_alunos, tempo_resposta_minutos) 
VALUES (
    'Alberto', 
    'Programação', 
    'Olá! Eu sou o Professor Alberto, especialista em programação e desenvolvimento de software. Tenho mais de 10 anos de experiência ensinando linguagens como JavaScript, Python e C#, além de áreas como algoritmos, estrutura de dados e lógica de programação. Minha missão é ajudar você a entender a base da programação de forma simples, prática e com muitos exemplos do mundo real. Vamos codar juntos e transformar ideias em projetos incríveis!', 
    5.00, 
    100, 
    60
) ON DUPLICATE KEY UPDATE nome=nome;

-- Relacionar IDs
SET @alberto_id = (SELECT id FROM professores WHERE nome = 'Alberto' LIMIT 1);
SET @aluno1_id = (SELECT id FROM alunos WHERE email = 'andre.diogo@email.com' LIMIT 1);
SET @aluno2_id = (SELECT id FROM alunos WHERE email = 'jefferson.grande@email.com' LIMIT 1);
SET @aluno3_id = (SELECT id FROM alunos WHERE email = 'scott.pilgrim@email.com' LIMIT 1);

-- Inserir avaliações
INSERT INTO avaliacoes (professor_id, aluno_id, nota, comentario) VALUES
(@alberto_id, @aluno1_id, 5, 'O Professor Alberto explica os conceitos de programação de um jeito super claro e fácil de entender. Finalmente entendi lógica de verdade!'),
(@alberto_id, @aluno2_id, 5, 'A didática dele é excelente! Cada aula é prática e focada no que realmente importa no mercado.'),
(@alberto_id, @aluno3_id, 5, 'Sempre disponível para tirar dúvidas e ajudar. Um dos melhores professores de programação que já tive!');