import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getStoredUser, getDashboardRoute } from '../utils/auth';

export default function AuthGuard({ children, requiredRole }) {
  const user = getStoredUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Acesso restrito',
        text: 'Você precisa estar logado para acessar esta página.',
        showCancelButton: true,
        confirmButtonText: 'Fazer Login',
        cancelButtonText: 'Criar Conta',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate('/cadastro');
        } else {
          navigate('/');
        }
      });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (requiredRole && user.tipoUsuario?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to={getDashboardRoute(user.tipoUsuario)} replace />;
  }

  return children;
}
