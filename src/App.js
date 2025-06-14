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
  const [activeSection, setActiveSection] = useState('home');

  // Estado para datos editables desde admin panel
  const [siteConfig, setSiteConfig] = useState({
    // Navegación
    siteName: 'Ekizr',
    
    // Hero Section - Todo editable
    heroContent: {
      badge: 'Ready to Innovate',
      title: 'Frontend',
      subtitle: 'Developer',
      profession: 'Network & Telecom Student',
      description: 'Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital.',
      techStack: ['React', 'Javascript', 'Node.js', 'Tailwind'],
      buttonText1: 'Projects',
      buttonText2: 'Contact'
    },
    
    // About Section
    aboutContent: {
      subtitle: 'Transforming ideas into digital experiences',
      name: 'Eki Zulfar Rachman',
      description: 'Seorang lulusan Teknik Jaringan Komputer dan Telekomunikasi yang memiliki ketertarikan besar dalam pengembangan Front-End. Saya berfokus pada menciptakan pengalaman digital yang menarik dan selalu berusaha memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.',
      profileImage: null,
      cvButtonText: 'Download CV',
      projectsButtonText: 'View Projects',
      stats: {
        projects: { count: 13, subtitle: 'Innovative web solutions crafted' },
        certificates: { count: 7, subtitle: 'Professional skills validated' },
        experience: { count: 3, subtitle: 'Continuous learning journey' }
      }
    },
    
    // Portfolio Section
    portfolioContent: {
      description: 'Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.',
      projects: [
        {
          title: 'Aritmatika Solver',
          description: 'Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal aritmatika secara otomatis...',
          image: null,
          tech: ['React', 'Node.js', 'MongoDB'],
          demoLink: '',
          detailsLink: ''
        },
        {
          title: 'AutoChat-Discord',
          description: 'AutoChat adalah solusi otomatis untuk mengirim pesan ke saluran Discord secara terjadwal. Pengguna dapat...',
          image: null,
          tech: ['Discord.js', 'Node.js', 'SQLite'],
          demoLink: '',
          detailsLink: ''
        },
        {
          title: 'Buku Catatan',
          description: 'Buku Catatan adalah website yang memungkinkan pengguna untuk membuat, menyimpan, dan mengelola...',
          image: null,
          tech: ['Vue.js', 'Firebase', 'Tailwind'],
          demoLink: '',
          detailsLink: ''
        }
      ]
    },
    
    // Contact Section
    contactContent: {
      subtitle: 'Got a question? Send me a message, and I\'ll get back to you soon.',
      formTitle: 'Get in Touch',
      formSubtitle: 'Have something to discuss? Send me a message and let\'s talk.',
      socialLinks: {
        github: '',
        linkedin: '',
        instagram: '',
        youtube: '',
        tiktok: ''
      },
      commentsEnabled: true,
      commentsList: [
        {
          id: 1,
          author: 'EKIZR',
          isAdmin: true,
          message: 'Thanks for visiting! Contact me if you need anything',
          date: 'Jun 2, 2025',
          avatar: 'E'
        },
        {
          id: 2,
          author: 'ilmonam',
          isAdmin: false,
          message: 'Good job bro',
          date: '1d ago',
          avatar: 'I'
        },
        {
          id: 3,
          author: 'Harukun',
          isAdmin: false,
          message: 'Hai',
          date: '1d ago',
          avatar: 'H'
        }
      ]
    },
    
    // System Status
    systemStatus: {
      enabled: true,
      title: 'Estado del Sistema',
      subtitle: 'Tu sistema está completamente funcional y listo para usar',
      description: 'Tu sistema está completamente funcional. Usa el panel de administración para gestionar tu contenido.',
      adminButtonText: 'Ir al Panel de Administración'
    }
  });

  // Tu lógica existente
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

  // Scroll suave y animaciones
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-20% 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          
          const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
          animatedElements.forEach((el, index) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [loading]);

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

  // Renderizar redes sociales solo si tienen contenido
  const renderSocialLinks = (socialLinks) => {
    const socialButtons = [];
    
    if (socialLinks.linkedin) {
      socialButtons.push(
        <a key="linkedin" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
           className="flex items-center p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition-all duration-300">
          <div className="text-2xl mr-3">💼</div>
          <div>
            <div className="font-medium text-blue-300">Let's Connect</div>
            <div className="text-sm text-blue-200">on LinkedIn</div>
          </div>
        </a>
      );
    }
    
    if (socialLinks.instagram) {
      socialButtons.push(
        <a key="instagram" href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
           className="flex items-center p-4 bg-pink-600/20 border border-pink-500/30 rounded-lg hover:border-pink-400 transition-all duration-300">
          <div className="text-2xl mr-3">📸</div>
          <div>
            <div className="font-medium text-pink-300">Instagram</div>
            <div className="text-sm text-pink-200">@ekizr</div>
          </div>
        </a>
      );
    }
    
    if (socialLinks.youtube) {
      socialButtons.push(
        <a key="youtube" href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
           className="flex items-center p-4 bg-red-600/20 border border-red-500/30 rounded-lg hover:border-red-400 transition-all duration-300">
          <div className="text-2xl mr-3">🎥</div>
          <div>
            <div className="font-medium text-red-300">Youtube</div>
            <div className="text-sm text-red-200">Ekizr_zulfar</div>
          </div>
        </a>
      );
    }
    
    if (socialLinks.github) {
      socialButtons.push(
        <a key="github" href={socialLinks.github} target="_blank" rel="noopener noreferrer"
           className="flex items-center p-4 bg-gray-600/20 border border-gray-500/30 rounded-lg hover:border-gray-400 transition-all duration-300">
          <div className="text-2xl mr-3">🐙</div>
          <div>
            <div className="font-medium text-gray-300">Github</div>
            <div className="text-sm text-gray-200">@Ekizr</div>
          </div>
        </a>
      );
    }
    
    if (socialLinks.tiktok) {
      socialButtons.push(
        <a key="tiktok" href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
           className="flex items-center p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all duration-300">
          <div className="text-2xl mr-3">🎵</div>
          <div>
            <div className="font-medium text-purple-300">Tiktok</div>
            <div className="text-sm text-purple-200">@ekii_zulfar</div>
          </div>
        </a>
      );
    }
    
    return socialButtons;
  };

  // Loading con tu estilo existente
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Tu sistema de rutas existente
  if (currentPath === '/admin') {
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  // Página principal con diseño similar a las imágenes
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Estilos para animaciones */}
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #8B5FBF 0%, #6366F1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .glass-card {
          background: rgba(15, 15, 30, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 95, 191, 0.2);
        }
        
        .hero-illustration {
          background: linear-gradient(135deg, rgba(139, 95, 191, 0.1), rgba(99, 102, 241, 0.1));
          border: 1px solid rgba(139, 95, 191, 0.2);
        }
      `}</style>

      {/* Navigation - Con estilos CSS personalizados */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-backdrop border-b border-gray-800/50" style={{ backgroundColor: 'rgba(10, 10, 26, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-xl font-bold text-gradient">
              {siteConfig.siteName}
            </div>
            
            {/* Desktop Navigation - DESKTOP Y TABLET (640px y más) */}
            <div className="hidden sm:flex items-center space-x-4 md:space-x-6 lg:space-x-8">
              {/* Navigation Links */}
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Portfolio', id: 'portfolio' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Admin Button Desktop */}
              <button
                onClick={navigateToAdmin}
                className="admin-btn"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Admin
              </button>
            </div>

            {/* Mobile SOLO - Admin Button + Hamburger Menu (MENOS de 640px) */}
            <div className="flex sm:hidden items-center space-x-3">
              {/* Mobile Admin Button */}
              <button
                onClick={navigateToAdmin}
                className="admin-btn"
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
              >
                Admin
              </button>
              
              {/* Hamburger Menu Button - SOLO MOBILE */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-colors p-2"
                style={{ color: '#d1d5db' }}
                onMouseEnter={(e) => e.target.style.color = '#8B5FBF'}
                onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Desplegable - SOLO MOBILE (menos de 640px) */}
          {isMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-800/50">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Portfolio', id: 'portfolio' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block px-4 py-3 transition-all duration-300 rounded-lg mx-2 ${
                    activeSection === item.id 
                      ? 'text-[#8B5FBF] bg-[#8B5FBF]/10' 
                      : 'text-gray-300 hover:text-[#8B5FBF] hover:bg-[#8B5FBF]/10'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Siguiendo el diseño de las imágenes */}
      <section id="home" className="min-h-screen flex items-center px-6 pt-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-on-scroll">
              {siteConfig.heroContent.badge && (
                <div className="inline-flex items-center px-4 py-2 glass-card rounded-full text-[#8B5FBF] text-sm">
                  <span className="mr-2">⚡</span>
                  {siteConfig.heroContent.badge}
                </div>
              )}
              
              <div>
                <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6">
                  <span className="text-white">{siteConfig.heroContent.title}</span>
                  <br />
                  <span className="gradient-text">{siteConfig.heroContent.subtitle}</span>
                </h1>
                
                {siteConfig.heroContent.profession && (
                  <p className="text-gray-400 text-xl mb-6">
                    {siteConfig.heroContent.profession}
                  </p>
                )}
                
                {siteConfig.heroContent.description && (
                  <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                    {siteConfig.heroContent.description}
                  </p>
                )}
              </div>

              {/* Tech Stack Pills */}
              {siteConfig.heroContent.techStack && siteConfig.heroContent.techStack.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {siteConfig.heroContent.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 glass-card rounded-lg text-gray-300 hover:border-[#8B5FBF]/50 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#portfolio"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white rounded-lg hover:shadow-lg hover:shadow-[#8B5FBF]/25 transition-all duration-300"
                >
                  <span className="mr-2">📁</span>
                  {siteConfig.heroContent.buttonText1}
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 glass-card text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                >
                  <span className="mr-2">📧</span>
                  {siteConfig.heroContent.buttonText2}
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-6 pt-4">
                {siteConfig.contactContent.socialLinks.github && (
                  <a href={siteConfig.contactContent.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                     className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-gray-400 hover:text-[#8B5FBF] transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.contactContent.socialLinks.linkedin && (
                  <a href={siteConfig.contactContent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-gray-400 hover:text-[#8B5FBF] transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.contactContent.socialLinks.instagram && (
                  <a href={siteConfig.contactContent.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-gray-400 hover:text-[#8B5FBF] transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Hero Illustration - Similar a las imágenes */}
            <div className="hidden lg:flex justify-center animate-on-scroll">
              <div className="relative w-full max-w-lg">
                <div className="hero-illustration aspect-square rounded-3xl p-8 flex items-center justify-center">
                  {/* Illustration content - Puedes reemplazar con imagen real */}
                  <div className="w-full h-full bg-gradient-to-br from-[#8B5FBF]/20 to-[#6366F1]/20 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">💻</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 glass-card rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B5FBF] to-[#6366F1] rounded-lg"></div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 glass-card rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#6366F1] to-[#8B5FBF] rounded-full"></div>
                </div>
                <div className="absolute top-8 -left-8 w-8 h-8 glass-card rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#8B5FBF] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6">About Me</h2>
            {siteConfig.aboutContent.subtitle && (
              <p className="text-[#8B5FBF] text-lg">
                ⚡ {siteConfig.aboutContent.subtitle} ⚡
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-on-scroll">
              <h3 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                Hello, I'm
                <br />
                <span className="gradient-text">{siteConfig.aboutContent.name}</span>
              </h3>
              
              {siteConfig.aboutContent.description && (
                <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                  {siteConfig.aboutContent.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white rounded-lg hover:shadow-lg hover:shadow-[#8B5FBF]/25 transition-all duration-300">
                  <span className="mr-2">📄</span>
                  {siteConfig.aboutContent.cvButtonText}
                </button>
                <a
                  href="#portfolio"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 glass-card text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                >
                  <span className="mr-2">👨‍💻</span>
                  {siteConfig.aboutContent.projectsButtonText}
                </a>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center animate-on-scroll">
              <div className="relative">
                <div className="w-80 h-80 rounded-full hero-illustration flex items-center justify-center overflow-hidden">
                  {siteConfig.aboutContent.profileImage ? (
                    <img 
                      src={siteConfig.aboutContent.profileImage} 
                      alt={siteConfig.aboutContent.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#8B5FBF]/20 to-[#6366F1]/20 rounded-full flex items-center justify-center">
                      <div className="text-8xl">👨‍💻</div>
                    </div>
                  )}
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 glass-card rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#8B5FBF] rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 glass-card rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#6366F1] rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-8 text-center hover:border-[#8B5FBF]/50 transition-all duration-300 animate-on-scroll">
              <div className="text-4xl md:text-6xl font-bold gradient-text mb-3">{siteConfig.aboutContent.stats.projects.count}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Projects</div>
              <div className="text-gray-500 text-xs">{siteConfig.aboutContent.stats.projects.subtitle}</div>
              <div className="mt-4 text-2xl">↗</div>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center hover:border-[#8B5FBF]/50 transition-all duration-300 animate-on-scroll">
              <div className="text-4xl md:text-6xl font-bold gradient-text mb-3">{siteConfig.aboutContent.stats.certificates.count}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Certificates</div>
              <div className="text-gray-500 text-xs">{siteConfig.aboutContent.stats.certificates.subtitle}</div>
              <div className="mt-4 text-2xl">🏆</div>
            </div>
            
            <div className="glass-card rounded-xl p-8 text-center hover:border-[#8B5FBF]/50 transition-all duration-300 animate-on-scroll">
              <div className="text-4xl md:text-6xl font-bold gradient-text mb-3">{siteConfig.aboutContent.stats.experience.count}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">Years of Experience</div>
              <div className="text-gray-500 text-xs">{siteConfig.aboutContent.stats.experience.subtitle}</div>
              <div className="mt-4 text-2xl">🌍</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 px-6 bg-[#050510]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6">Portfolio Showcase</h2>
            {siteConfig.portfolioContent.description && (
              <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
                {siteConfig.portfolioContent.description}
              </p>
            )}
          </div>

          {/* Portfolio Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card rounded-xl p-8 text-center border-[#8B5FBF]/30 bg-gradient-to-br from-[#8B5FBF]/10 to-[#6366F1]/10 animate-on-scroll">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-white">Projects</h3>
            </div>
            <div className="glass-card rounded-xl p-8 text-center hover:border-[#8B5FBF]/50 transition-all duration-300 animate-on-scroll">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-300">Certificates</h3>
            </div>
            <div className="glass-card rounded-xl p-8 text-center hover:border-[#8B5FBF]/50 transition-all duration-300 animate-on-scroll">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-300">Tech Stack</h3>
            </div>
          </div>

          {/* Projects Grid */}
          {siteConfig.portfolioContent.projects && siteConfig.portfolioContent.projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteConfig.portfolioContent.projects.map((project, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl overflow-hidden hover:border-[#8B5FBF]/50 transition-all duration-500 hover:transform hover:scale-105 animate-on-scroll"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Project Image/Preview */}
                  <div className="h-48 bg-gradient-to-br from-[#8B5FBF]/20 to-[#6366F1]/20 flex items-center justify-center border-b border-gray-700/50">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl">📱</div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{project.description}</p>
                    
                    {/* Tech Stack */}
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#8B5FBF]/20 text-[#8B5FBF] text-xs rounded-full border border-[#8B5FBF]/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {project.demoLink ? (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center py-3 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white text-sm rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Live Demo ↗
                        </a>
                      ) : (
                        <button className="flex-1 py-3 bg-gray-700/50 text-gray-500 text-sm rounded-lg cursor-not-allowed">
                          Live Demo
                        </button>
                      )}
                      {project.detailsLink ? (
                        <a
                          href={project.detailsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 glass-card text-gray-300 hover:text-white text-sm rounded-lg transition-all duration-300"
                        >
                          Details →
                        </a>
                      ) : (
                        <button className="px-6 py-3 glass-card text-gray-500 text-sm rounded-lg cursor-not-allowed">
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section - Similar al diseño de las imágenes */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6">Contact Me</h2>
            {siteConfig.contactContent.subtitle && (
              <p className="text-gray-300 text-lg">
                {siteConfig.contactContent.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-2xl font-bold gradient-text mb-2">{siteConfig.contactContent.formTitle}</h3>
                <div className="flex items-center text-[#8B5FBF] mb-8">
                  <span className="mr-2">🔗</span>
                  <span className="text-sm">{siteConfig.contactContent.formSubtitle}</span>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Form submitted');
                }}>
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-400">👤</span>
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        className="w-full pl-12 pr-4 py-4 glass-card rounded-lg text-white placeholder-gray-400 focus:border-[#8B5FBF]/50 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-400">📧</span>
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        className="w-full pl-12 pr-4 py-4 glass-card rounded-lg text-white placeholder-gray-400 focus:border-[#8B5FBF]/50 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-400">💬</span>
                      <textarea
                        rows="6"
                        placeholder="Your Message"
                        required
                        className="w-full pl-12 pr-4 py-4 glass-card rounded-lg text-white placeholder-gray-400 focus:border-[#8B5FBF]/50 focus:outline-none transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white rounded-lg hover:shadow-lg hover:shadow-[#8B5FBF]/25 transition-all duration-300 font-medium"
                  >
                    <span className="mr-2">📤</span>
                    Send Message
                  </button>
                </form>
              </div>

              {/* Connect With Me */}
              <div className="mt-8 glass-card rounded-xl p-6">
                <div className="flex items-center text-white mb-6">
                  <span className="mr-2">⚡</span>
                  <h4 className="text-lg font-semibold">Connect With Me</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {renderSocialLinks(siteConfig.contactContent.socialLinks)}
                </div>
              </div>
            </div>

            {/* Comments Section - Siguiendo diseño de imagen */}
            <div className="animate-on-scroll">
              <div className="glass-card rounded-xl p-8">
                <div className="flex items-center mb-8">
                  <div className="text-xl mr-3">💬</div>
                  <h3 className="text-xl font-bold text-white">
                    Comments ({siteConfig.contactContent.commentsList.length})
                  </h3>
                </div>

                {/* Comment Form */}
                <form className="space-y-4 mb-8" onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Comment submitted');
                }}>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-gray-400 focus:border-[#8B5FBF]/50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Write your message here..."
                      required
                      className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-gray-400 focus:border-[#8B5FBF]/50 focus:outline-none transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Profile Photo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-6 text-center hover:border-[#8B5FBF]/50 transition-all duration-300">
                      <div className="text-3xl mb-2">📸</div>
                      <button
                        type="button"
                        className="px-6 py-2 bg-[#8B5FBF]/20 border border-[#8B5FBF]/30 text-[#8B5FBF] rounded-lg hover:bg-[#8B5FBF]/30 transition-all duration-300"
                      >
                        Choose Profile Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white rounded-lg hover:shadow-lg hover:shadow-[#8B5FBF]/25 transition-all duration-300 font-medium"
                  >
                    ✅ Post Comment
                  </button>
                </form>

                {/* Comments List */}
                {siteConfig.contactContent.commentsList.length > 0 && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex items-center text-gray-400 mb-4">
                      <span className="mr-2">📌</span>
                      <span className="text-sm">PINNED COMMENT</span>
                    </div>
                    {siteConfig.contactContent.commentsList.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-700/50 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${comment.isAdmin ? 'bg-gradient-to-br from-[#8B5FBF] to-[#6366F1]' : 'bg-gray-600'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`font-medium ${comment.isAdmin ? 'text-[#8B5FBF]' : 'text-gray-300'}`}>
                                {comment.author}
                              </span>
                              {comment.isAdmin && (
                                <span className="px-2 py-1 bg-[#8B5FBF]/20 text-[#8B5FBF] text-xs rounded border border-[#8B5FBF]/30">Admin</span>
                              )}
                              <span className="text-gray-500 text-xs">{comment.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{comment.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      {siteConfig.systemStatus.enabled && (
        <section className="py-20 px-6 bg-[#050510]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h3 className="text-3xl font-bold text-white mb-4">{siteConfig.systemStatus.title}</h3>
              <p className="text-gray-400">{siteConfig.systemStatus.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="glass-card rounded-xl p-6 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 animate-on-scroll">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-green-300">✅ Base de Datos</h4>
                </div>
                <p className="text-green-200 text-sm">Conectada y funcionando</p>
              </div>

              <div className="glass-card rounded-xl p-6 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 animate-on-scroll">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-blue-300">🚀 API</h4>
                </div>
                <p className="text-blue-200 text-sm">Todos los endpoints activos</p>
              </div>

              <div className="glass-card rounded-xl p-6 border-[#8B5FBF]/30 bg-gradient-to-br from-[#8B5FBF]/10 to-[#6366F1]/5 animate-on-scroll">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-[#8B5FBF] rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-[#8B5FBF]">🔐 Admin Panel</h4>
                </div>
                <p className="text-purple-200 text-sm">Sistema de login listo</p>
              </div>

              <div className="glass-card rounded-xl p-6 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 animate-on-scroll">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-semibold text-yellow-300">📁 Upload</h4>
                </div>
                <p className="text-yellow-200 text-sm">Sistema de archivos configurado</p>
              </div>
            </div>

            <div className="text-center animate-on-scroll">
              <p className="text-gray-300 mb-8 text-lg">
                {siteConfig.systemStatus.description}
              </p>
              <button
                onClick={navigateToAdmin}
                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#8B5FBF] to-[#6366F1] text-white rounded-xl hover:shadow-xl hover:shadow-[#8B5FBF]/25 transition-all duration-300 transform hover:scale-105 font-medium text-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{siteConfig.systemStatus.adminButtonText}</span>
                <svg className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0a0a1a] border-t border-gray-800/50 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center animate-on-scroll">
          <div className="text-2xl font-bold gradient-text mb-6">
            {siteConfig.siteName}
          </div>
          <p className="text-gray-400 mb-8">
            © 2024 {siteConfig.siteName}. Sistema con panel de administración completo.
          </p>
          <div className="flex justify-center space-x-8">
            {siteConfig.contactContent.socialLinks.github && (
              <a href={siteConfig.contactContent.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#8B5FBF] transition-colors">GitHub</a>
            )}
            {siteConfig.contactContent.socialLinks.linkedin && (
              <a href={siteConfig.contactContent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#8B5FBF] transition-colors">LinkedIn</a>
            )}
            {siteConfig.contactContent.socialLinks.twitter && (
              <a href={siteConfig.contactContent.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#8B5FBF] transition-colors">Twitter</a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;