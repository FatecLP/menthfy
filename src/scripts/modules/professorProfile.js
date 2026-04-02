document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/professores/nome/Alberto');
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do professor');
        }
        const professor = await response.json();

        document.querySelector('.teacher-name').textContent = professor.nome;
        document.querySelector('.bio-text').textContent = professor.descricao;
        
        // contar do array enquanto não temos o total de avaliações no banco
        const totalAvaliacoes = professor.avaliacoes.length;
        document.querySelector('.bio-stars-feedback h5').textContent = 
            `${Number(professor.media_avaliacao)} (${totalAvaliacoes} Avaliações)`;
        
        const infoParas = document.querySelectorAll('.bio-card p');
        if(infoParas.length >= 2) {
            infoParas[0].textContent = `${professor.tempo_resposta_minutos}min`;
            infoParas[1].textContent = `+${professor.quantidade_alunos}`;
        }

        // feedbacks
        const commentsContainer = document.querySelector('.comments');
        if (commentsContainer && professor.avaliacoes && professor.avaliacoes.length > 0) {
            commentsContainer.innerHTML = '';
            
            professor.avaliacoes.forEach(av => {
                const commentHTML = `
                    <section class="comment">
                        <div class="student">
                            <div class="user-id">
                                <svg class="round-representation" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
                                    <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="#9CA3AF"/>
                                    <path d="M20 22C14.4771 22 10 26.4771 10 32V34C10 35.1046 10.8954 36 12 36H28C29.1046 36 30 35.1046 30 34V32C30 26.4771 25.5229 22 20 22Z" fill="#9CA3AF"/>
                                </svg>
                                <span>${av.aluno_nome}</span>
                            </div>
                            <div class="stars">
                                ${av.nota} <img src="https://cdn-icons-png.flaticon.com/512/10134/10134048.png" alt="" class="star">
                            </div>
                        </div>
                        <p>${av.comentario}</p>
                    </section>
                `;
                commentsContainer.insertAdjacentHTML('beforeend', commentHTML);
            });
        }

    } catch (error) {
        console.error('Erro:', error);
    }
});
