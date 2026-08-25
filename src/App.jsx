import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import CatalogoPage from './pages/CatalogoPage';
import PerfilProfessorPage from './pages/PerfilProfessorPage';
import ContatoPage from './pages/ContatoPage';
import DashboardAlunoPage from './pages/DashboardAlunoPage';
import DashboardProfessorPage from './pages/DashboardProfessorPage';
import VideoCallPage from './pages/VideoCallPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar" element={<RecuperarSenhaPage />} />
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="/perfil" element={<PerfilProfessorPage />} />
      <Route path="/contato" element={<ContatoPage />} />
      <Route path="/dashboard" element={<DashboardAlunoPage />} />
      <Route path="/dashboard-professor" element={<DashboardProfessorPage />} />
      <Route path="/videocall" element={<VideoCallPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
