document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/professores');
        if (!response.ok) {
            throw new Error('Erro ao buscar a lista de professores');
        }
        
        const professores = await response.json();
        const catalogContainer = document.getElementById('catalog-container');
        
        if (catalogContainer) {
            catalogContainer.innerHTML = '';
            
            professores.forEach(prof => {
                // formatar preço para BRL
                const precoFormatado = Number(prof.preco_hora).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const fallbackStar = 'https://cdn-icons-png.flaticon.com/512/10134/10134048.png';

                const cardHTML = `
                    <section class="card-professor" data-id="${prof.id}">
                        <div class="teacher-img">
                            <img src="${prof.foto_url}" alt="${prof.nome}" class="img-person" onerror="this.src='/public/assets/images/img1.jpg'" />
                        </div>
                        <div class="prof">
                            <h2>${prof.nome}</h2>
                            <div class="rating-stars" style="display:flex; align-items:center; gap:5px;">
                                <img src="${fallbackStar}" alt="Star" class="star" />
                            </div>
                        </div>
                        <div class="hours-subject">
                            <p>${prof.disciplina_principal}</p>
                            <p>${precoFormatado}/h</p>
                        </div>
                        <button class="contact" onclick="window.location.href='/perfil?id=${prof.id}'">Entrar em contato</button>
                    </section>
                `;

                catalogContainer.insertAdjacentHTML('beforeend', cardHTML);
            });

            let cards = document.querySelectorAll('.card-professor');
            for (let i = 0; i < cards.length; i++) {
                cards[i].addEventListener('mouseout', function animation() {
                    this.classList.add('classAnimation');
                });
            }
        }
    } catch (error) {
        console.error('Erro ao renderizar o catálogo:', error);
    }
});
