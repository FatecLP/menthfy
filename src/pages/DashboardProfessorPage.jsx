import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { getStoredUser } from '../utils/auth';
import { fetchTeacherMentorships, acceptMentorship, cancelMentorship } from '../services/api';

export default function DashboardProfessorPage() {
  const user = getStoredUser();
  const [mentorias, setMentorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadSolicitacoes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchTeacherMentorships(user.id);
      setMentorias(data || []);
    } catch (err) {
      console.error('Erro ao buscar solicitações do professor:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSolicitacoes();
  }, [loadSolicitacoes]);

  async function handleAceitarMentoria(id) {
    setAcceptingId(id);
    try {
      await acceptMentorship(id);
      await Swal.fire({
        icon: 'success',
        title: 'Mentoria aceita!',
        text: 'A mentoria foi aceita com sucesso.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSolicitacoes();
    } catch (err) {
      console.error('Erro ao aceitar mentoria:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Erro ao aceitar a mentoria.',
      });
    } finally {
      setAcceptingId(null);
    }
  }

  async function handleCancelarMentoria(id) {
    const result = await Swal.fire({
      title: 'Cancelar mentoria?',
      text: 'Tem certeza que deseja cancelar/recusar esta mentoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar',
    });

    if (!result.isConfirmed) return;

    setCancellingId(id);
    try {
      await cancelMentorship(id);
      await Swal.fire({
        icon: 'success',
        title: 'Mentoria cancelada!',
        text: 'A mentoria foi cancelada com sucesso.',
        timer: 1500,
        showConfirmButton: false,
      });
      await loadSolicitacoes();
    } catch (err) {
      console.error('Erro ao cancelar mentoria:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Erro ao cancelar a mentoria.',
      });
    } finally {
      setCancellingId(null);
    }
  }

  const pendentes = mentorias.filter((m) => m.status === 'PENDING');
  const aceitas = mentorias.filter((m) => m.status === 'ACCEPTED');
  const sessoesAgendadas = aceitas.length;
  const totalAlunos = new Set(mentorias.map((m) => m.studentId)).size;

  return (
    <AuthGuard requiredRole="Professor">
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p id="welcomeMsg" className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Bem-vindo(a), {user?.nome || 'Professor'}!
                </p>
              </div>

              <div className="flex flex-wrap gap-3 px-4 py-3">
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{sessoesAgendadas}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Sessões agendadas</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{totalAlunos}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Alunos</p>
                  </div>
                </div>
                <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-[#dce0e5] p-3 items-start">
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{sessoesAgendadas}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Próximas Sessões</p>
                  </div>
                </div>
              </div>

              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Próximas sessões
              </h2>
              <div className="px-4 py-3">
                <div className="flex overflow-hidden rounded-xl border border-[#dce0e5] bg-white">
                  <table className="flex-1 w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Data</th>
                        <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Tempo</th>
                        <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Matéria</th>
                        <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Alunos</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-t-[#dce0e5]">
                        <td className="h-[72px] px-4 py-2 text-[#637588] text-sm font-normal leading-normal">
                          Nenhuma data definida
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#637588] text-sm font-normal leading-normal">
                          Nenhum horário definido
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#637588] text-sm font-normal leading-normal">
                          Nenhuma matéria definida
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#637588] text-sm font-normal leading-normal">
                          Nenhum aluno definido
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h2 className="text-[#111418] text-[22px] font-bold px-4 pb-3 pt-5">Solicitações Pendentes</h2>
              <div id="solicitacoesMentoria" className="px-4 py-3">
                {loading ? (
                  <p className="text-gray-500">Carregando solicitações...</p>
                ) : pendentes.length === 0 ? (
                  <p className="text-gray-500">Nenhuma solicitação pendente.</p>
                ) : (
                  pendentes.map((m) => (
                    <div
                      key={m.id}
                      className="border rounded-lg p-3 mb-3 flex justify-between items-center bg-white shadow-sm"
                    >
                      <div>
                        <strong>{m.studentName || 'Aluno'}</strong>
                        <br />
                        <span className="text-sm text-gray-600">Solicitou mentoria</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelarMentoria(m.id)}
                          disabled={cancellingId === m.id || acceptingId === m.id}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === m.id ? 'Cancelando...' : 'Recusar'}
                        </button>
                        <button
                          onClick={() => handleAceitarMentoria(m.id)}
                          disabled={acceptingId === m.id || cancellingId === m.id}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer font-medium text-sm disabled:opacity-50"
                        >
                          {acceptingId === m.id ? 'Aceitando...' : 'Aceitar'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {aceitas.length > 0 && (
                <>
                  <h2 className="text-[#111418] text-[22px] font-bold px-4 pb-3 pt-5">Mentorias Confirmadas</h2>
                  <div className="px-4 py-3">
                    {aceitas.map((m) => (
                      <div
                        key={m.id}
                        className="border rounded-xl p-4 mb-3 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition"
                      >
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{m.studentName || 'Aluno'}</h3>
                          <span className="text-green-600 text-sm font-medium">Aceita / Confirmada</span>
                        </div>
                        <button
                          onClick={() => handleCancelarMentoria(m.id)}
                          disabled={cancellingId === m.id}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === m.id ? 'Cancelando...' : 'Cancelar Mentoria'}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Comunicação
              </h2>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                <div
                  className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                  data-icon="ChatCircleDots"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Mensagens</p>
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Envie uma mensagem para um Aluno</p>
                </div>
              </div>

              <Link to="/videocall" className="no-underline text-inherit" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 cursor-pointer hover:bg-[#f9fafb] rounded-lg transition">
                  <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12" data-icon="Video">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Videochamada</p>
                    <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Inicie uma videochamada com seu Aluno</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
