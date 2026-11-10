import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Send,
  Clock,
  ShieldCheck,
  ArrowRight,
  Tag,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getStoredUser } from '../utils/auth';

const QUICK_SUBJECTS = [
  'Agendamento de aula',
  'Cadastro de professor',
  'Suporte técnico',
  'Sugestões e feedback',
];

/**
 * Modern Contact / Support page for Menthfy.
 * Features quick subject shortcuts, live character counters, and validation via SweetAlert2.
 */
export default function ContatoPage() {
  const [email, setEmail] = useState(() => getStoredUser()?.email || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();

    if (!trimmedEmail || !trimmedSubject || !trimmedDescription) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, insira um e-mail válido.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    if (trimmedSubject.length > 100) {
      Swal.fire({
        title: 'Atenção!',
        text: 'O assunto não pode ultrapassar 100 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    if (trimmedDescription.length > 1000) {
      Swal.fire({
        title: 'Atenção!',
        text: 'A descrição não pode ultrapassar 1000 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await Swal.fire({
        title: 'Sucesso!',
        text: 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#5F688F',
      });

      if (result.isConfirmed) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-[#111418] font-['Inter',sans-serif]">
      <Header />

      {/* Top Banner / Hero Header */}
      <section className="bg-gradient-to-b from-[#F4F6FB] via-white to-slate-50/50 py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-[#5F688F] uppercase tracking-wider bg-[#5F688F]/10 px-3.5 py-1.5 rounded-full border border-[#5F688F]/20 inline-block">
            Fale Conosco
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-0">
            Como podemos ajudar você?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-0">
            Envie sua dúvida, sugestão ou solicitação de suporte. Nossa equipe está pronta para responder com atenção e agilidade.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form Card */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Envie sua mensagem
              </h2>
              <p className="text-sm text-gray-500 mb-0">
                Preencha os campos abaixo com os detalhes do seu contato.
              </p>
            </div>

            {/* Quick Subject Pills */}
            <div className="mb-6">
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Assuntos frequentes
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUBJECTS.map((topic) => {
                  const isActive = subject === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSubject(topic)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        isActive
                          ? 'bg-[#5F688F] text-white border-[#5F688F] shadow-2xs'
                          : 'bg-slate-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <form id="contactForm" onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  E-mail
                </label>
                <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-200 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                  <Mail className="size-4 text-gray-400 shrink-0" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-0">
                    Assunto
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      subject.length > 90 ? 'text-amber-600' : 'text-gray-400'
                    }`}
                  >
                    {subject.length}/100
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-200 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                  <Tag className="size-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    maxLength={100}
                    placeholder="Sobre o que você gostaria de falar?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-0">
                    Descrição
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      description.length > 900 ? 'text-amber-600' : 'text-gray-400'
                    }`}
                  >
                    {description.length}/1000
                  </span>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                  <MessageSquare className="size-4 text-gray-400 shrink-0 mt-0.5" />
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    maxLength={1000}
                    placeholder="Descreva seu problema, dúvida ou sugestão..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0 resize-y min-h-[120px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#5F688F] hover:bg-[#4d5577] disabled:opacity-60 text-white py-3 px-6 rounded-xl font-semibold text-sm transition cursor-pointer border-0 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Right Column: Support Info & Quick Links */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Canais de Atendimento
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-0">
                  Garantimos acompanhamento claro e seguro para alunos e mentores em toda a jornada na plataforma.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-[#5F688F]/10 text-[#5F688F] flex items-center justify-center shrink-0">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                      Suporte Centralizado
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-0">
                      Dúvidas sobre conta, aulas, horários ou feedback são encaminhadas diretamente para nossa equipe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                      Retorno Ágil
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-0">
                      Respostas enviadas diretamente para o seu e-mail em até 24 horas úteis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                      Para Alunos e Professores
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-0">
                      Atendimento dedicado para ajudar desde a primeira aula até a gestão da sua agenda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Shortcut Card */}
            <div className="bg-[#5F688F] text-white rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-white mb-0">
                Procurando um mentor agora?
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-0">
                Acesse o catálogo completo para filtrar professores por disciplina, avaliação e disponibilidade.
              </p>
              <div className="pt-1">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-2 bg-white text-[#5F688F] hover:bg-gray-100 font-semibold text-xs px-4 py-2.5 rounded-xl transition text-decoration-none shadow-xs"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
