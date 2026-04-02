USE menthfy_db;

-- Inserindo alunos
INSERT INTO alunos (nome, email) VALUES 
('João Silva', 'joao.silva@email.com'),
('Maria Oliveira', 'maria.oliveira@email.com'),
('Pedro Souza', 'pedro.souza@email.com'),
('Ana Clara', 'ana.clara@email.com'),
('Lucas Mendes', 'lucas.mendes@email.com');

-- Inserindo os professores
INSERT INTO professores (nome, disciplina_principal, descricao, media_avaliacao, quantidade_alunos, tempo_resposta_minutos, preco_hora, foto_url) VALUES 
('Alberto', 'Programação', 'Especialista em desenvolvimento web completo, abrangendo front-end (HTML, CSS, JS, React) e back-end (Node.js, bancos de dados). Ajudo alunos a construírem suas primeiras aplicações do zero, focando nas melhores práticas de Clean Code e arquitetura MVC.', 4.90, 120, 15, 50.00, '/public/assets/images/img1.jpg'),
('Bernardo', 'Português', 'Professor licenciado em Letras com mais de 10 anos de experiência preparando alunos para vestibulares, ENEM e concursos públicos. Minhas aulas focam na interpretação de textos, gramática aplicada e elaboração de redações nota 1000 de forma prática e descomplicada.', 4.80, 200, 30, 70.00, '/public/assets/images/img2.jpg'),
('Carla', 'Excel', 'Analista de Dados e expert em planilhas! Ensino Excel do básico ao avançado: PROCV, Tabela Dinâmica, Dashboards interativos e gravação de Macros/VBA. Torne-se imprescindível na sua empresa automatizando tarefas chatas do dia a dia.', 5.00, 350, 10, 80.00, '/public/assets/images/img3.jpg'),
('Fabiana', 'Música', 'Violonista, pianista e cantora apaixonada por ensinar. As aulas de música são sempre focadas no seu ritmo e no seu estilo preferido. Ajudo desde a primeira nota até arranjos complexos de teoria musical e harmonia. Vamos tocar juntos!', 4.70, 80, 45, 60.00, '/public/assets/images/img4.jpg'),
('Eduardo', 'Artes', 'Artista plástico e digital. Ensino desde desenho tradicional, pintura a óleo e aquarela até manipulação de imagens e pintura digital no Photoshop/Illustrator. Desenvolva seu lado criativo entendendo formas, cores, luz e sombra.', 4.60, 45, 60, 90.00, '/public/assets/images/img5.jpg'),
('Otávio', 'Geografia', 'Professor de Geografia experiente focado em geopolítica, geografia física e atualidades. Uso mapas dinâmicos e muita discussão de casos práticos mundiais para facilitar a compreensão, em vez de decorar estados e capitais de forma maçante.', 4.85, 110, 20, 50.00, '/public/assets/images/img6.jpg'),
('Karina', 'Programação', 'Desenvolvedora Full Stack Sênior com forte atuação em Python, Django e análise de dados. Ensino a programar criando projetos reais e focando no desenvolvimento e lógica de programação antes de pular para frameworks. Aprenda a pensar como um dev!', 4.95, 150, 25, 50.00, '/public/assets/images/img7.jpg'),
('Edson', 'Educação Física', 'Personal trainer focado na saúde integrativa e performance esportiva. Dou consultorias online sobre rotinas de exercícios, alongamentos, postura em home office e condicionamento físico para iniciantes.', 4.75, 230, 40, 50.00, '/public/assets/images/img8.jpg'),
('Renato', 'Filosofia', 'Mestre em Filosofia Contemporânea, ajudo alunos do Ensino Médio a compreender de maneira profunda e acessível conceitos dos grandes pensadores clássicos e modernos. Minhas aulas instigam o debate e o senso crítico essencial.', 4.80, 95, 30, 80.00, 'https://img.cdndsgni.com/preview/12161359.jpg');

-- Avaliações 
INSERT INTO avaliacoes (professor_id, aluno_id, nota, comentario) VALUES 
(1, 1, 5, 'A didática do Alberto é fantástica! Consegui entender Node.js perfeitamente.'),
(1, 3, 5, 'Melhor professor de programação. Me ajudou no meu TCC com React.'),
(2, 2, 5, 'Minha nota da redação do ENEM subiu de 600 para 920 em poucos meses graças ao Bernardo.'),
(2, 4, 4, 'Muito atencioso, tira todas as minhas dúvidas de sintaxe e gramática rapidamente.'),
(3, 5, 5, 'Finalmente entendi como fazer um PROCV e Tabela Dinâmica sem sofrer. As aulas da Carla são ouro puro!'),
(3, 1, 5, 'As planilhas do meu trabalho agora são totalmente automatizadas gracias à professora.'),
(3, 2, 5, 'Objetiva e resolveu meu problema de dashboard super rápido.'),
(4, 3, 5, 'Aprendi minha primeira música inteira no violão na terceira aula! Muito paciente.'),
(4, 4, 4, 'Ótimo conhecimento sobre teoria musical. Gosto do ritmo das aulas.'),
(5, 5, 5, 'Minhas noções de luz e sombra no desenho digital melhoraram 100%. Eduardo manja muito de arte.'),
(5, 1, 4, 'Ótimas dicas de materiais e referências visuais!'),
(6, 2, 5, 'As aulas parecem conversas agradáveis, entendi tudo sobre o conflito no Oriente Médio sem precisar ler calhamaços de matérias chatas.'),
(6, 3, 5, 'Excelente para revisões do vestibular.'),
(7, 4, 5, 'Python ficou muito mais fácil depois que tive aulas com a Karina. Ela é uma pessoa sensacional.'),
(7, 5, 5, 'Aproveitei muito o projeto de Django que construímos juntos.'),
(8, 1, 5, 'A consultoria foi excelente para ajustar minha postura no home office, e a série de exercícios é ótima.'),
(8, 2, 4, 'Muito atencioso, avaliou meus objetivos e montou um roteiro super realista.'),
(9, 3, 5, 'Renato me fez gostar de ler Platão e Kant. Discute temas hiper reflexivos de maneira muito didática, ótima abordagem!'),
(9, 4, 5, 'Aulas super agregadoras, tanto academicamente quanto para a vida.');
