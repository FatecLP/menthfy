import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuestGuard from '../components/GuestGuard';

/**
 * Password recovery page matching the modernized Login and Cadastro split-screen design.
 */
export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRecuperar(e) {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      await Swal.fire({
        icon: 'error',
        title: 'E-mail inválido',
        text: 'Informe um e-mail válido.',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    setLoading(true);

    try {
      await Swal.fire({
        icon: 'success',
        title: 'E-mail enviado',
        text: `Um e-mail de recuperação foi enviado para ${trimmedEmail}`,
        confirmButtonColor: '#5F688F',
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro, tente novamente mais tarde.',
        confirmButtonColor: '#5F688F',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] text-[#111418] font-['Inter',sans-serif]">
      <Header />

      <GuestGuard>
        <main className="flex-1 bg-[#F4F6FB] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-14">
            {/* Left Side: Illustration */}
            <section className="hidden md:flex md:w-1/2 items-center justify-center p-4 lg:p-8">
              <img
                src="/assets/images/illustrations/recuperar.svg"
                alt="Ilustração de recuperação de senha na plataforma Menthfy"
                className="w-4/5 max-w-md h-auto object-contain"
              />
            </section>

            {/* Right Side: Password Recovery Form Card */}
            <section className="w-full md:w-1/2 flex items-center justify-center">
              <form
                id="recuperarForm"
                onSubmit={handleRecuperar}
                className="w-full max-w-md bg-white rounded-2xl border-2 border-[#5F688F]/25 p-6 sm:p-8 shadow-lg shadow-[#5F688F]/10 space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-0">
                    Recuperar Senha
                  </h2>
                  <p className="text-sm text-gray-500 mb-0">
                    Informe seu e-mail cadastrado para receber as instruções
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    E-mail cadastrado
                  </label>
                  <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-300 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                    <Mail className="size-4 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="username"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                    />
                  </div>
                </div>

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
                      <span>Enviar recuperação</span>
                    </>
                  )}
                </button>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4 text-sm">
                  <Link
                    to="/login"
                    className="text-[#5F688F] hover:text-[#4d5577] font-semibold transition text-decoration-none"
                  >
                    Já tenho conta
                  </Link>
                  <Link
                    to="/cadastro"
                    className="text-gray-500 hover:text-[#5F688F] font-medium transition text-decoration-none"
                  >
                    Cadastrar
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </main>
      </GuestGuard>

      <Footer />
    </div>
  );
}
