import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  ChevronDown,
  UserPlus,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuestGuard from '../components/GuestGuard';
import { registerAluno, registerProfessor } from '../services/api';

/**
 * Registration page with preserved split-screen illustration layout and modernized form card.
 */
export default function CadastroPage() {
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipo, setTipo] = useState('aluno');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleCpfChange(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  }

  const passwordMismatch = confirmPassword !== '' && password !== confirmPassword;

  async function handleCadastro(e) {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const rawCpf = cpf.replace(/\D/g, '');
    const trimmedEmail = email.trim();

    const usernameRegex = /^(?!.*\s)[a-zA-Z0-9_\-]{3,32}$/;
    if (!trimmedUsername) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Nome de usuário não pode ficar vazio.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (!usernameRegex.test(trimmedUsername)) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nome de usuário deve ter 3-32 caracteres e conter apenas letras, números, sublinhado ou hífen sem espaços.',
        confirmButtonColor: '#5F688F',
      });
      return;
    }

    if (/^\d+$/.test(trimmedUsername)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Nome de usuário não pode conter somente números.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (!rawCpf || !/^\d{11}$/.test(rawCpf)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'CPF deve conter exatamente 11 números.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Informe um e-mail válido.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (!password || password.length < 6) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'A senha deve ter pelo menos 6 caracteres.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (password !== confirmPassword) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.', confirmButtonColor: '#5F688F' });
      return;
    }

    if (!tipo || (tipo !== 'aluno' && tipo !== 'professor')) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Selecione o tipo de usuário.', confirmButtonColor: '#5F688F' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: trimmedUsername,
        email: trimmedEmail,
        senha: password,
      };

      if (tipo === 'aluno') {
        await registerAluno(payload);
      } else {
        await registerProfessor(payload);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado',
        text: 'Cadastro realizado com sucesso! Faça login para continuar.',
        confirmButtonColor: '#5F688F',
      });

      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: err.message || 'Erro interno ao cadastrar. Tente novamente.',
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
                src="/assets/images/illustrations/cadastro.svg"
                alt="Ilustração de cadastro na plataforma Menthfy"
                className="w-11/12 max-w-lg h-auto object-contain"
              />
            </section>

            {/* Right Side: Registration Form Card */}
            <section className="w-full md:w-1/2 flex items-center justify-center">
              <form
                id="cadastroForm"
                onSubmit={handleCadastro}
                className="w-full max-w-xl bg-white rounded-2xl border-2 border-[#5F688F]/25 p-6 sm:p-8 shadow-lg shadow-[#5F688F]/10 space-y-4"
              >
                <div className="text-center space-y-1 mb-2">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-0">
                    Criar conta
                  </h2>
                  <p className="text-sm text-gray-500 mb-0">
                    Comece sua jornada como aluno ou mentor no Menthfy
                  </p>
                </div>

                {/* Row 1: Username + CPF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nome de usuário
                    </label>
                    <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-300 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                      <User className="size-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        minLength={3}
                        maxLength={32}
                        placeholder="Seu nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      CPF
                    </label>
                    <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-300 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                      <CreditCard className="size-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        required
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    E-mail
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

                {/* Row 3: Password + Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Senha
                    </label>
                    <div className="flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border border-gray-300 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                      <Lock className="size-4 text-gray-400 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition bg-transparent border-0 cursor-pointer shrink-0"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Confirmar Senha
                    </label>
                    <div
                      className={`flex items-center gap-2.5 bg-slate-50/70 focus-within:bg-white border rounded-xl px-3.5 focus-within:ring-2 transition overflow-hidden ${
                        passwordMismatch
                          ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-200'
                          : 'border-gray-300 focus-within:border-[#5F688F] focus-within:ring-[#5F688F]/20'
                      }`}
                    >
                      <Lock className="size-4 text-gray-400 shrink-0" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="Repetir senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-2.5 px-0 bg-transparent border-0 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition bg-transparent border-0 cursor-pointer shrink-0"
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {passwordMismatch && (
                      <p id="passwordMatchMessage" className="text-xs text-red-600 font-medium mt-1 mb-0">
                        As senhas não coincidem.
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Account Type */}
                <div>
                  <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tipo de usuário
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 focus-within:bg-white border border-gray-300 rounded-xl px-3.5 focus-within:border-[#5F688F] focus-within:ring-2 focus-within:ring-[#5F688F]/20 transition overflow-hidden">
                    <Users className="size-4 text-gray-400 shrink-0" />
                    <select
                      id="tipo"
                      name="tipo"
                      required
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="appearance-none bg-none w-full py-2.5 pl-2.5 pr-8 bg-transparent border-0 text-sm text-gray-800 font-medium outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="aluno">Aluno</option>
                      <option value="professor">Professor</option>
                    </select>
                    <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-4" />
                      <span>Cadastrar</span>
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
                    to="/recuperar"
                    className="text-gray-500 hover:text-[#5F688F] font-medium transition text-decoration-none"
                  >
                    Esqueci a senha
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
