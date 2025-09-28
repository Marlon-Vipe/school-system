import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('token');
  
  console.log('ProtectedRoute: Checking authentication...');
  console.log('ProtectedRoute: Token exists:', !!isAuthenticated);
  console.log('ProtectedRoute: Token value:', isAuthenticated);
  
  // Para desarrollo, siempre permitir acceso
  console.log('ProtectedRoute: Development mode - allowing access');
  return <>{children}</>;
  
  // Código original comentado para desarrollo
  /*
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: Authenticated, rendering children');
  return <>{children}</>;
  */
};

export default ProtectedRoute;
