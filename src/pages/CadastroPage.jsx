import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuestGuard from '../components/GuestGuard';
import { registerAluno, registerProfessor } from '../services/api';

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
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Nome de usuário não pode ficar vazio.' });
      return;
    }

    if (!usernameRegex.test(trimmedUsername)) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nome de usuário deve ter 3-32 caracteres e conter apenas letras, números, sublinhado ou hífen sem espaços.',
      });
      return;
    }

    if (/^\d+$/.test(trimmedUsername)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Nome de usuário não pode conter somente números.' });
      return;
    }

    if (!rawCpf || !/^\d{11}$/.test(rawCpf)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'CPF deve conter exatamente 11 números.' });
      return;
    }

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Informe um e-mail válido.' });
      return;
    }

    if (!password || password.length < 6) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    if (password !== confirmPassword) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.' });
      return;
    }

    if (!tipo || (tipo !== 'aluno' && tipo !== 'professor')) {
      await Swal.fire({ icon: 'error', title: 'Erro', text: 'Selecione o tipo de usuário.' });
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
      });

      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: err.message || 'Erro interno ao cadastrar. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  const eyeShow = 'https://www.svgrepo.com/show/380010/eye-password-show.svg';
  const eyeHide = 'https://www.svgrepo.com/show/380007/eye-password-hide.svg';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <GuestGuard>
        <main className="split-screen" style={{ flex: 1 }}>
          <section className="split-left"></section>
          <section className="split-right">
            <form className="cadastro-container" id="cadastroForm" onSubmit={handleCadastro}>
              <h2 className="text-center mb-3">Criar conta</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Nome de usuário
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    required
                    minLength={3}
                    maxLength={32}
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf" className="form-label">
                    CPF
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cpf"
                    name="cpf"
                    required
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      name="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <img
                      className="password-toggle-icon"
                      src={showPassword ? eyeShow : eyeHide}
                      alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Senha
                  </label>
                  <div className="password-input-wrap">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Repetir senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <img
                      className="password-toggle-icon"
                      src={showConfirmPassword ? eyeShow : eyeHide}
                      alt={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      title={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </div>
                  {passwordMismatch && (
                    <small id="passwordMatchMessage" className="text-danger" style={{ display: 'block' }}>
                      As senhas não coincidem.
                    </small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">
                  Tipo de usuário
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  className="form-select"
                  required
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <div className="form-actions">
                <Link to="/login">Já tenho conta</Link>
                <Link to="/recuperar">Esqueci a senha</Link>
              </div>
            </form>
          </section>
        </main>
      </GuestGuard>
      <Footer />
    </div>
  );
}
