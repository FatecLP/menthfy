document.addEventListener('DOMContentLoaded', function () { // espera o DOM carregar
    const teacherData = { // professor
        nome: 'Alberto',
        bio: `Olá! Eu sou o Professor Alberto, especialista em programação e desenvolvimento de software.\nTenho mais de 10 anos de experiência ensinando linguagens como JavaScript, Python e C#, além de áreas como algoritmos, estrutura de dados e lógica de programação.\nMinha missão é ajudar você a entender a base da programação de forma simples, prática e com muitos exemplos do mundo real.\nVamos codar juntos e transformar ideias em projetos incríveis!`,
        tags: ['Programação', 'Desenvolvimento', 'Linguagem de programação'],
        img: 'assets/img/img1.jpg',
        estrelas: 5,
        avaliacoes: 200,
        tempoResposta: '1H',
        alunos: '+100'
    };

    const feedbacks = [ // avaliações
        {
            usuario: 'Usuário1',
            estrelas: 5,
            texto: 'O Professor Alberto explica os conceitos de programação de um jeito super claro e fácil de entender. Finalmente entendi lógica de verdade!'
        },
        {
            usuario: 'Usuário2',
            estrelas: 5,
            texto: 'A didática dele é excelente! Cada aula é prática e focada no que realmente importa no mercado.'
        },
        {
            usuario: 'Usuário3',
            estrelas: 5,
            texto: 'Sempre disponível para tirar dúvidas e ajudar. Um dos melhores professores de programação que já tive!'
        }
    ];

    const briefSection = document.querySelector('.teacher-profile-brief'); // descrição do professor
    if (briefSection) {
        briefSection.innerHTML = `
            <div class="teacher-profile-tags" aria-label="Áreas de atuação">
                <!-- futuro: clicar em uma tag faz busca por outros professores com a mesma tag -->
                ${teacherData.tags.map(tag => `<span class="teacher-profile-tag" tabindex="0">${tag}</span>`).join('')}
            </div>
            <h2 class="teacher-profile-name">${teacherData.nome}</h2>
            <p class="teacher-profile-bio">${teacherData.bio.replace(/\n/g, '<br>')}</p>
        `;
    }

    const cardSection = document.querySelector('.teacher-profile-card'); // card do professor
    if (cardSection) {
        cardSection.innerHTML = `
            <figure>
                <img src="${teacherData.img}" alt="Foto do Professor ${teacherData.nome}" class="teacher-profile-img" loading="lazy">
            </figure>
            <div class="teacher-profile-stars-feedback" aria-label="Avaliação do professor">
                <img src="https://cdn-icons-png.flaticon.com/512/10134/10134048.png" alt="Estrela" class="teacher-profile-star" loading="lazy">
                <h5>${teacherData.estrelas} (${teacherData.avaliacoes} Avaliações)</h5>
            </div>
            <div class="teacher-profile-info-row"><i class="fa-solid fa-clock" aria-hidden="true"></i> Tempo de resposta: <span>1 hora</span></div>
            <div class="teacher-profile-info-row"><i class="fa-solid fa-person" aria-hidden="true"></i> Número de alunos: <span>${teacherData.alunos}</span></div>
            <div class="teacher-profile-contact-container">
                <button class="teacher-profile-contact" type="button"><i class="fa-solid fa-comments" aria-hidden="true"></i> Contatar-me</button>
            </div>
        `;
    }

    const commentsDiv = document.querySelector('.teacher-profile-comments'); // div de comentários
    if (commentsDiv) {
        commentsDiv.innerHTML = feedbacks.map((fb, idx) => `
            <article class="teacher-profile-comment">
                <div class="teacher-profile-student">
                    <div class="teacher-profile-user-id">
                        <img src="https://randomuser.me/api/portraits/men/${idx % 10}.jpg" alt="Avatar do usuário" class="teacher-profile-user-img" />
                        <span>${fb.usuario}</span>
                    </div>
                    <div class="teacher-profile-stars">
                        ${fb.estrelas} <img src="https://cdn-icons-png.flaticon.com/512/10134/10134048.png" alt="Estrela" class="teacher-profile-star" loading="lazy">
                    </div>
                </div>
                <p>${fb.texto}</p>
            </article>
        `).join('');
    }
});
