import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import HomePage from '../pages/HomePage';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const CadastroPage = lazy(() => import('../pages/CadastroPage'));
const RecuperarSenhaPage = lazy(() => import('../pages/RecuperarSenhaPage'));
const CatalogoPage = lazy(() => import('../pages/CatalogoPage'));
const PerfilProfessorPage = lazy(() => import('../pages/PerfilProfessorPage'));
const ContatoPage = lazy(() => import('../pages/ContatoPage'));
const DashboardAlunoPage = lazy(() => import('../pages/DashboardAlunoPage'));
const DashboardProfessorPage = lazy(() => import('../pages/DashboardProfessorPage'));
const VideoCallPage = lazy(() => import('../pages/VideoCallPage'));

export default function AppRoutes() {
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner variant="fullscreen" label="Carregando página..." />}>
      <div key={pathname} className="animate-page-enter min-h-screen flex flex-col">
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
      </div>
    </Suspense>
  );
}
