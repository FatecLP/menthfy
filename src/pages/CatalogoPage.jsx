import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchProfessores } from '../services/mentorServices';

export default function CatalogoPage() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfessores() {
      try {
        const data = await fetchProfessores();
        setProfessores(data);
      } catch (err) {
        console.error('Erro ao buscar a lista de professores:', err);
        setError('Não foi possível carregar o catálogo de professores.');
      } finally {
        setLoading(false);
      }
    }
    loadProfessores();
  }, []);

  const fallbackStar = 'https://cdn-icons-png.flaticon.com/512/10134/10134048.png';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px 0' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#111827', fontSize: '18px' }}>
            Carregando catálogo de professores...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#dc2626', fontSize: '18px' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="catalog" id="catalog-container">
              {professores.map((prof) => {
                const precoFormatado = Number(prof.preco_hora || 50).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                });

                return (
                  <section key={prof.id} className="card-professor" data-id={prof.id}>
                    <div className="teacher-img">
                      <img
                        src={prof.foto_url || '/assets/images/default.webp'}
                        alt={prof.nome}
                        className="img-person"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/default.webp';
                        }}
                      />
                    </div>
                    <div className="prof">
                      <h2>{prof.nome}</h2>
                      <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <img src={fallbackStar} alt="Star" className="star" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {Number(prof.media_avaliacao || 5).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="hours-subject">
                      <p>{prof.disciplina_principal || 'Geral'}</p>
                      <p>{precoFormatado}/h</p>
                    </div>
                    <button
                      className="contact"
                      onClick={() => navigate(`/perfil?id=${prof.id}`)}
                    >
                      Entrar em contato
                    </button>
                  </section>
                );
              })}
            </div>

            <div className="more-teachers">
              <button className="more-teachers-btn">
                Mostrar mais professores <img src="/assets/icons/arrow.png" alt="" className="down-arrow" />
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
