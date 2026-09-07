import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { getStoredUser } from '../utils/auth';
import { cancelMentorship } from '../services/api';
import { fetchStudentMentorships } from '../services/studentServices'

export default function DashboardAlunoPage() {
  const user = getStoredUser();
  const [mentorias, setMentorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadMentorias = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchStudentMentorships(user.id);
      setMentorias(data || []);
    } catch (err) {
      console.error('Erro ao carregar mentorias do aluno:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMentorias();
  }, [loadMentorias]);

  async function handleCancelarMentoria(id) {
    const result = await Swal.fire({
      title: 'Cancelar mentoria?',
      text: 'Tem certeza que deseja cancelar esta mentoria?',
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
      await loadMentorias();
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

  const sessoesAgendadas = mentorias.filter((m) => m.status === 'ACCEPTED').length;
  const totalProfessores = new Set(mentorias.map((m) => m.teacherId)).size;

  return (
    <AuthGuard requiredRole="Aluno">
      <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Bem-vindo(a), {user?.nome || 'Aluno'}!
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
                  <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{totalProfessores}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#637588] text-sm font-normal leading-normal">Professores</p>
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
                        <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Professor</th>
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
                          Nenhum professor definido
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Minhas Mentorias
              </h2>
              <div id="minhasMentorias" className="px-4 py-3">
                {loading ? (
                  <p className="text-gray-500">Carregando mentorias...</p>
                ) : mentorias.length === 0 ? (
                  <p className="text-gray-500">Você ainda não possui mentorias solicitadas.</p>
                ) : (
                  mentorias.map((m) => {
                    const statusColor =
                      m.status === 'ACCEPTED'
                        ? 'text-green-600'
                        : m.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600';

                    const statusText =
                      m.status === 'ACCEPTED'
                        ? 'Aceita'
                        : m.status === 'PENDING'
                        ? 'Pendente'
                        : m.status === 'CANCELLED'
                        ? 'Cancelada'
                        : 'Recusada';

                    return (
                      <div
                        key={m.id}
                        className="border rounded-xl p-4 mb-4 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={m.teacherPhoto || '/assets/images/default.webp'}
                            alt={m.teacherName}
                            className="w-16 h-16 rounded-full object-cover border"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/default.webp';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{m.teacherName}</h3>
                            <p className="text-sm text-gray-500">{m.disciplina || 'Mentoria Geral'}</p>
                            <small className={`${statusColor} font-medium`}>{statusText}</small>
                          </div>
                        </div>

                        {m.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancelarMentoria(m.id)}
                            disabled={cancellingId === m.id}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
                          >
                            {cancellingId === m.id ? 'Cancelando...' : 'Cancelar Mentoria'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

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
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Envie uma mensagem ao Professor</p>
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
                    <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Inicie uma videochamada com seu Professor</p>
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
