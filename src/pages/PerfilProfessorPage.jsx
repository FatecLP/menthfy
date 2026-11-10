import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Laptop,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestMentorship } from '../services/mentorshipServices';
import { fetchProfessorById } from '../services/mentorServices';
import { getStoredUser } from '../utils/auth';

/**
 * Modern Teacher / Mentor Profile page displaying biography, metrics, booking card, and student reviews.
 */
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
        confirmButtonColor: '#5F688F',
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
          confirmButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
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
        confirmButtonColor: '#5F688F',
      });
    } catch (err) {
      Swal.fire({
        icon: 'warning',
        title: err.message || 'Erro ao solicitar mentoria.',
        confirmButtonColor: '#5F688F',
      });
    } finally {
      setRequesting(false);
    }
  }

  const totalAvaliacoes = professor?.avaliacoes ? professor.avaliacoes.length : 0;
  const mediaCalculada = totalAvaliacoes > 0
    ? (professor.avaliacoes.reduce((acc, curr) => acc + Number(curr.nota), 0) / totalAvaliacoes).toFixed(1)
    : Number(professor?.media_avaliacao || 5).toFixed(1);

  const precoFormatado = Number(professor?.preco_hora || 50).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-[#111418] font-['Inter',sans-serif]">
      <Header />

      {/* Breadcrumb / Top Strip */}
      <div className="bg-gradient-to-b from-[#F4F6FB] via-white to-slate-50/50 border-b border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#5F688F] transition text-decoration-none"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar ao Catálogo</span>
          </Link>

          {professor && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Mentor disponível para agendamentos
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-20 bg-gray-100 rounded-xl w-full" />
              </div>
            </div>
            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="size-24 rounded-2xl bg-gray-200 mx-auto" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
              <div className="h-11 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        ) : professor ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Teacher Presentation & Student Reviews */}
            <div className="lg:col-span-8 space-y-8">
              {/* Presentation & Bio Card */}
              <section className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#5F688F]/10 text-[#5F688F] text-xs font-bold px-3 py-1 rounded-full border border-[#5F688F]/20">
                      <BookOpen className="size-3.5" />
                      <span>{professor.disciplina_principal || 'Geral'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                      <ShieldCheck className="size-3.5" />
                      <span>Mentor Verificado</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-0">
                    {professor.nome}
                  </h1>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 mb-0">
                    Sobre o mentor e metodologia
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line mb-0">
                    {professor.descricao || 'Professor particular experiente, focado em metodologias ativas e resolução de dúvidas práticas.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="bg-slate-50/80 rounded-xl border border-gray-200/70 p-3.5 flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center shrink-0">
                      <Laptop className="size-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Formato
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        Online e Presencial
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl border border-gray-200/70 p-3.5 flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Resposta média
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        ~{professor.tempo_resposta_minutos || 15} min
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl border border-gray-200/70 p-3.5 flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Experiência
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        +{professor.quantidade_alunos || 0} alunos
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Student Reviews Card */}
              <section className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0.5">
                      Avaliações dos Alunos
                    </h2>
                    <p className="text-xs text-gray-500 mb-0">
                      Feedbacks reais de estudantes que já fizeram mentoria
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{mediaCalculada}</span>
                    <span className="text-xs text-gray-500">
                      ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                </div>

                {professor.avaliacoes && professor.avaliacoes.length > 0 ? (
                  <div className="space-y-4">
                    {professor.avaliacoes.map((av, idx) => {
                      const notaArredondada = Math.round(Number(av.nota || 5));
                      const alunoNome = av.aluno_nome || 'Aluno';

                      return (
                        <article
                          key={av.id || idx}
                          className="bg-slate-50/70 rounded-2xl border border-gray-200/80 p-5 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-[#5F688F]/15 text-[#5F688F] font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                                {alunoNome.charAt(0)}
                              </div>
                              <div>
                                <span className="block text-sm font-bold text-gray-900">
                                  {alunoNome}
                                </span>
                                <span className="block text-[11px] text-gray-400 font-medium">
                                  Aluno verificado
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, starIdx) => (
                                  <Star
                                    key={starIdx}
                                    className={`size-3.5 ${
                                      starIdx < notaArredondada
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-gray-800 ml-1">
                                {Number(av.nota || 5).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed mb-0">
                            {av.comentario}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                    <p className="text-sm text-gray-500 mb-0">
                      Nenhuma avaliação registrada ainda para este professor.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Sticky Booking Card */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border-2 border-[#5F688F]/25 p-6 shadow-lg shadow-[#5F688F]/10 space-y-5">
                {/* Photo & Rating Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <img
                      src={professor.foto_url || '/assets/images/default.webp'}
                      alt={`${professor.nome} - foto do professor`}
                      className="size-28 rounded-2xl object-cover border-2 border-[#5F688F]/20 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/default.webp';
                      }}
                    />
                    <span
                      className="absolute -bottom-1.5 -right-1.5 size-4 rounded-full bg-emerald-500 border-2 border-white"
                      title="Disponível para mentorias"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">
                        {precoFormatado}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">/hora</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs mt-1.5">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{mediaCalculada}</span>
                      <span className="text-gray-400">
                        ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Summary Rows */}
                <div className="border-y border-gray-100 py-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 flex items-center gap-2 text-xs font-medium">
                      <Clock className="size-4 text-[#5F688F]" />
                      Tempo de resposta
                    </span>
                    <span className="font-bold text-gray-900 text-xs">
                      ~{professor.tempo_resposta_minutos ? `${professor.tempo_resposta_minutos} min` : '15 min'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 flex items-center gap-2 text-xs font-medium">
                      <Users className="size-4 text-[#5F688F]" />
                      Número de alunos
                    </span>
                    <span className="font-bold text-gray-900 text-xs">
                      +{professor.quantidade_alunos || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 flex items-center gap-2 text-xs font-medium">
                      <BookOpen className="size-4 text-[#5F688F]" />
                      Disciplina
                    </span>
                    <span className="font-bold text-[#5F688F] text-xs">
                      {professor.disciplina_principal || 'Geral'}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleSolicitarMentoria}
                    disabled={requesting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] disabled:opacity-60 text-white py-3.5 px-5 rounded-xl font-semibold text-sm transition cursor-pointer border-0 shadow-xs"
                  >
                    {requesting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Solicitando...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="size-4" />
                        <span>Solicitar mentoria</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center leading-relaxed mb-0">
                    Após o aceite do mentor, você poderá escolher datas e horários direto no seu painel.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
