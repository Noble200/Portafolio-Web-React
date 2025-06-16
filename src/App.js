import React, { useState, useEffect } from 'react';
import './App.css';

// Importa tus componentes existentes
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Estado para datos editables desde admin panel - INTEGRADO CON TU SISTEMA
  const [siteConfig, setSiteConfig] = useState({
    // Navegación
    siteName: 'Ekizr',
    
    // Hero Section - Todo editable desde admin
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
    
    // Portfolio Section - Se llena desde tu base de datos
    portfolioContent: {
      description: 'Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.',
      projects: [] // Esto se carga desde tu API /api/projects
    },

    // Contact Section
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

  // Tu lógica existente adaptada
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

  // Cargar datos desde tu API
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        // Cargar proyectos desde tu API
        const projectsResponse = await fetch('/api/projects');
        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          setSiteConfig(prev => ({
            ...prev,
            portfolioContent: {
              ...prev.portfolioContent,
              projects: projects
            }
          }));
        }

        // Cargar configuración desde tu API
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

  // Manejo del scroll para navegación fija
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detectar sección activa
      const sections = ['home', 'about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
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
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToAdmin = () => {
    setCurrentPath('/admin');
    window.history.pushState({}, '', '/admin');
  };

  // Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0b1e] to-[#1a1b2e] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-4">
            {siteConfig.siteName}
          </div>
          <div className="w-12 h-12 border-4 border-[#8b5fbf]/30 border-t-[#8b5fbf] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Si está en admin, mostrar panel de administración
  if (currentPath === '/admin') {
    return user ? (
      <AdminPanel user={user} onLogout={handleLogout} />
    ) : (
      <Login onLogin={handleLogin} />
    );
  }

  // PORTFOLIO DESKTOP - OPTIMIZADO PARA PC
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b1e] via-[#1a1b2e] to-[#0a0b1e] text-white overflow-x-hidden">
      {/* Background Pattern Desktop */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b5fbf]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#6366f1]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-80 h-80 bg-[#8b5fbf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation Desktop */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0b1e]/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="text-2xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
              {siteConfig.siteName}
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-12">
              {['Home', 'About', 'Portfolio', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => navigateToSection(item.toLowerCase())}
                  className={`text-lg font-medium transition-all duration-300 relative group ${
                    activeSection === item.toLowerCase()
                      ? 'text-[#8b5fbf]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                  <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] transition-transform duration-300 ${
                    activeSection === item.toLowerCase() ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Desktop */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-[#8b5fbf]/10 border border-[#8b5fbf]/30 mb-12 backdrop-blur-sm">
            <span className="text-[#8b5fbf] font-medium">{siteConfig.heroContent.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-8xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
            {siteConfig.heroContent.title}
          </h1>
          
          <h2 className="text-7xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-8">
            {siteConfig.heroContent.subtitle}
          </h2>

          {/* Profession */}
          <p className="text-2xl text-gray-400 mb-12">
            {siteConfig.heroContent.profession}
          </p>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            {siteConfig.heroContent.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {siteConfig.heroContent.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-[#1a1b2e]/60 border border-white/10 rounded-full text-lg text-gray-300 backdrop-blur-sm hover:border-[#8b5fbf]/50 hover:bg-[#8b5fbf]/10 transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => navigateToSection('portfolio')}
              className="px-12 py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-full font-semibold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#8b5fbf]/30 transition-all duration-300"
            >
              {siteConfig.heroContent.buttonText1}
            </button>
            <button
              onClick={() => navigateToSection('contact')}
              className="px-12 py-4 border-2 border-[#8b5fbf] text-[#8b5fbf] rounded-full font-semibold text-lg hover:bg-[#8b5fbf] hover:text-white hover:scale-105 transition-all duration-300"
            >
              {siteConfig.heroContent.buttonText2}
            </button>
          </div>
        </div>
      </section>

      {/* About Section Desktop */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-[#8b5fbf]/10 border border-[#8b5fbf]/30 mb-8">
              <span className="text-[#8b5fbf] font-medium">✨ {siteConfig.aboutContent.subtitle} ✨</span>
            </div>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
              About Me
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Text Content */}
            <div>
              <h3 className="text-4xl font-bold text-white mb-8 leading-tight">
                Hello, I'm<br />
                <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                  {siteConfig.aboutContent.name}
                </span>
              </h3>
              
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                {siteConfig.aboutContent.description}
              </p>

              <div className="flex gap-6">
                <button className="px-8 py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 flex items-center gap-3">
                  📄 {siteConfig.aboutContent.cvButtonText}
                </button>
                <button 
                  onClick={() => navigateToSection('portfolio')}
                  className="px-8 py-4 border-2 border-[#8b5fbf] text-[#8b5fbf] rounded-xl font-semibold text-lg hover:bg-[#8b5fbf] hover:text-white transition-all duration-300 flex items-center gap-3"
                >
                  <span>{'</>'}</span> {siteConfig.aboutContent.projectsButtonText}
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 rounded-full bg-gradient-to-br from-[#8b5fbf] to-[#6366f1] p-2">
                  <div className="w-full h-full rounded-full bg-[#1a1b2e] flex items-center justify-center overflow-hidden">
                    {siteConfig.aboutContent.profileImage ? (
                      <img 
                        src={siteConfig.aboutContent.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-8xl text-gray-400">👤</div>
                    )}
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#8b5fbf]/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#6366f1]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {Object.entries(siteConfig.aboutContent.stats).map(([key, stat]) => (
              <div key={key} className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center hover:border-[#8b5fbf]/30 hover:bg-[#8b5fbf]/5 transition-all duration-300 group">
                <div className="text-6xl mb-6">
                  {key === 'projects' && <span>{'</>'}</span>}
                  {key === 'certificates' && '🏆'}
                  {key === 'experience' && '🌐'}
                </div>
                <h3 className="text-5xl font-bold text-white mb-4 group-hover:text-[#8b5fbf] transition-colors">
                  {stat.count}
                </h3>
                <p className="text-gray-400 text-lg uppercase tracking-wider mb-2 font-semibold">
                  {key.replace('_', ' ')}
                </p>
                <p className="text-gray-500">{stat.subtitle}</p>
                <div className="flex justify-end mt-6">
                  <span className="text-gray-600 group-hover:text-[#8b5fbf] transition-colors text-xl">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section Desktop */}
      <section id="portfolio" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-8">
              Portfolio Showcase
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              {siteConfig.portfolioContent.description}
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {[
              { title: 'Projects', icon: '</>'.replace('<', '＜').replace('>', '＞'), active: true },
              { title: 'Certificates', icon: '🏆', active: false },
              { title: 'Tech Stack', icon: '⚙️', active: false }
            ].map((category, index) => (
              <div 
                key={index}
                className={`p-12 rounded-2xl text-center cursor-pointer transition-all duration-500 group ${
                  category.active 
                    ? 'bg-gradient-to-br from-[#8b5fbf]/20 to-[#6366f1]/20 border-[#8b5fbf]/40 scale-105' 
                    : 'bg-[#1a1b2e]/60 border-white/10 hover:border-[#8b5fbf]/30 hover:scale-105'
                } border-2 backdrop-blur-sm`}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                  category.active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {category.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Projects Grid */}
          {siteConfig.portfolioContent.projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">📁</div>
              <h3 className="text-3xl font-semibold text-gray-400 mb-4">No hay proyectos aún</h3>
              <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                Los proyectos aparecerán aquí cuando los agregues desde el panel de administración
              </p>
              <button 
                onClick={goToAdmin}
                className="px-10 py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 flex items-center gap-3 mx-auto"
              >
                🔒 Ir al Panel de Administración
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteConfig.portfolioContent.projects.map((project, index) => (
                <div key={index} className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#8b5fbf]/30 transition-all duration-500 hover:scale-105 group">
                  <div className="h-64 bg-gradient-to-br from-[#8b5fbf]/20 to-[#6366f1]/20 flex items-center justify-center">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">📱</div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
                    
                    {project.tech && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="px-4 py-2 bg-[#8b5fbf]/20 text-[#8b5fbf] text-sm rounded-full border border-[#8b5fbf]/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <button className="flex-1 py-3 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-lg hover:shadow-lg transition-all duration-300">
                        Live Demo ↗
                      </button>
                      <button className="px-6 py-3 border border-[#8b5fbf] text-[#8b5fbf] rounded-lg hover:bg-[#8b5fbf] hover:text-white transition-colors duration-200">
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

      {/* Contact Section Desktop */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-8">
              {siteConfig.contactContent.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {siteConfig.contactContent.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl">💬</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{siteConfig.contactContent.formTitle}</h3>
                  <p className="text-gray-400">{siteConfig.contactContent.formSubtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-4 bg-[#0a0b1e]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors text-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-4 bg-[#0a0b1e]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors text-lg"
                />
                <textarea
                  rows="6"
                  placeholder="Your Message"
                  className="w-full p-4 bg-[#0a0b1e]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8b5fbf] focus:outline-none transition-colors resize-none text-lg"
                />
                <button className="w-full py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2">
                  ↗ Send Message
                </button>
              </div>
            </div>

            {/* Social Links & Comments */}
            <div className="space-y-8">
              <div className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  — {siteConfig.contactContent.connectTitle}
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(siteConfig.contactContent.socialLinks).map(([platform, info]) => (
                    <a
                      key={platform}
                      href={info.url}
                      className="flex items-center justify-between p-6 bg-[#0a0b1e]/50 border border-white/10 rounded-xl hover:border-[#8b5fbf]/50 transition-all duration-300 group hover:scale-105"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
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
                          <p className="text-white font-semibold text-lg capitalize">{platform}</p>
                          <p className="text-gray-400">{info.username}</p>
                        </div>
                      </div>
                      <span className="text-gray-600 group-hover:text-[#8b5fbf] transition-colors text-xl">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0b1e] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-6">
            {siteConfig.siteName}
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            © 2024 {siteConfig.siteName}. Sistema con panel de administración completo.
          </p>
          <button 
            onClick={goToAdmin}
            className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-[#8b5fbf]/30"
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

export default App;