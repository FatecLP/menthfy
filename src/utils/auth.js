export function getStoredUser() {
  const usuario = sessionStorage.getItem('usuario');
  if (!usuario || usuario === 'null' || usuario === '') {
    return null;
  }
  return {
    id: sessionStorage.getItem('userId'),
    nome: usuario,
    tipoUsuario: sessionStorage.getItem('tipoUsuario'),
    email: sessionStorage.getItem('userEmail'),
  };
}

export function setStoredUser(user) {
  if (!user) {
    clearStoredUser();
    return;
  }
  sessionStorage.setItem('userId', user.id);
  sessionStorage.setItem('usuario', user.nome);
  sessionStorage.setItem('tipoUsuario', user.tipoUsuario);
  sessionStorage.setItem('userEmail', user.email);
}

export function clearStoredUser() {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('usuario');
  sessionStorage.removeItem('tipoUsuario');
  sessionStorage.removeItem('userEmail');
}

export function getDashboardRoute(tipoUsuario) {
  const tipo = (tipoUsuario || '').toLowerCase();
  return tipo === 'professor' ? '/dashboard-professor' : '/dashboard';
}
