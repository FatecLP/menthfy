import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  ShieldCheck,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Code2,
  BarChart3,
  Music,
  Palette,
  Globe2,
  ChevronDown,
  Clock,
  Laptop,
  Menu,
  X,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { getStoredUser, clearStoredUser, getDashboardRoute } from '../utils/auth';

/**
 * Animated number counter with ease-out cubic curve triggered when entering the viewport.
 *
 * @param {object} props
 * @param {number} props.target - Target number to count up to.
 * @param {string} [props.suffix] - Suffix to append to the formatted string.
 * @param {number} [props.decimals] - Number of decimal places.
 */
function AnimatedCounter({ target, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.25 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1600;
    const startTime = performance.now();
    let animationFrameId;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(ease * target);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, target]);

  return (
    <span ref={ref}>
      {decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
}

/**
 * High-conversion Landing Page for Menthfy.
 * Displays value propositions, mentors, workflow, categories, testimonials, and FAQs.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const ROTATING_WORDS = [
    'Programação Web',
    'Excel & Power BI',
    'Redação ENEM',
    'Música & Violão',
    'UI/UX Design',
    'Cálculo & Exatas',
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [wordKey, setWordKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      setWordKey((k) => k + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [ROTATING_WORDS.length]);

  useEffect(() => {
    setUser(getStoredUser());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const elements = document.querySelectorAll('.reveal-init');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?busca=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  const handleCategoryClick = (disciplina) => {
    navigate(`/catalogo?disciplina=${encodeURIComponent(disciplina)}`);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const categories = [
    {
      name: 'Programação & Tech',
      icon: Code2,
      count: '42 mentores',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      tag: 'Programação',
      description: 'React, Node.js, Python, Banco de Dados, Algoritmos e Arquitetura.',
    },
    {
      name: 'Excel, Power BI & Dados',
      icon: BarChart3,
      count: '28 mentores',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tag: 'Excel',
      description: 'Fórmulas complexas, Dashboards, Automação e Análise Financeira.',
    },
    {
      name: 'Português & Redação',
      icon: BookOpen,
      count: '35 mentores',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      tag: 'Português',
      description: 'Redação Nota 1000 para ENEM, Gramática, Concursos e Oratória.',
    },
    {
      name: 'Música & Instrumentos',
      icon: Music,
      count: '19 mentores',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      tag: 'Música',
      description: 'Violão, Teclado, Canto, Percepção Auditiva e Teoria Musical.',
    },
    {
      name: 'Artes & Design Digital',
      icon: Palette,
      count: '16 mentores',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      tag: 'Artes',
      description: 'UI/UX Design, Figma, Ilustração Digital, Photoshop e Criatividade.',
    },
    {
      name: 'Ciências & Humanas',
      icon: Globe2,
      count: '24 mentores',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      tag: 'Geografia',
      description: 'Geopolítica, Filosofia, História, Atualidades e Ensino Médio.',
    },
  ];

  const featuredMentors = [
    {
      id: 1,
      nome: 'Prof. Alberto',
      disciplina: 'Programação',
      subtitulo: 'Engenheiro de Software & Especialista Web',
      foto: '/assets/images/img1.jpg',
      avaliacao: 4.9,
      totalAvaliacoes: 128,
      preco: 50,
      tags: ['React', 'Node.js', 'Python', 'MySQL'],
      disponibilidade: 'Online e Presencial',
    },
    {
      id: 3,
      nome: 'Profa. Carla Oliveira',
      disciplina: 'Excel',
      subtitulo: 'Analista de BI & Especialista em Produtividade',
      foto: '/assets/images/img3.jpg',
      avaliacao: 5.0,
      totalAvaliacoes: 94,
      preco: 45,
      tags: ['Excel Avançado', 'Power BI', 'Dashboards'],
      disponibilidade: 'Online e Presencial',
    },
    {
      id: 2,
      nome: 'Prof. Bernardo',
      disciplina: 'Português',
      subtitulo: 'Professor de Letras & Especialista em Redação ENEM',
      foto: '/assets/images/img2.jpg',
      avaliacao: 4.8,
      totalAvaliacoes: 82,
      preco: 70,
      tags: ['Redação ENEM', 'Gramática', 'Interpretação'],
      disponibilidade: 'Online e Presencial',
    },
  ];

  const faqs = [
    {
      question: 'Como funcionam as aulas na plataforma?',
      answer:
        'As aulas no Menthfy são totalmente personalizadas. Após escolher o professor ideal no catálogo e solicitar a mentoria, vocês combinam as datas, horários e o formato desejado (online ou presencial) diretamente pelo sistema em poucos cliques.',
    },
    {
      question: 'Como faço para agendar uma aula com o mentor?',
      answer:
        'Basta acessar o catálogo de professores, escolher o mentor ideal, solicitar a mentoria e, uma vez aceita, você pode sugerir datas, horários e o formato pelo modal de agendamento em segundos.',
    },
    {
      question: 'Posso remarcar ou cancelar um agendamento?',
      answer:
        'Sim! Tanto alunos quanto professores contam com total flexibilidade para solicitar alteração de data/horário ou cancelar a solicitação diretamente pelo Dashboard antes da confirmação da aula.',
    },
    {
      question: 'Como posso me cadastrar para ensinar no Menthfy?',
      answer:
        'Clique em "Cadastrar Grátis", selecione a opção "Professor / Mentor", preencha sua biografia, valor da hora/aula e sua disciplina. Seu perfil ficará disponível no catálogo para milhares de alunos!',
    },
    {
      question: 'As avaliações dos professores são confiáveis?',
      answer:
        'Sim, 100% das avaliações são registradas por alunos reais cadastrados na plataforma após a realização de mentorias, garantindo total transparência e qualidade no catálogo.',
    },
  ];

  const testimonials = [
    {
      nome: 'Beatriz Vasconcelos',
      curso: 'Estudante de Ciência da Computação',
      foto: '/assets/images/img4.jpg',
      texto:
        'Estava travada em desenvolvimento web e algoritmos com React. Duas mentorias com o Prof. Alberto me destravaram mais do que semanas estudando sozinha. O agendamento descomplicado e a atenção individual fizeram toda a diferença!',
      rating: 5,
      tag: 'Mentoria de Programação',
    },
    {
      nome: 'Gabriel Antunes',
      curso: 'Vestibulando de Medicina',
      foto: '/assets/images/img5.jpg',
      texto:
        'Consegui nota 960 na redação do ENEM graças ao acompanhamento semanal com o Prof. Bernardo. O feedback detalhado a cada correção e as dicas práticas me deixaram muito mais seguro e confiante para a prova!',
      rating: 5,
      tag: 'Redação Nota 1000',
    },
    {
      nome: 'Rodrigo Medeiros',
      curso: 'Analista de Controladoria Jr.',
      foto: '/assets/images/img6.jpg',
      texto:
        'Precisava dominar automação e dashboards em Power BI para uma promoção na empresa. A Profa. Carla foi extremamente didática e focou diretamente nos desafios reais do meu trabalho diário.',
      rating: 5,
      tag: 'Excel & Power BI',
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-[#111418] font-['Inter',sans-serif] selection:bg-[#5F688F]/20 selection:text-[#5F688F]">
      {/* Header / Navbar */}
      <header
        className={`menthfy-home-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'is-scrolled bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 py-3.5'
            : 'bg-white/85 backdrop-blur-sm py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="md:flex-1 flex items-center justify-start">
            <Link to="/" className="home-brand-link flex items-center gap-2 group text-decoration-none shrink-0">
              <span className="font-['Baumans'] text-3xl font-bold tracking-tight text-[#5F688F] group-hover:text-[#4a5272] transition-colors">
                menthfy
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse-ring" title="Plataforma Online" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-8 text-[15px] font-medium text-gray-600 shrink-0">
            <Link to="/catalogo" className="home-nav-link whitespace-nowrap hover:text-[#5F688F] transition-colors">
              Catálogo
            </Link>
            <Link to="/contato" className="home-nav-link whitespace-nowrap hover:text-[#5F688F] transition-colors">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex md:flex-1 items-center justify-end gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardRoute(user.tipoUsuario)}
                  className="home-btn-dashboard whitespace-nowrap inline-flex items-center gap-2 bg-[#5F688F]/10 hover:bg-[#5F688F]/15 text-[#5F688F] font-semibold px-4 py-2 rounded-xl text-sm transition border border-[#5F688F]/20 text-decoration-none"
                >
                  <Users className="size-4" />
                  <span>Dashboard ({user.nome?.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium px-2 py-1 transition cursor-pointer bg-transparent border-0"
                  title="Encerrar sessão"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="home-btn-login whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#5F688F] transition text-decoration-none"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="home-btn-register whitespace-nowrap inline-flex items-center gap-1.5 bg-[#5F688F] hover:bg-[#4d5577] text-white px-4 py-2 rounded-xl text-sm font-semibold transition text-decoration-none cursor-pointer"
                >
                  <span>Cadastrar Grátis</span>
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer bg-transparent border-0"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden home-mobile-drawer bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <Link
              to="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="home-mobile-link block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 text-decoration-none font-medium"
            >
              Catálogo
            </Link>
            <Link
              to="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="home-mobile-link block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 text-decoration-none font-medium"
            >
              Contato
            </Link>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={getDashboardRoute(user.tipoUsuario)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="home-mobile-dashboard w-full text-center bg-[#5F688F] text-white py-2.5 rounded-xl font-semibold text-decoration-none"
                  >
                    Acessar Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-red-600 py-2 rounded-xl font-medium border border-red-200 bg-transparent"
                  >
                    Sair da conta
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="home-mobile-login w-full text-center border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold text-decoration-none"
                  >
                    Entrar na Conta
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="home-mobile-register w-full text-center bg-[#5F688F] text-white py-2.5 rounded-xl font-semibold text-decoration-none"
                  >
                    Cadastre-se Gratuitamente
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-[#F4F6FB] via-white to-white">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-[#5F688F]/15 via-indigo-100/30 to-purple-100/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12]">
                Encontre o mentor ideal de <br className="hidden sm:inline" />
                <span className="relative inline-block text-[#5F688F] min-h-[1.15em] pb-1">
                  <span
                    key={wordKey}
                    className="inline-block animate-text-flip font-black text-[#5F688F]"
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full text-[#5F688F]/30"
                    viewBox="0 0 250 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9C45 3 130 1 247 8"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                <span className="text-gray-900">e destrave seu potencial.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Conecte-se com professores particulares e especialistas para aulas online ou presenciais.
                Agendamento simplificado e foco 100% individual nas suas metas.
              </p>

              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
                <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-200 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition">
                  <div className="relative flex-1 flex items-center pl-3">
                    <Search className="size-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Qual matéria quer aprender hoje?"
                      className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-800 bg-transparent border-0 outline-hidden focus:ring-0 placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] text-white px-6 py-3 rounded-xl font-semibold text-sm transition cursor-pointer border-0"
                  >
                    <span>Buscar Mentor</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-xs pt-1 text-gray-600">
                <span className="font-semibold text-gray-500">Mais procurados:</span>
                {['Programação', 'Excel', 'Português', 'Música', 'Artes'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleCategoryClick(tag)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition font-medium cursor-pointer border-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['/assets/images/img1.jpg', '/assets/images/img2.jpg', '/assets/images/img3.jpg', '/assets/images/img4.jpg'].map(
                    (src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Estudante ${i + 1}`}
                        className="size-9 rounded-full object-cover border-2 border-white ring-1 ring-gray-200 transition-transform hover:scale-110"
                      />
                    )
                  )}
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="font-bold text-gray-900 ml-1">4.9 / 5.0</span>
                  </div>
                  <p className="text-gray-500 font-medium">Mais de 1.800 estudantes já transformaram seus estudos</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center pb-6 lg:pb-0">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5F688F] to-indigo-400 rounded-3xl blur-2xl opacity-20 animate-pulse-glow" />

                <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-100 space-y-5 transition-transform duration-300 hover:scale-[1.01]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src="/assets/images/img1.jpg"
                          alt="Prof. Alberto"
                          className="size-16 rounded-2xl object-cover border-2 border-[#5F688F]/20 shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse-ring" title="Disponível agora" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-bold text-gray-900">Prof. Alberto</h3>
                          <ShieldCheck className="size-4 text-blue-600 fill-blue-50" title="Mentor Verificado" />
                        </div>
                        <p className="text-xs font-medium text-gray-500">Engenheiro de Software & Web</p>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span>4.9 (128 avaliações)</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-[#5F688F]/10 text-[#5F688F] text-xs font-bold px-2.5 py-1 rounded-full border border-[#5F688F]/20">
                      R$ 50/h
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      "Foco em resolução prática de problemas, desenvolvimento full-stack com React e preparação para o mercado de tecnologia."
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'Python', 'Bancos SQL'].map((tag) => (
                        <span key={tag} className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2.5">
                    <Link
                      to="/catalogo"
                      className="flex-1 bg-[#5F688F] hover:bg-[#4d5577] text-white text-center py-2.5 rounded-xl font-semibold text-xs transition text-decoration-none"
                    >
                      Agendar com Alberto
                    </Link>
                    <Link
                      to="/catalogo"
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition text-decoration-none"
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </div>

                <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3 max-w-[240px] animate-float-slow z-20">
                  <div className="size-10 rounded-xl bg-indigo-50 text-[#5F688F] flex items-center justify-center shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 leading-tight mb-0.5">Mentoria Confirmada</p>
                    <p className="text-gray-500 font-medium mb-0">Terça-feira às 14:00</p>
                  </div>
                </div>

                <div className="absolute bottom-2 -right-2 sm:bottom-4 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3 max-w-[230px] animate-float-reverse z-20">
                  <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 leading-tight mb-0.5">Agendamento Fácil</p>
                    <p className="text-gray-500 font-medium mb-0">Confirmado em 1 clique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-slate-950 text-white py-12 border-y border-slate-800 reveal-init">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-0">
                <AnimatedCounter target={500} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-0">
                Mentores Certificados
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#8792be] tracking-tight mb-0">
                <AnimatedCounter target={15000} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-0">
                Aulas Realizadas
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight mb-0">
                <AnimatedCounter target={98.9} suffix="%" decimals={1} />
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-0">
                Aprovação dos Alunos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 reveal-init">
            <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20">
              Passo a Passo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Aprender com quem entende nunca foi tão simples
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Desenvolvemos uma experiência fluida para você encontrar o mentor certo e começar suas aulas sem barreiras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/3 left-12 right-12 h-0.5 bg-gray-200 -z-1" />

            <div className="reveal-init delay-100 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4 relative group interactive-card">
              <div className="size-14 rounded-2xl bg-[#5F688F] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-[#5F688F]/20 group-hover:scale-110 group-hover:bg-[#4a5272] transition-all duration-300">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900">Encontre o Mentor</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Filtre professores por disciplina, avaliações, disponibilidade e faixa de preço no catálogo completo.
              </p>
            </div>

            <div className="reveal-init delay-200 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4 relative group interactive-card">
              <div className="size-14 rounded-2xl bg-[#5F688F] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-[#5F688F]/20 group-hover:scale-110 group-hover:bg-[#4a5272] transition-all duration-300">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900">Agende a Aula</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Escolha o dia, horário e o formato desejado (Online ou Presencial) em segundos.
              </p>
            </div>

            <div className="reveal-init delay-300 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4 relative group interactive-card">
              <div className="size-14 rounded-2xl bg-[#5F688F] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-[#5F688F]/20 group-hover:scale-110 group-hover:bg-[#4a5272] transition-all duration-300">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900">Aprenda na Prática</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tire dúvidas reais com atenção 100% individual e foco no seu ritmo e nos seus objetivos.
              </p>
            </div>

            <div className="reveal-init delay-400 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4 relative group interactive-card">
              <div className="size-14 rounded-2xl bg-[#5F688F] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-[#5F688F]/20 group-hover:scale-110 group-hover:bg-[#4a5272] transition-all duration-300">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900">Evolua no Painel</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Acompanhe todas as mentorias, remarcações e receba feedbacks no seu dashboard do aluno ou professor.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center reveal-init delay-500">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] text-white font-semibold px-6 py-3.5 rounded-xl shadow-xs transition text-decoration-none"
            >
              <span>Comece a Explorar o Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 reveal-init">
            <div>
              <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20">
                Áreas do Saber
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
                O que você deseja aprender hoje?
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5F688F] hover:text-[#4d5577] transition text-decoration-none"
            >
              <span>Ver todas as disciplinas</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.tag}
                  onClick={() => handleCategoryClick(cat.tag)}
                  className={`reveal-init delay-${(i % 3 + 1) * 100} bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between interactive-card`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`size-12 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {cat.count}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#5F688F] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#5F688F]">
                    <span>Ver mentores disponíveis</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal-init">
            <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20">
              Professores Recomendados
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Aprenda com quem é referência na disciplina
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Conheça alguns dos mentores mais bem avaliados pelos alunos da comunidade Menthfy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMentors.map((mentor, idx) => (
              <div
                key={mentor.id}
                className={`reveal-init delay-${(idx + 1) * 150} bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group interactive-card`}
              >
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={mentor.foto}
                        alt={mentor.nome}
                        className="size-16 rounded-2xl object-cover border-2 border-gray-100 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-gray-900 truncate group-hover:text-[#5F688F] transition-colors">{mentor.nome}</h3>
                        <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs font-semibold text-[#5F688F] mt-0.5">{mentor.disciplina}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{mentor.avaliacao}</span>
                        <span className="text-gray-400 font-normal">({mentor.totalAvaliacoes} avaliações)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{mentor.subtitulo}</p>

                  <div className="flex flex-wrap gap-1">
                    {mentor.tags.map((t) => (
                      <span key={t} className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="size-3.5" />
                      <span>{mentor.disponibilidade}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">R$ {mentor.preco}</span>
                      <span className="text-gray-400 text-[11px]">/hora</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to="/catalogo"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#5F688F] text-white py-2.5 rounded-xl font-semibold text-xs transition duration-200 text-decoration-none shadow-xs group-hover:shadow"
                  >
                    <span>Ver Perfil Completo</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center reveal-init delay-300">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#5F688F] hover:text-[#5F688F] text-gray-700 font-semibold px-6 py-3 rounded-xl transition text-sm text-decoration-none"
            >
              <span>Ver todos os mentores disponíveis no catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Differentials (Bento Grid) */}
      <section id="diferenciais" className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#5F688F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal-init">
            <span className="text-xs font-bold text-[#8792be] uppercase tracking-wider bg-[#5F688F]/20 px-3 py-1 rounded-full border border-[#5F688F]/30">
              Recursos de Ponta
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tudo o que você precisa para uma mentoria de alto nível
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Desenvolvido com tecnologia moderna para garantir foco absoluto no que realmente importa: o seu aprendizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="reveal-init delay-100 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Users className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Aulas Personalizadas 1:1</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Foco total nas suas necessidades e dúvidas reais. O professor estrutura os encontros de acordo com o seu ritmo de aprendizado, sem turmas cheias ou conteúdos genéricos.
              </p>
            </div>

            <div className="reveal-init delay-200 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Calendar className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Agendamento & Sincronização</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nosso microserviço exclusivo de agendamento valida disponibilidades, evita conflito de horários e permite aprovação e remarcação com 1 clique.
              </p>
            </div>

            <div className="reveal-init delay-300 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Compass className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Online ou Presencial</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Você escolhe o formato mais confortável para cada encontro. Tenha aulas remotas no conforto de casa ou encontre mentores próximos de você.
              </p>
            </div>

            <div className="reveal-init delay-150 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Laptop className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Dashboards Dedicados</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Painéis sob medida para alunos e professores: organize suas mentorias, monitore status pendentes, históricos e canais de comunicação.
              </p>
            </div>

            <div className="reveal-init delay-250 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Curadoria & Verificação</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Perfis transparentes com notas autênticas, histórico de aulas e depoimentos reais deixados por quem realmente vivenciou o ensino.
              </p>
            </div>

            <div className="reveal-init delay-350 bg-slate-800/80 rounded-2xl p-7 border border-slate-700/60 shadow-lg hover:border-[#5F688F] transition-all duration-300 space-y-4 interactive-card">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Evolução no seu Ritmo</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sem turmas cheias ou fórmulas prontas. As aulas são moldadas no seu momento para acelerar notas, aprovações e transições de carreira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal-init">
            <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20">
              Histórias de Sucesso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              O que dizem os estudantes que usam o Menthfy
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Veja como o suporte de mentores qualificados impactou a vida de alunos reais em todo o país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((dep, i) => (
              <div
                key={dep.nome}
                onClick={() => setActiveTestimonialIdx(i)}
                className={`reveal-init delay-${(i + 1) * 150} bg-slate-50 rounded-2xl p-7 border flex flex-col justify-between space-y-6 transition-all duration-300 interactive-card cursor-pointer ${
                  activeTestimonialIdx === i
                    ? 'border-[#5F688F] ring-2 ring-[#5F688F]/20 shadow-md bg-white'
                    : 'border-slate-100 hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(dep.rating)].map((_, idx) => (
                        <Star key={idx} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#5F688F] bg-[#5F688F]/10 px-2 py-0.5 rounded-md">
                      {dep.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">"{dep.texto}"</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <img
                    src={dep.foto}
                    alt={dep.nome}
                    className="size-11 rounded-full object-cover border border-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{dep.nome}</h4>
                    <p className="text-xs text-gray-500">{dep.curso}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12 reveal-init">
            <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3 py-1 rounded-full border border-[#5F688F]/20">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Perguntas Frequentes</h2>
            <p className="text-base text-gray-600">
              Reunimos as respostas para as principais dúvidas sobre o funcionamento do Menthfy.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.question}
                  className="reveal-init bg-white rounded-xl border border-gray-200/90 overflow-hidden shadow-xs hover:border-[#5F688F]/40 transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="faq-button text-left"
                  >
                    <span className="text-base font-semibold text-gray-900 hover:text-[#5F688F] transition-colors">
                      {faq.question}
                    </span>
                    <span
                      className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? 'bg-[#5F688F]/10 text-[#5F688F] rotate-180'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-content border-t border-gray-100 pt-3 animate-text-flip">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-24 bg-[#5F688F] text-white relative overflow-hidden reveal-init">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Pronto para transformar sua jornada de aprendizado?
          </h2>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de alunos que já encontraram professores apaixonados por ensinar.
            Crie sua conta em 1 minuto e agende sua primeira mentoria hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#5F688F] hover:bg-gray-100 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition text-decoration-none cursor-pointer"
            >
              <span>Criar Conta Gratuitamente</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/catalogo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/40 px-8 py-3.5 rounded-xl font-semibold text-sm transition text-decoration-none"
            >
              <span>Explorar Mentores</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="menthfy-home-footer bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            <div className="md:col-span-2 space-y-4">
              <Link to="/" className="inline-block text-decoration-none">
                <span className="font-['Baumans'] text-3xl font-bold text-white tracking-tight">
                  menthfy
                </span>
              </Link>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Plataforma de mentorias e aulas particulares que conecta alunos e educadores para um aprendizado de alta performance, humanizado e flexível.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                <span>Todos os serviços operando normalmente</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition text-decoration-none text-slate-400">
                    Página Inicial
                  </Link>
                </li>
                <li>
                  <Link to="/catalogo" className="hover:text-white transition text-decoration-none text-slate-400">
                    Catálogo de Professores
                  </Link>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-white transition text-decoration-none text-slate-400">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#diferenciais" className="hover:text-white transition text-decoration-none text-slate-400">
                    Diferenciais
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Disciplinas</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => handleCategoryClick('Programação')}
                    className="hover:text-white transition text-left text-slate-400 cursor-pointer bg-transparent border-0 p-0"
                  >
                    Programação Web
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('Excel')}
                    className="hover:text-white transition text-left text-slate-400 cursor-pointer bg-transparent border-0 p-0"
                  >
                    Excel & Power BI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('Português')}
                    className="hover:text-white transition text-left text-slate-400 cursor-pointer bg-transparent border-0 p-0"
                  >
                    Redação & Gramática
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('Música')}
                    className="hover:text-white transition text-left text-slate-400 cursor-pointer bg-transparent border-0 p-0"
                  >
                    Música & Instrumentos
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Acesso & Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition text-decoration-none text-slate-400">
                    Entrar na Conta
                  </Link>
                </li>
                <li>
                  <Link to="/cadastro" className="hover:text-white transition text-decoration-none text-slate-400">
                    Cadastro de Aluno / Professor
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="hover:text-white transition text-decoration-none text-slate-400">
                    Fale Conosco
                  </Link>
                </li>
                <li>
                  <Link to="/recuperar" className="hover:text-white transition text-decoration-none text-slate-400">
                    Recuperar Senha
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Menthfy. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 transition cursor-pointer">Termos de Uso</span>
              <span className="hover:text-slate-400 transition cursor-pointer">Privacidade</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition font-semibold cursor-pointer bg-transparent border-0 text-slate-400 p-0"
              >
                Voltar ao topo ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
