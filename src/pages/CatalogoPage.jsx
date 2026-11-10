import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Code2,
  BookOpen,
  BarChart3,
  Music,
  Palette,
  Globe2,
  Compass,
  Activity,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProfessores } from '../services/mentorServices';

const DISCIPLINAS = [
  { name: 'Todas', icon: null },
  { name: 'Programação', icon: Code2 },
  { name: 'Português', icon: BookOpen },
  { name: 'Excel', icon: BarChart3 },
  { name: 'Música', icon: Music },
  { name: 'Artes', icon: Palette },
  { name: 'Geografia', icon: Globe2 },
  { name: 'Filosofia', icon: Compass },
  { name: 'Educação Física', icon: Activity },
];

/**
 * Modern, high-performance Teacher / Mentor Catalog page.
 * Features URL synchronization, fast category filtering, real-time search, and responsive cards.
 */
export default function CatalogoPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL params
  const paramBusca = searchParams.get('busca') || '';
  const paramDisciplina = searchParams.get('disciplina') || 'Todas';
  const paramOrdenar = searchParams.get('ordenar') || 'avaliacao';
  const paramOrdem = searchParams.get('ordem') || 'desc';

  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState(paramBusca);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(paramDisciplina);
  const [ordenar, setOrdenar] = useState(paramOrdenar);
  const [ordem, setOrdem] = useState(paramOrdem);

  // Synchronize state when URL params change externally (e.g. browser back/forward or navigation from Hero)
  useEffect(() => {
    const urlBusca = searchParams.get('busca') || '';
    const urlDisciplina = searchParams.get('disciplina') || 'Todas';
    const urlOrdenar = searchParams.get('ordenar') || 'avaliacao';
    const urlOrdem = searchParams.get('ordem') || 'desc';

    setBusca(urlBusca);
    setDisciplinaSelecionada(urlDisciplina);
    setOrdenar(urlOrdenar);
    setOrdem(urlOrdem);
  }, [searchParams]);

  const loadProfessores = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfessores(filtros);
      setProfessores(data || []);
    } catch (err) {
      console.error('Erro ao buscar a lista de professores:', err);
      setError('Não foi possível carregar o catálogo de professores. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch teachers whenever filters change and sync URL
  useEffect(() => {
    const filtros = {};
    const newParams = {};

    if (busca.trim()) {
      filtros.busca = busca.trim();
      newParams.busca = busca.trim();
    }
    if (disciplinaSelecionada && disciplinaSelecionada !== 'Todas') {
      filtros.disciplina = disciplinaSelecionada;
      newParams.disciplina = disciplinaSelecionada;
    }
    if (ordenar) {
      filtros.ordenar = ordenar;
      newParams.ordenar = ordenar;
    }
    if (ordem) {
      filtros.ordem = ordem;
      newParams.ordem = ordem;
    }

    setSearchParams(newParams, { replace: true });
    loadProfessores(filtros);
  }, [disciplinaSelecionada, ordenar, ordem, busca, loadProfessores, setSearchParams]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const filtros = {};
    if (busca.trim()) filtros.busca = busca.trim();
    if (disciplinaSelecionada !== 'Todas') filtros.disciplina = disciplinaSelecionada;
    if (ordenar) filtros.ordenar = ordenar;
    if (ordem) filtros.ordem = ordem;

    loadProfessores(filtros);
  }

  function handleSelectDisciplina(disciplinaName) {
    setDisciplinaSelecionada(disciplinaName);
  }

  function handleClearFilters() {
    setBusca('');
    setDisciplinaSelecionada('Todas');
    setOrdenar('avaliacao');
    setOrdem('desc');
    setSearchParams({}, { replace: true });
    loadProfessores({});
  }

  const hasActiveFilters = Boolean(busca.trim() || (disciplinaSelecionada && disciplinaSelecionada !== 'Todas'));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-[#111418] font-['Inter',sans-serif]">
      <Header />

      {/* Top Banner / Hero Header */}
      <section className="bg-gradient-to-b from-[#F4F6FB] via-white to-slate-50/50 py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3.5 py-1.5 rounded-full border border-[#5F688F]/20 inline-block">
            Catálogo de Professores
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Aprenda com quem é referência
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Encontre o mentor ideal para tirar dúvidas práticas, evoluir nos seus estudos ou acelerar sua carreira com atenção 100% individual.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xs border border-gray-200 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition p-1.5">
            <Search className="size-5 text-gray-400 ml-3 shrink-0" />
            <input
              id="search-input"
              type="text"
              placeholder="Pesquisar por nome ou disciplina..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base text-gray-800 bg-transparent border-0 outline-hidden focus:ring-0 placeholder-gray-400"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition mr-1 bg-transparent border-0 cursor-pointer"
                title="Limpar texto"
              >
                <X className="size-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#5F688F] hover:bg-[#4d5577] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-xs"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Filter Pills & Sorting Bar */}
        <div className="space-y-4">
          {/* Discipline Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DISCIPLINAS.map((disc) => {
              const Icon = disc.icon;
              const isSelected = disciplinaSelecionada === disc.name;
              return (
                <button
                  key={disc.name}
                  type="button"
                  onClick={() => handleSelectDisciplina(disc.name)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#5F688F] text-white border-[#5F688F] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="size-3.5" />}
                  <span>{disc.name}</span>
                </button>
              );
            })}
          </div>

          {/* Results Counter and Sort Select */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-200/80 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">
                {loading ? (
                  <LoadingSpinner variant="inline" size="sm" label="Buscando mentores..." />
                ) : (
                  <>
                    Mostrando <strong className="text-gray-900 font-bold">{professores.length}</strong> {professores.length === 1 ? 'mentor disponível' : 'mentores disponíveis'}
                    {disciplinaSelecionada !== 'Todas' && (
                      <span> em <strong className="text-[#5F688F] font-bold">{disciplinaSelecionada}</strong></span>
                    )}
                  </>
                )}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-xs text-[#5F688F] hover:text-[#4d5577] font-semibold bg-transparent border-0 cursor-pointer p-0"
                >
                  <RotateCcw className="size-3" />
                  <span>Limpar filtros</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <SlidersHorizontal className="size-3.5 text-gray-400" />
              <label htmlFor="sort-select" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ordenar:
              </label>
              <div className="relative inline-flex items-center">
                <select
                  id="sort-select"
                  value={`${ordenar}-${ordem}`}
                  onChange={(e) => {
                    const [newOrdenar, newOrdem] = e.target.value.split('-');
                    setOrdenar(newOrdenar);
                    setOrdem(newOrdem);
                  }}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2 outline-none focus:border-[#5F688F] focus:ring-1 focus:ring-[#5F688F] transition cursor-pointer shadow-2xs"
                >
                  <option value="avaliacao-desc">Melhor avaliados</option>
                  <option value="preco-asc">Menor preço</option>
                  <option value="preco-desc">Maior preço</option>
                  <option value="tempoResposta-asc">Mais rápidos</option>
                  <option value="nome-asc">Nome (A-Z)</option>
                </select>
                <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Skeleton State */}
        {loading && (
          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <LoadingSpinner
                variant="inline"
                size="sm"
                label="Carregando catálogo de professores..."
                className="bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-xs text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3 max-w-xl mx-auto my-8">
            <p className="font-semibold text-sm">{error}</p>
            <button
              type="button"
              onClick={() => loadProfessores({ disciplina: disciplinaSelecionada, ordenar, ordem, busca })}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer border-0"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Teacher Cards Grid */}
        {!loading && !error && (
          <>
            {professores.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
                <div className="size-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <Search className="size-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nenhum mentor encontrado</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Não encontramos nenhum professor com os critérios pesquisados. Tente usar termos mais amplos ou redefinir os filtros.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-[#5F688F] hover:bg-[#4d5577] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-xs"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {professores.map((prof) => {
                  const precoFormatado = Number(prof.preco_hora || 50).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  });

                  return (
                    <div
                      key={prof.id}
                      className="interactive-card bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Top Card Header */}
                        <div className="flex items-start gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={prof.foto_url || '/assets/images/default.webp'}
                              alt={prof.nome}
                              className="size-16 rounded-2xl object-cover border-2 border-gray-100 shadow-xs group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/images/default.webp';
                              }}
                            />
                            <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Disponível" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-base text-gray-900 truncate group-hover:text-[#5F688F] transition-colors">
                                {prof.nome}
                              </h3>
                              <ShieldCheck className="size-4 text-blue-600 shrink-0" title="Mentor Verificado" />
                            </div>
                            <span className="inline-block bg-[#5F688F]/10 text-[#5F688F] text-xs font-semibold px-2.5 py-0.5 rounded-md mt-0.5">
                              {prof.disciplina_principal || 'Geral'}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              <span>{Number(prof.media_avaliacao || 5).toFixed(1)}</span>
                              <span className="text-gray-400 font-normal">({prof.quantidade_alunos || 0} alunos)</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio / Description */}
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed min-h-[48px]">
                          {prof.descricao || 'Professor particular experiente, focado em metodologias ativas e resolução de dúvidas práticas.'}
                        </p>

                        {/* Response Time & Price */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="size-3.5" />
                            <span>Responde em ~{prof.tempo_resposta_minutos || 15} min</span>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-bold text-gray-900">{precoFormatado}</span>
                            <span className="text-gray-400 text-[11px]">/h</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-5">
                        <button
                          type="button"
                          onClick={() => navigate(`/perfil?id=${prof.id}`)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] text-white py-2.5 rounded-xl font-semibold text-xs transition duration-200 shadow-xs group-hover:shadow border-0 cursor-pointer"
                        >
                          <span>Ver Perfil & Agendar</span>
                          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
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
