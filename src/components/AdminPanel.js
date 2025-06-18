import React, { useState, useEffect } from 'react';
import { 
  Code, FileText, Image, Settings, Save, Eye, LogOut, 
  Plus, Edit, Trash, Upload, User, Home, Globe, 
  Github, Linkedin, Twitter, Instagram, Facebook, 
  Youtube, Share, Palette
} from 'lucide-react';

const AdminPanel = ({ user, onLogout, siteConfig, setSiteConfig }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estado para el contenido del Hero
  const [heroData, setHeroData] = useState({
    badge: '',
    title: '',
    subtitle: '',
    profession: '',
    description: '',
    techStack: [],
    buttonText1: '',
    buttonText2: '',
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
  });

  // Estado para nueva tecnología
  const [newTech, setNewTech] = useState('');

  // Cargar datos del hero al montar el componente
  useEffect(() => {
    if (siteConfig?.heroContent) {
      setHeroData(siteConfig.heroContent);
    }
  }, [siteConfig]);

  // Función para mostrar mensajes
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Función para verificar y renovar token si es necesario
  const ensureValidToken = async () => {
    let token = user?.token || localStorage.getItem('admin_token');
    
    if (!token) {
      throw new Error('No hay token disponible');
    }

    // Verificar si el token está expirado
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return token; // Token válido
      } else {
        // Token expirado o inválido, necesitamos hacer login nuevamente
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.');
      }
    } catch (error) {
      throw new Error('Token expirado. Por favor, inicia sesión nuevamente.');
    }
  };

  // Función para guardar configuración del Hero
  const saveHeroConfig = async () => {
    setLoading(true);
    try {
      // Verificar que el token sea válido
      const validToken = await ensureValidToken();
      
      console.log('🔐 Usando token válido');

      // Guardar cada campo en la base de datos
      const configUpdates = [
        { key: 'hero_badge', value: heroData.badge, data_type: 'string' },
        { key: 'hero_title', value: heroData.title, data_type: 'string' },
        { key: 'hero_subtitle', value: heroData.subtitle, data_type: 'string' },
        { key: 'hero_profession', value: heroData.profession, data_type: 'string' },
        { key: 'hero_description', value: heroData.description, data_type: 'string' },
        { key: 'hero_tech_stack', value: heroData.techStack, data_type: 'json' },
        { key: 'hero_button1', value: heroData.buttonText1, data_type: 'string' },
        { key: 'hero_button2', value: heroData.buttonText2, data_type: 'string' },
        // Redes sociales
        { key: 'social_github', value: heroData.socialNetworks.github, data_type: 'string' },
        { key: 'social_linkedin', value: heroData.socialNetworks.linkedin, data_type: 'string' },
        { key: 'social_twitter', value: heroData.socialNetworks.twitter, data_type: 'string' },
        { key: 'social_instagram', value: heroData.socialNetworks.instagram, data_type: 'string' },
        { key: 'social_facebook', value: heroData.socialNetworks.facebook, data_type: 'string' },
        { key: 'social_youtube', value: heroData.socialNetworks.youtube, data_type: 'string' },
        { key: 'social_behance', value: heroData.socialNetworks.behance, data_type: 'string' },
        { key: 'social_dribbble', value: heroData.socialNetworks.dribbble, data_type: 'string' }
      ];

      for (const config of configUpdates) {
        const response = await fetch(`/api/config/${config.key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${validToken}`
          },
          body: JSON.stringify({
            value: config.value,
            data_type: config.data_type
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`❌ Error al guardar ${config.key}:`, response.status, errorData);
          throw new Error(`Error al guardar ${config.key}: ${response.status}`);
        }

        console.log(`✅ ${config.key} guardado correctamente`);
      }

      // Actualizar el estado local
      setSiteConfig(prev => ({
        ...prev,
        heroContent: {
          ...prev.heroContent,
          ...heroData
        }
      }));

      showMessage('Configuración guardada correctamente', 'success');
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      
      if (error.message.includes('Token expirado') || error.message.includes('inicia sesión')) {
        showMessage('Sesión expirada. Serás redirigido al login.', 'error');
        // Limpiar datos de sesión
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showMessage(`Error al guardar la configuración: ${error.message}`, 'error');
      }
    }
    setLoading(false);
    window.location.reload();
  };

  // Función para agregar tecnología
  const addTech = () => {
    if (newTech.trim() && !heroData.techStack.includes(newTech.trim())) {
      setHeroData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  // Función para eliminar tecnología
  const removeTech = (index) => {
    setHeroData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  // Función para actualizar redes sociales
  const updateSocialNetwork = (network, url) => {
    setHeroData(prev => ({
      ...prev,
      socialNetworks: {
        ...prev.socialNetworks,
        [network]: url
      }
    }));
  };

  // Función para obtener icono de red social
  const getSocialIcon = (network) => {
    const icons = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      youtube: Youtube,
      behance: Palette,
      dribbble: Share
    };
    return icons[network] || Globe;
  };

  const tabs = [
    { id: 'home', name: 'Página Principal', icon: Home },
    { id: 'projects', name: 'Proyectos', icon: Code },
    { id: 'skills', name: 'Habilidades', icon: FileText },
    { id: 'media', name: 'Archivos', icon: Image },
    { id: 'settings', name: 'Configuración General', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración - Portafolio</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.open('/', '_blank')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Sitio</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mensaje de notificación */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Página Principal */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Configuración de Página Principal</h2>
                <button
                  onClick={saveHeroConfig}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información Principal */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Principal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta Superior</label>
                      <input
                        type="text"
                        value={heroData.badge}
                        onChange={(e) => setHeroData(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Ready to Innovate"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                      <input
                        type="text"
                        value={heroData.title}
                        onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Frontend"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                      <input
                        type="text"
                        value={heroData.subtitle}
                        onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
                      <input
                        type="text"
                        value={heroData.profession}
                        onChange={(e) => setHeroData(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Network & Telecom Student"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        value={heroData.description}
                        onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Descripción breve sobre ti..."
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Botones de Acción</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto Botón 1</label>
                      <input
                        type="text"
                        value={heroData.buttonText1}
                        onChange={(e) => setHeroData(prev => ({ ...prev, buttonText1: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Projects"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto Botón 2</label>
                      <input
                        type="text"
                        value={heroData.buttonText2}
                        onChange={(e) => setHeroData(prev => ({ ...prev, buttonText2: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Contact"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tecnologías */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tecnologías (Burbujas)</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTech()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Agregar nueva tecnología..."
                    />
                    <button
                      onClick={addTech}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {heroData.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTech(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
                <p className="text-sm text-gray-500 mb-4">Solo aparecerán las redes sociales que tengan una URL configurada</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(heroData.socialNetworks).map(([network, url]) => {
                    const Icon = getSocialIcon(network);
                    return (
                      <div key={network} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 min-w-[100px]">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {network}
                          </span>
                        </div>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => updateSocialNetwork(network, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                          placeholder={`https://${network}.com/tuusuario`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Proyectos */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Proyectos</h2>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'project' });
                    setFormData({});
                    setShowModal(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proyecto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {siteConfig?.portfolioContent?.projects?.length > 0 ? (
                        siteConfig.portfolioContent.projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {project.image_url ? (
                                    <img className="h-10 w-10 rounded-md object-cover" src={project.image_url} alt="" />
                                  ) : (
                                    <div className="h-10 w-10 rounded-md bg-gray-300 flex items-center justify-center">
                                      <Code className="w-5 h-5 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                  <div className="text-sm text-gray-500">{project.description?.substring(0, 60)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                project.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : project.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status === 'published' ? 'Publicado' : 
                                 project.status === 'draft' ? 'Borrador' : 'Archivado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(project.created_at).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingItem({ type: 'project', data: project });
                                    setFormData(project);
                                    setShowModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                                      // Función de eliminar proyecto (implementar más tarde)
                                      console.log('Eliminar proyecto:', project.id);
                                      showMessage('Función de eliminar pendiente de implementar', 'error');
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <Code className="w-12 h-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium mb-2">No hay proyectos</p>
                              <p className="text-sm">Crea tu primer proyecto para comenzar</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Habilidades */}
          {activeTab === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Habilidades</h2>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'skill' });
                    setFormData({});
                    setShowModal(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Habilidad</span>
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-center py-8">
                  Sección de habilidades - Funcionalidad próximamente
                </p>
              </div>
            </div>
          )}

          {/* Archivos */}
          {activeTab === 'media' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Archivos</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Subir archivos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <div className="mt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Seleccionar archivos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración General */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración General</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Sitio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sitio</label>
                        <input
                          type="text"
                          value={siteConfig?.siteName || ''}
                          onChange={(e) => setSiteConfig(prev => ({ ...prev, siteName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mi Portafolio"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración SEO</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Sitio</label>
                        <textarea
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descripción para motores de búsqueda..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Palabras Clave</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="desarrollo web, programador, frontend..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Guardar Configuración</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para editar proyectos/skills */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem?.data ? 'Editar' : 'Crear'} {editingItem?.type === 'project' ? 'Proyecto' : 'Habilidad'}
              </h3>
              
              {editingItem?.type === 'project' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para guardar
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;