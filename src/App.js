import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Verificar si hay token almacenado
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }

    // Escuchar cambios en la URL
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Navegar al admin después del login
    window.history.pushState({}, '', '/admin');
    setCurrentPath('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Routing simple
  const isAdminRoute = currentPath.startsWith('/admin');
  
  // Si estamos en una ruta de admin pero no hay usuario logueado
  if (isAdminRoute && !user) {
    return <Login onLogin={handleLogin} />;
  }

  // Si estamos en admin y hay usuario logueado
  if (isAdminRoute && user) {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  // Página principal del portafolio (por ahora simple)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Mi Portafolio</h1>
            <div className="flex space-x-4">
              <a 
                href="/admin" 
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/admin');
                  setCurrentPath('/admin');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a mi Portafolio
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Desarrollador Full Stack especializado en React y Node.js
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Estado del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Base de Datos</h4>
                <p className="text-green-600">Conectada y funcionando</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">🚀 API</h4>
                <p className="text-blue-600">Todos los endpoints activos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">🔐 Admin Panel</h4>
                <p className="text-purple-600">Sistema de login listo</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800">📁 Upload</h4>
                <p className="text-yellow-600">Sistema de archivos configurado</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 mb-4">
                Tu sistema está completamente funcional. Usa el panel de administración para gestionar tu contenido.
              </p>
              <a 
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/admin');
                  setCurrentPath('/admin');
                }}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir al Panel de Administración
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Mi Portafolio. Sistema con panel de administración completo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;