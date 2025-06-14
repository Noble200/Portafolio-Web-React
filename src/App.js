import React, { useState, useEffect } from 'react';
import './App.css';

// Importa tus componentes existentes
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }

    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPath('/admin');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentPath('/admin');
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Routing
  const isAdminRoute = currentPath.startsWith('/admin');
  
  if (isAdminRoute && !user) {
    return <Login onLogin={handleLogin} />;
  }

  if (isAdminRoute && user) {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  // Portfolio principal
  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-dark-primary/90 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gradient">
              Mi Portafolio
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                Sobre mí
              </a>
              <a href="#projects" className="text-gray-300 hover:text-white transition-colors">
                Proyectos
              </a>
              <a href="#skills" className="text-gray-300 hover:text-white transition-colors">
                Habilidades
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contacto
              </a>
              <button 
                onClick={navigateToAdmin} 
                className="btn-primary flex items-center space-x-2 shadow-glow hover:shadow-glow-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark-primary border-t border-gray-800">
            <div className="container-custom py-4 space-y-3">
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors">
                Sobre mí
              </a>
              <a href="#projects" className="block text-gray-300 hover:text-white transition-colors">
                Proyectos
              </a>
              <a href="#skills" className="block text-gray-300 hover:text-white transition-colors">
                Habilidades
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition-colors">
                Contacto
              </a>
              <button onClick={navigateToAdmin} className="btn-primary w-full flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="container-custom text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hola, soy{' '}
              <span className="text-gradient">Tu Nombre</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Desarrollador Full Stack especializado en crear experiencias web modernas y funcionales
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#projects" className="btn-primary">
                Ver Proyectos
              </a>
              <a href="#contact" className="btn-secondary">
                Contactar
              </a>
            </div>
          </div>

          {/* Estado del Sistema */}
          <div className="glass-effect rounded-xl p-8 max-w-5xl mx-auto border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-8">
              <span className="text-gradient">Estado del Sistema</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-green-300">Base de Datos</h4>
                </div>
                <p className="text-green-200 text-sm">Conectada y funcionando</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-blue-300">API</h4>
                </div>
                <p className="text-blue-200 text-sm">Todos los endpoints activos</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-purple-300">Admin Panel</h4>
                </div>
                <p className="text-purple-200 text-sm">Sistema de login listo</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-yellow-300">Upload</h4>
                </div>
                <p className="text-yellow-200 text-sm">Sistema de archivos configurado</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-300 mb-6">
                Tu sistema está completamente funcional. Usa el panel de administración para gestionar tu contenido.
              </p>
              <button onClick={navigateToAdmin} className="btn-primary shadow-glow-lg hover:scale-105 transform transition-all duration-300 flex items-center justify-center space-x-3 text-base py-4 px-8">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Ir al Panel de Administración</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-dark-secondary/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Sobre Mí</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Conoce más sobre mi experiencia, pasión por la tecnología y enfoque en el desarrollo web
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="card">
                <h3 className="text-2xl font-bold mb-4">Mi Historia</h3>
                <p className="text-gray-300 mb-4">
                  Con más de X años de experiencia en desarrollo web, me especializo en crear 
                  soluciones digitales que combinan funcionalidad, rendimiento y diseño atractivo.
                </p>
                <p className="text-gray-300 mb-6">
                  Mi pasión por la tecnología me impulsa a mantenerme actualizado con las últimas 
                  tendencias y mejores prácticas del desarrollo web moderno.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Innovador
                  </span>
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Colaborativo
                  </span>
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Orientado a resultados
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card hover:shadow-glow">
                <h4 className="text-xl font-bold mb-2">Frontend Development</h4>
                <p className="text-gray-300 text-sm">React, Vue.js, TypeScript, Tailwind CSS</p>
              </div>
              <div className="card hover:shadow-glow">
                <h4 className="text-xl font-bold mb-2">Backend Development</h4>
                <p className="text-gray-300 text-sm">Node.js, Express, Python, PostgreSQL</p>
              </div>
              <div className="card hover:shadow-glow">
                <h4 className="text-xl font-bold mb-2">DevOps & Cloud</h4>
                <p className="text-gray-300 text-sm">AWS, Docker, Railway, Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Portfolio Showcase</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Explora mi trabajo a través de proyectos que demuestran mi experiencia técnica y creatividad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Platform",
                description: "Plataforma completa de comercio electrónico con panel de administración",
                tech: ["React", "Node.js", "PostgreSQL"],
                icon: "🛒"
              },
              {
                title: "Task Manager App",
                description: "Aplicación de gestión de tareas con colaboración en tiempo real",
                tech: ["Vue.js", "Firebase", "Tailwind"],
                icon: "📱"
              },
              {
                title: "Portfolio Website",
                description: "Sitio web de portfolio con panel de administración integrado",
                tech: ["React", "Express", "Railway"],
                icon: "💼"
              }
            ].map((project, index) => (
              <div key={index} className="card group hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all duration-300">
                  <div className="text-6xl animate-float">{project.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-xs border border-primary-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary text-xs">
                    Ver Demo
                  </button>
                  <button className="btn-secondary text-xs">
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-dark-secondary/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Contacto</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              ¿Tienes un proyecto en mente? Me encantaría conocer más sobre tu idea
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-300">contacto@ejemplo.com</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold mb-2">LinkedIn</h3>
                  <p className="text-gray-300">@tu-perfil</p>
                </div>
              </div>
              
              <button className="btn-primary w-full shadow-glow-lg">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-primary border-t border-gray-800 py-12">
        <div className="container-custom text-center">
          <div className="text-2xl font-bold text-gradient mb-4">
            Mi Portafolio
          </div>
          <p className="text-gray-400 mb-6">
            © 2024 Mi Portafolio. Sistema con panel de administración completo.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;