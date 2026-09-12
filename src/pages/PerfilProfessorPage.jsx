import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestMentorship } from '../services/mentorshipServices';
import { fetchProfessorById } from '../services/mentorServices';
import { getStoredUser } from '../utils/auth';

export default function PerfilProfessorPage() {
  const [searchParams] = useSearchParams();
  const professorId = searchParams.get('id');
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!professorId) {
      Swal.fire({
        icon: 'error',
        title: 'Professor não encontrado',
        text: 'ID do professor não foi informado.',
        confirmButtonText: 'Ir para catálogo',
      }).then(() => navigate('/catalogo'));
      return;
    }

    async function loadProfessor() {
      try {
        const data = await fetchProfessorById(professorId);
        setProfessor(data);
      } catch (err) {
        console.error('Erro ao buscar professor:', err);
        Swal.fire({
          icon: 'error',
          title: 'Professor não encontrado',
          text: 'Não foi possível localizar este professor.',
          confirmButtonText: 'Ir para catálogo',
        }).then(() => navigate('/catalogo'));
      } finally {
        setLoading(false);
      }
    }

    loadProfessor();
  }, [professorId, navigate]);

  async function handleSolicitarMentoria() {
    const user = getStoredUser();

    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Faça login primeiro',
        text: 'Para solicitar uma mentoria, faça login na plataforma.',
        confirmButtonText: 'Fazer login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    if (user.tipoUsuario?.toLowerCase() !== 'aluno') {
      Swal.fire({
        icon: 'warning',
        title: 'Apenas alunos podem solicitar mentorias.',
      });
      return;
    }

    setRequesting(true);

    try {
      await requestMentorship(user.id, professorId);
      Swal.fire({
        icon: 'success',
        title: 'Solicitação enviada!',
        text: 'Sua solicitação de mentoria foi enviada com sucesso ao professor.',
      });
    } catch (err) {
      Swal.fire({
        icon: 'warning',
        title: err.message || 'Erro ao solicitar mentoria.',
      });
    } finally {
      setRequesting(false);
    }
  }

  const starIcon = 'https://cdn-icons-png.flaticon.com/512/10134/10134048.png';

  const totalAvaliacoes = professor?.avaliacoes ? professor.avaliacoes.length : 0;
  const mediaCalculada = totalAvaliacoes > 0
    ? (professor.avaliacoes.reduce((acc, curr) => acc + Number(curr.nota), 0) / totalAvaliacoes).toFixed(1)
    : Number(professor?.media_avaliacao || 5).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="bio" style={{ flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', width: '100%', color: '#111827' }}>
            Carregando perfil do professor...
          </div>
        ) : professor ? (
          <>
            <div className="brief-presentation">
              <h2 className="teacher-name">{professor.nome}</h2>
              <section className="bio-text">{professor.descricao || 'Sem descrição informada.'}</section>
              <div className="tags">
                <div className="tag-component">{professor.disciplina_principal || 'Geral'}</div>
              </div>
            </div>

            <section className="bio-card">
              <div className="teacher">
                <img
                  src={professor.foto_url || '/assets/images/img1.jpg'}
                  alt={`${professor.nome} - foto do professor`}
                  className="bio-teacher-img"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/default.webp';
                  }}
                />
              </div>
              <div className="bio-stars-feedback">
                <img src={starIcon} alt="Estrela" className="star" />
                <h5>
                  {mediaCalculada} ({totalAvaliacoes} Avaliações)
                </h5>
              </div>
              <h3>
                Tempo de resposta <i className="fa-solid fa-clock"></i>
              </h3>
              <p>{professor.tempo_resposta_minutos ? `${professor.tempo_resposta_minutos}min` : '15min'}</p>
              <h3>
                Número de alunos <i className="fa-solid fa-person"></i>
              </h3>
              <p>+{professor.quantidade_alunos || 0}</p>
              <div className="contact-me-container">
                <button className="contact" onClick={handleSolicitarMentoria} disabled={requesting}>
                  <i className="fa-solid fa-comments"></i> {requesting ? 'Solicitando...' : 'Solicitar mentoria'}
                </button>
              </div>
            </section>
          </>
        ) : null}
      </main>

      {professor && (
        <section className="feedbacks">
          <h2 className="feedback">Avaliações</h2>
          <div className="comments">
            {professor.avaliacoes && professor.avaliacoes.length > 0 ? (
              professor.avaliacoes.map((av, idx) => (
                <section key={av.id || idx} className="comment">
                  <div className="student">
                    <div className="user-id">
                      <svg
                        className="round-representation"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="20" cy="20" r="20" fill="#E5E7EB" />
                        <path
                          d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z"
                          fill="#9CA3AF"
                        />
                        <path
                          d="M20 22C14.4771 22 10 26.4771 10 32V34C10 35.1046 10.8954 36 12 36H28C29.1046 36 30 35.1046 30 34V32C30 26.4771 25.5229 22 20 22Z"
                          fill="#9CA3AF"
                        />
                      </svg>
                      <span>{av.aluno_nome || 'Aluno'}</span>
                    </div>
                    <div className="stars">
                      {av.nota} <img src={starIcon} alt="" className="star" />
                    </div>
                  </div>
                  <p>{av.comentario}</p>
                </section>
              ))
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Nenhuma avaliação ainda.</p>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
