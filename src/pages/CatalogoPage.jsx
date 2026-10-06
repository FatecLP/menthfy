import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchProfessores } from '../services/mentorServices';

const DISCIPLINAS = [
  'Todas',
  'Programação',
  'Português',
  'Excel',
  'Música',
  'Artes',
  'Geografia',
  'Filosofia',
  'Educação Física',
];

export default function CatalogoPage() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState('');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('Todas');
  const [ordenar, setOrdenar] = useState('avaliacao');
  const [ordem, setOrdem] = useState('desc');

  const navigate = useNavigate();

  const loadProfessores = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfessores(filtros);
      setProfessores(data || []);
    } catch (err) {
      console.error('Erro ao buscar a lista de professores:', err);
      setError('Não foi possível carregar o catálogo de professores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtros = {};
    if (busca.trim()) filtros.busca = busca.trim();
    if (disciplinaSelecionada !== 'Todas') filtros.disciplina = disciplinaSelecionada;
    if (ordenar) filtros.ordenar = ordenar;
    if (ordem) filtros.ordem = ordem;

    loadProfessores(filtros);
  }, [disciplinaSelecionada, ordenar, ordem, loadProfessores]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const filtros = {};
    if (busca.trim()) filtros.busca = busca.trim();
    if (disciplinaSelecionada !== 'Todas') filtros.disciplina = disciplinaSelecionada;
    if (ordenar) filtros.ordenar = ordenar;
    if (ordem) filtros.ordem = ordem;

    loadProfessores(filtros);
  }

  function handleClearFilters() {
    setBusca('');
    setDisciplinaSelecionada('Todas');
    setOrdenar('avaliacao');
    setOrdem('desc');
    loadProfessores({});
  }

  const fallbackStar = 'https://cdn-icons-png.flaticon.com/512/10134/10134048.png';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px 0' }}>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search" style={{ maxWidth: '900px', margin: '20px auto', display: 'flex', gap: '10px', padding: '0 20px' }}>
          <input
            id="search-input"
            type="text"
            placeholder="Pesquisar por nome ou disciplina..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ flex: 1, borderRadius: '8px', padding: '12px 16px', border: '1px solid #d1d5db' }}
          />
          <button type="submit" className="search-btn" style={{ padding: '0 24px', cursor: 'pointer' }}>
            Buscar
          </button>
        </form>

        {/* Filters and Sorting Bar */}
        <div style={{ maxWidth: '1000px', margin: '0 auto 24px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          {/* Discipline Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DISCIPLINAS.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setDisciplinaSelecionada(disc)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: disciplinaSelecionada === disc ? '#2563eb' : '#e5e7eb',
                  backgroundColor: disciplinaSelecionada === disc ? '#2563eb' : '#ffffff',
                  color: disciplinaSelecionada === disc ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: disciplinaSelecionada === disc ? '600' : '400',
                  transition: 'all 0.2s',
                }}
              >
                {disc}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="sort-select" style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={`${ordenar}-${ordem}`}
              onChange={(e) => {
                const [newOrdenar, newOrdem] = e.target.value.split('-');
                setOrdenar(newOrdenar);
                setOrdem(newOrdem);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="avaliacao-desc">Melhor avaliados</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
              <option value="tempoResposta-asc">Mais rápidos</option>
              <option value="nome-asc">Nome (A-Z)</option>
            </select>
          </div>
        </div>

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
            {professores.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>Nenhum professor encontrado com os filtros atuais.</p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
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
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
