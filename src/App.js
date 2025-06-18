import React, { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import './App.css';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

// Lazy load de la animación Lottie (mejora carga inicial)
const DotLottieReact = lazy(() => 
  import('@lottiefiles/dotlottie-react').then(module => ({ 
    default: module.DotLottieReact 
  }))
);

// Componente memorizado para redes sociales (evita re-renders innecesarios)
const SocialNetworks = memo(({ socialNetworks }) => {
  const getSocialIcon = useCallback((network) => {
    const iconProps = "w-5 h-5 fill-current";
    
    switch (network) {
      case 'github':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'behance':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M0 4.4v15.2h5.9c1.2 0 2.3-.2 3.3-.6 1-.4 1.8-1 2.4-1.8.6-.8.9-1.7.9-2.8 0-.9-.2-1.7-.6-2.3-.4-.6-1-.9-1.8-1.2.6-.3 1.1-.7 1.4-1.3.3-.6.5-1.3.5-2 0-1-.3-1.9-.8-2.6-.5-.7-1.2-1.2-2.1-1.5-.9-.3-2-.5-3.2-.5H0zm15.4 1.1h5.7v1.5h-5.7V5.5zm-9.9 1.7h3.2c.8 0 1.4.2 1.8.5.4.3.6.8.6 1.4 0 .6-.2 1-.6 1.3-.4.3-1 .4-1.8.4H5.5V7.2zm10.8 2.3c-.6 0-1.1.1-1.6.4-.5.3-.9.7-1.2 1.2-.3.5-.4 1.1-.4 1.7h6.2c0-.6-.1-1.1-.3-1.6-.2-.5-.6-.9-1-.1.2s-.9-.3-1.7-.3zM5.5 12.1h3.5c.9 0 1.6.2 2.1.6.5.4.7 1 .7 1.7 0 .7-.2 1.3-.7 1.7-.5.4-1.2.6-2.1.6H5.5v-4.6zm9.9.7c0 .8.1 1.5.4 2.1.3.6.7 1 1.2 1.3.5.3 1.1.4 1.7.4.9 0 1.6-.2 2.2-.7.6-.5.9-1.1 1-1.9h-1.9c-.1.4-.3.7-.6.9-.3.2-.7.3-1.1.3-.6 0-1.1-.2-1.4-.5-.3-.3-.5-.8-.5-1.4h5.9v-.6c0-1.1-.2-2-.7-2.8-.5-.8-1.1-1.4-1.9-1.8-.8-.4-1.6-.6-2.5-.6-1 0-1.9.2-2.6.7-.7.5-1.3 1.1-1.7 1.9-.4.8-.6 1.7-.6 2.7z"/>
          </svg>
        );
      case 'dribbble':
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconProps} viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        );
    }
  }, [socialNetworks]);

  return (
    <div className="flex gap-4 pt-4">
      {Object.entries(socialNetworks)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([network, url], index) => (
          <a
            key={network}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#1a1b2e]/60 border border-[#8b5fbf]/30 rounded-xl flex items-center justify-center backdrop-blur-sm hover:border-[#8b5fbf]/60 hover:scale-110 hover:bg-[#8b5fbf]/20 transition-all duration-300 social-icon text-gray-300 hover:text-white"
            title={network.charAt(0).toUpperCase() + network.slice(1)}
            style={{animationDelay: `${index * 0.1 + 0.5}s`}}
          >
            {getSocialIcon(network)}
          </a>
        ))}
    </div>
  );
});

// Componente memorizado para tech stack
const TechStack = memo(({ techStack }) => (
  <div className="flex flex-wrap gap-3">
    {techStack.map((tech, index) => (
      <span
        key={index}
        className="px-4 py-2 bg-[#1a1b2e]/60 border border-[#8b5fbf]/30 rounded-full text-sm font-medium text-gray-300 backdrop-blur-sm hover:border-[#8b5fbf]/60 hover:text-white transition-all duration-300 tech-bubble"
        style={{animationDelay: `${index * 0.1}s`}}
      >
        {tech}
      </span>
    ))}
  </div>
));

// Componente memorizado para proyecto individual
const ProjectCard = memo(({ project, index }) => (
  <div 
    className="bg-[#1a1b2e]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#8b5fbf]/30 transition-all duration-500 hover:scale-105 group project-card scroll-animate"
    style={{animationDelay: `${index * 0.1}s`}}
  >
    <div className="h-64 bg-gradient-to-br from-[#8b5fbf]/20 to-[#6366f1]/20 flex items-center justify-center">
      {project.image_url ? (
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="text-6xl opacity-50">🎨</div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#8b5fbf] transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-400 mb-4 line-clamp-3">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags?.map((tag, tagIndex) => (
          <span key={tagIndex} className="px-2 py-1 bg-[#8b5fbf]/20 text-[#8b5fbf] rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" 
             className="flex-1 py-2 bg-[#8b5fbf] text-white rounded text-center hover:bg-[#7a4fb5] transition-colors">
            Ver Demo
          </a>
        )}
        {project.download_url && (
          <a href={project.download_url} target="_blank" rel="noopener noreferrer"
             className="flex-1 py-2 bg-[#1a1b2e] border border-[#8b5fbf]/30 text-white rounded text-center hover:border-[#8b5fbf]/60 transition-colors">
            Descargar
          </a>
        )}
      </div>
    </div>
  </div>
));

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estado optimizado con useMemo para configuración inicial
  const initialConfig = useMemo(() => ({
    siteName: 'Ekizr',
    heroContent: {
      badge: 'Ready to Innovate',
      title: 'Frontend',
      subtitle: 'Developer',
      profession: 'Network & Telecom Student',
      description: 'Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital.',
      techStack: ['React', 'Javascript', 'Node.js', 'Tailwind'],
      buttonText1: 'Projects',
      buttonText2: 'Contact',
      socialNetworks: {
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        youtube: '',
        behance: '',
        dribbble: ''
      }
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
      email: 'hello@example.com',
      phone: '+1234567890',
      location: 'Your City, Country'
    }
  }), []);

  const [siteConfig, setSiteConfig] = useState(initialConfig);

  // Verifica autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // NUEVA FUNCIÓN: Recarga la configuración desde la base de datos
  const refreshConfiguration = useCallback(async () => {
    try {
      console.log('🔄 Recargando configuración...');
      
      const [projectsResponse, configResponse] = await Promise.all([
        fetch('/api/projects?status=published'),
        fetch('/api/config')
      ]);

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

      if (configResponse.ok) {
        const config = await configResponse.json();
        
        setSiteConfig(prev => {
          const updatedConfig = { ...prev };
          
          // Hero Content
          if (config.hero_badge) updatedConfig.heroContent.badge = config.hero_badge;
          if (config.hero_title) updatedConfig.heroContent.title = config.hero_title;
          if (config.hero_subtitle) updatedConfig.heroContent.subtitle = config.hero_subtitle;
          if (config.hero_profession) updatedConfig.heroContent.profession = config.hero_profession;
          if (config.hero_description) updatedConfig.heroContent.description = config.hero_description;
          if (config.hero_tech_stack) updatedConfig.heroContent.techStack = config.hero_tech_stack;
          if (config.hero_button1) updatedConfig.heroContent.buttonText1 = config.hero_button1;
          if (config.hero_button2) updatedConfig.heroContent.buttonText2 = config.hero_button2;
          
          // IMPORTANTE: Crear un nuevo objeto para socialNetworks para forzar re-render
          updatedConfig.heroContent.socialNetworks = {
            github: config.social_github || '',
            linkedin: config.social_linkedin || '',
            twitter: config.social_twitter || '',
            instagram: config.social_instagram || '',
            facebook: config.social_facebook || '',
            youtube: config.social_youtube || '',
            behance: config.social_behance || '',
            dribbble: config.social_dribbble || ''
          };
          
          if (config.site_title) updatedConfig.siteName = config.site_title;
          
          console.log('✅ Configuración actualizada:', updatedConfig.heroContent.socialNetworks);
          return updatedConfig;
        });
      }
    } catch (error) {
      console.error('Error refreshing configuration:', error);
    }
  }, []);

  // Optimización: useCallback para cargar datos
  const loadPortfolioData = useCallback(async () => {
    await refreshConfiguration();
  }, [refreshConfiguration]);

  // Cargar datos del portafolio y configuración
  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  // Optimización del scroll handler con throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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

          // Activar animaciones de scroll
          const animateElements = document.querySelectorAll('.scroll-animate:not(.animate), .scroll-animate-left:not(.animate), .scroll-animate-right:not(.animate)');
          animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
              element.classList.add('animate');
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // Funciones memorizadas
  const handleLogin = useCallback((userData) => {
    const token = localStorage.getItem('admin_token');
    const userWithToken = { ...userData, token: token };
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    setCurrentPath('/admin');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  }, []);

  const navigateToSection = useCallback((section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const goToAdmin = useCallback(() => {
    setCurrentPath('/admin');
    window.history.pushState({}, '', '/admin');
  }, []);

  // Memoizar elementos que no cambian frecuentemente
  const navigationItems = useMemo(() => ['Home', 'About', 'Portfolio', 'Contact'], []);

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
      <AdminPanel 
        user={user} 
        onLogout={handleLogout}
        siteConfig={siteConfig}
        setSiteConfig={setSiteConfig}
        refreshConfiguration={refreshConfiguration} // PASAR LA FUNCIÓN AL ADMIN
      />
    ) : (
      <Login onLogin={handleLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b1e] via-[#1a1b2e] to-[#2a1b3e] text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'navbar-cyber-scrolled bg-[#0a0b1e]/90 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
              {siteConfig.siteName}
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item}
                  onClick={() => navigateToSection(item.toLowerCase())}
                  className={`transition-all duration-300 hover:text-[#8b5fbf] ${
                    activeSection === item.toLowerCase() 
                      ? 'text-[#8b5fbf] font-semibold' 
                      : 'text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#8b5fbf]/8 rounded-full blur-3xl animate-pulse will-change-transform"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6366f1]/8 rounded-full blur-3xl animate-pulse will-change-transform" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido izquierdo */}
            <div className="space-y-8 scroll-animate-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8b5fbf]/20 border border-[#8b5fbf]/40 rounded-full backdrop-blur-sm">
                <span className="text-2xl">⚡</span>
                <span className="text-[#8b5fbf] font-medium">{siteConfig.heroContent.badge}</span>
              </div>

              {/* Título principal */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="text-white">{siteConfig.heroContent.title}</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                    {siteConfig.heroContent.subtitle}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 font-medium">
                  {siteConfig.heroContent.profession}
                </p>
              </div>

              {/* Descripción */}
              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                {siteConfig.heroContent.description}
              </p>

              {/* Tech Stack Bubbles */}
              <TechStack techStack={siteConfig.heroContent.techStack} />

              {/* Botones de acción */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigateToSection('portfolio')}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-[#8b5fbf]/25 cyber-button"
                >
                  <span>{siteConfig.heroContent.buttonText1}</span>
                  <span>↗</span>
                </button>
                
                <button
                  onClick={() => navigateToSection('contact')}
                  className="flex items-center gap-2 px-8 py-4 bg-[#1a1b2e]/60 border border-[#8b5fbf]/30 text-white rounded-xl font-semibold backdrop-blur-sm hover:border-[#8b5fbf]/60 hover:scale-105 transition-all duration-200"
                >
                  <span>{siteConfig.heroContent.buttonText2}</span>
                  <span>✉</span>
                </button>
              </div>

              {/* Redes sociales - NOTA: key único fuerza re-render */}
              <SocialNetworks 
                key={JSON.stringify(siteConfig.heroContent.socialNetworks)} 
                socialNetworks={siteConfig.heroContent.socialNetworks} 
              />
            </div>

            {/* Animación Lottie derecha */}
            <div className="relative scroll-animate-right">
              {/* Fondo dinámico con formas geométricas */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#8b5fbf]/20 to-[#6366f1]/20 rotate-45 animate-pulse blur-sm"></div>
                <div className="absolute bottom-20 left-5 w-24 h-24 bg-gradient-to-tr from-[#6366f1]/15 to-[#8b5fbf]/15 rounded-full animate-bounce blur-sm" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-5 w-16 h-16 bg-gradient-to-r from-[#8b5fbf]/25 to-[#6366f1]/25 transform rotate-12 animate-spin blur-sm" style={{animationDuration: '8s'}}></div>
                
                {/* Líneas geométricas */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#8b5fbf]/20 to-transparent animate-pulse"></div>
                <div className="absolute top-1/4 right-0 h-px w-full bg-gradient-to-r from-transparent via-[#6366f1]/20 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              
              {/* Animación Lottie */}
              <div className="relative z-10">
                <Suspense fallback={
                  <div className="w-full h-96 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[#8b5fbf]/30 border-t-[#8b5fbf] rounded-full animate-spin"></div>
                  </div>
                }>
                  <DotLottieReact
                    src="https://lottie.host/400cf03c-d0bb-4810-b3a7-438a32d89948/dKc1leyteP.lottie"
                    loop
                    autoplay
                    className="w-full h-auto max-w-3xl mx-auto scale-125"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#8b5fbf]/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#8b5fbf] rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {siteConfig.aboutContent.subtitle}
            </p>
          </div>
          
          <div className="text-center py-20 scroll-animate">
            <p className="text-gray-400">Sección About - mantén tu código existente aquí</p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-[#0f0f1f]/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {siteConfig.portfolioContent.description}
            </p>
          </div>
          
          {/* Projects Grid */}
          {siteConfig.portfolioContent.projects.length === 0 ? (
            <div className="text-center py-20 scroll-animate">
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
                <ProjectCard key={project.id || index} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent">
                {siteConfig.contactContent.title}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {siteConfig.contactContent.subtitle}
            </p>
          </div>
          
          <div className="text-center py-20 scroll-animate">
            <p className="text-gray-400">Sección Contact - mantén tu código existente aquí</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#8b5fbf]/20 bg-[#0a0b1e]/50">
        <div className="container mx-auto px-6 text-center scroll-animate">
          <p className="text-gray-400">
            © 2024 {siteConfig.siteName}. Sistema con panel de administración completo.
          </p>
          <button 
            onClick={goToAdmin}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-2 mx-auto"
          >
            <span>🔒</span>
            <span>Ir al Panel de Administración</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;