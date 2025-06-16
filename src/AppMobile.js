import React, { useState, useEffect } from 'react';
import './App.css';

// Importa tus componentes existentes
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

const AppMobile = () => {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Estado para datos editables desde admin panel - MISMO QUE DESKTOP
  const [siteConfig, setSiteConfig] = useState({
    siteName: 'Ekizr',
    
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
    
    portfolioContent: {
      description: 'Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.',
      projects: []
    },

    contactContent: {
      title: 'Contact Me',
      subtitle: 'Got a question? Send me a message, and I\'ll get back to you soon.',
      formTitle: 'Get in Touch',
      formSubtitle: 'Have something to discuss? Send me a message and let\'s talk.',
      connectTitle: 'Connect With Me',
      socialLinks: {
        linkedin: { url: '#', username: '@ekizr' },
        instagram: { url: '#', username: '@ekizr' },
        youtube: { url: '#', username: 'Eki Zulfar' },
        github: { url: '#', username: '@EKIZR' },
        tiktok: { url: '#', username: '@eki_zulfar' }
      }
    }
  });

  // Misma lógica que desktop pero adaptada para móvil
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

  // Cargar datos desde API
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const projectsResponse = await fetch('/api/projects');
        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          setSiteConfig(prev => ({
            ...prev,
            portfolioContent: { ...prev.portfolioContent, projects }
          }));
        }

        const configResponse = await fetch('/api/config');
        if (configResponse.ok) {
          const config = await configResponse.json();
          setSiteConfig(prev => ({ ...prev, ...config }));
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      }
    };

    loadPortfolioData();
  }, []);

  // Manejo del scroll para móvil
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      
      // Detectar sección activa
      const sections = ['home', 'about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 80;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const navigateToSection = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToAdmin = () => {
    setCurrentPath('/admin');
    window.history.pushState({}, '', '/admin');
  };

  // Loading screen móvil
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0b1e] to-[#1a1b2e] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-4">
            {siteConfig.siteName}
          </div>
          <div className="w-8 h-8 border-4 border-[#8b5fbf]/30 border-t-[#8b5fbf] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Si está en admin, mostrar panel
  if (currentPath === '/admin') {
    return user ? (
      <AdminPanel user={user} onLogout={handleLogout} />
    ) : (
      <Login onLogin={handleLogin} />
    );
  }

  // PORTFOLIO MOBILE - OPTIMIZADO PARA MÓVILES
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0b1e] via-[#1a1b2e] to-[#0a0b1e] text-white overflow-x-hidden">
      {/* Background Pattern Mobile */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8b5fbf]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#6366f1]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Mobile Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0b1e]/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
              {siteConfig.siteName}
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="w-8 h-8 flex flex-col justify-center items-center space-y-1 group"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-[#1a1b2e]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
              <div className="px-4 py-6 space-y-4">
                {['Home', 'About', 'Portfolio', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => navigateToSection(item.toLowerCase())}
                    className={`block w-full text-left py-3 px-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                      activeSection === item.toLowerCase()
                        ? 'text-[#8b5fbf] bg-[#8b5fbf]/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section Mobile */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center relative z-10 w-full">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#8b5fbf]/10 border border-[#8b5fbf]/30 mb-8 backdrop-blur-sm">
            <span className="text-sm text-[#8b5fbf] font-medium">{siteConfig.heroContent.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4 leading-tight">
            {siteConfig.heroContent.title}
          </h1>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-6">
            {siteConfig.heroContent.subtitle}
          </h2>

          {/* Profession */}
          <p className="text-lg text-gray-400 mb-8">
            {siteConfig.heroContent.profession}
          </p>

          {/* Description */}
          <p className="text-base text-gray-300 mb-12 leading-relaxed px-2">
            {siteConfig.heroContent.description}
          </p>

          {/* Tech Stack Mobile */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 px-2">
            {siteConfig.heroContent.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-[#1a1b2e]/60 border border-white/10 rounded-full text-sm text-gray-300 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Buttons Mobile */}
          <div className="flex flex-col gap-4 px-4">
            <button
              onClick={() => navigateToSection('portfolio')}
              className="w-full py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              {siteConfig.heroContent.buttonText1}
            </button>
            <button
              onClick={() => navigateToSection('contact')}
              className="w-full py-4 border-2 border-[#8b5fbf] text-[#8b5fbf] rounded-full font-semibold text-lg hover:bg-[#8b5fbf] hover:text-white transition-all duration-300"
            >
              {siteConfig.heroContent.buttonText2}
            </button>
          </div>
        </div>
      </section>

      {/* About Section Mobile */}
      <section id="about" className="py-20 relative px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#8b5fbf]/10 border border-[#8b5fbf]/30 mb-6">
              <span className="text-sm text-[#8b5fbf] font-medium">✨ {siteConfig.aboutContent.subtitle} ✨</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
              About Me
            </h2>
          </div>

          {/* Profile Image Mobile */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#8b5fbf] to-[#6366f1] p-1">
                <div className="w-full h-full rounded-full bg-[#1a1b2e] flex items-center justify-center overflow-hidden">
                  {siteConfig.aboutContent.profileImage ? (
                    <img 
                      src={siteConfig.aboutContent.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-gray-400">👤</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">
              Hello, I'm<br />
              <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                {siteConfig.aboutContent.name}
              </span>
            </h3>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              {siteConfig.aboutContent.description}
            </p>

            <div className="flex flex-col gap-4 mb-12">
              <button className="w-full py-3 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-medium flex items-center justify-center gap-2">
                📄 {siteConfig.aboutContent.cvButtonText}
              </button>
              <button 
                onClick={() => navigateToSection('portfolio')}
                className="w-full py-3 border-2 border-[#8b5fbf] text-[#8b5fbf] rounded-xl font-medium hover:bg-[#8b5fbf] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{'</>'}</span> {siteConfig.aboutContent.projectsButtonText}
              </button>
            </div>
          </div>

          {/* Stats Mobile */}
          <div className="space-y-6">
            {Object.entries(siteConfig.aboutContent.stats).map(([key, stat]) => (
              <div key={key} className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">
                  {key === 'projects' && <span>{'</>'}</span>}
                  {key === 'certificates' && '🏆'}
                  {key === 'experience' && '🌐'}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stat.count}
                </h3>
                <p className="text-gray-400 uppercase tracking-wider mb-1 font-semibold text-sm">
                  {key.replace('_', ' ')}
                </p>
                <p className="text-gray-500 text-sm">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section Mobile */}
      <section id="portfolio" className="py-20 relative px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-6">
              Portfolio Showcase
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {siteConfig.portfolioContent.description}
            </p>
          </div>

          {/* Category Cards Mobile */}
          <div className="space-y-4 mb-16">
            {[
              { title: 'Projects', icon: '</>'.replace('<', '＜').replace('>', '＞'), active: true },
              { title: 'Certificates', icon: '🏆', active: false },
              { title: 'Tech Stack', icon: '⚙️', active: false }
            ].map((category, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  category.active 
                    ? 'bg-gradient-to-r from-[#8b5fbf]/20 to-[#6366f1]/20 border-[#8b5fbf]/40' 
                    : 'bg-[#1a1b2e]/60 border-white/10'
                } border backdrop-blur-sm`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className={`text-lg font-bold ${category.active ? 'text-white' : 'text-gray-300'}`}>
                  {category.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Projects Grid Mobile */}
          {siteConfig.portfolioContent.projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📁</div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-3">No hay proyectos aún</h3>
              <p className="text-gray-500 mb-8">
                Los proyectos aparecerán aquí cuando los agregues desde el panel de administración
              </p>
              <button 
                onClick={goToAdmin}
                className="w-full py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                🔒 Ir al Panel de Administración
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {siteConfig.portfolioContent.projects.map((project, index) => (
                <div key={index} className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-[#8b5fbf]/20 to-[#6366f1]/20 flex items-center justify-center">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl">📱</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    
                    {project.tech && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-[#8b5fbf]/20 text-[#8b5fbf] text-xs rounded-full border border-[#8b5fbf]/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-lg text-sm">
                        Live Demo ↗
                      </button>
                      <button className="w-full py-3 border border-[#8b5fbf] text-[#8b5fbf] rounded-lg text-sm">
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section Mobile */}
      <section id="contact" className="py-20 relative px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-6">
              {siteConfig.contactContent.title}
            </h2>
            <p className="text-gray-400">
              {siteConfig.contactContent.subtitle}
            </p>
          </div>

          {/* Contact Form Mobile */}
          <div className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="text-lg font-bold text-white">{siteConfig.contactContent.formTitle}</h3>
                <p className="text-gray-400 text-sm">{siteConfig.contactContent.formSubtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 bg-[#0a0b1e]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 bg-[#0a0b1e]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 bg-[#0a0b1e]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors resize-none"
              />
              <button className="w-full py-3 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-lg font-medium flex items-center justify-center gap-2">
                ↗ Send Message
              </button>
            </div>
          </div>

          {/* Social Links Mobile */}
          <div className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-6">
              — {siteConfig.contactContent.connectTitle}
            </h3>
            
            <div className="space-y-3">
              {Object.entries(siteConfig.contactContent.socialLinks).map(([platform, info]) => (
                <a
                  key={platform}
                  href={info.url}
                  className="flex items-center justify-between p-4 bg-[#0a0b1e]/50 border border-white/10 rounded-lg hover:border-[#8b5fbf]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                      platform === 'linkedin' ? 'bg-blue-600' : 
                      platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      platform === 'youtube' ? 'bg-red-600' :
                      platform === 'github' ? 'bg-gray-800' :
                      'bg-black'
                    }`}>
                      {platform === 'linkedin' ? 'Li' : 
                       platform === 'instagram' ? 'Ig' :
                       platform === 'youtube' ? 'Yt' :
                       platform === 'github' ? 'Gh' :
                       'Tk'}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{platform}</p>
                      <p className="text-gray-400 text-sm">{info.username}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 text-lg">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Comments Section Mobile */}
          <div className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">💬</span>
              <h3 className="text-lg font-bold text-white">Comments (17)</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-[#0a0b1e]/50 rounded-lg">
                <div className="w-8 h-8 bg-[#8b5fbf] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  E
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">EKIZR</span>
                    <span className="text-[#8b5fbf] text-xs">Admin</span>
                    <span className="text-gray-500 text-xs">Jun 2, 2025</span>
                  </div>
                  <p className="text-gray-300 text-sm">Thanks for visiting! Contact me if you need anything</p>
                </div>
              </div>
              
              <div className="text-center py-3">
                <button className="text-[#8b5fbf] text-sm hover:underline">View all comments</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mobile */}
      <footer className="bg-[#0a0b1e] border-t border-white/10 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-4">
            {siteConfig.siteName}
          </div>
          <p className="text-gray-400 mb-8 text-sm">
            © 2024 {siteConfig.siteName}. Sistema con panel de administración completo.
          </p>
          <button 
            onClick={goToAdmin}
            className="w-full py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-full font-semibold flex items-center justify-center gap-3"
          >
            <span>🔒</span>
            <span>Ir al Panel de Administración</span>
            <span>→</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AppMobile;