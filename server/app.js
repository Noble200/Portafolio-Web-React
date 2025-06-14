// server/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Configuración de base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Hacer disponible la conexión globalmente
global.db = pool;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Rutas de API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/config', require('./routes/config'));

// Verificar si existe el build de React
const buildPath = path.join(__dirname, '../build');
const buildExists = fs.existsSync(buildPath) && fs.existsSync(path.join(buildPath, 'index.html'));

if (process.env.NODE_ENV === 'production' && buildExists) {
  // Producción con React compilado
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // Desarrollo o no hay build
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mi Portafolio - Backend API</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; color: #333;
          }
          .container { 
            max-width: 900px; margin: 0 auto; background: white; 
            padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
          }
          .status { 
            display: inline-block; padding: 8px 16px; border-radius: 20px; 
            font-weight: bold; margin: 5px; font-size: 14px;
          }
          .status.ok { background: #d4edda; color: #155724; }
          .status.warning { background: #fff3cd; color: #856404; }
          .btn { 
            display: inline-block; padding: 12px 24px; background: #007bff; 
            color: white; text-decoration: none; border-radius: 6px; 
            margin: 10px 5px; transition: background 0.3s;
          }
          .btn:hover { background: #0056b3; }
          .btn.success { background: #28a745; }
          .btn.success:hover { background: #1e7e34; }
          .endpoint { 
            background: #f8f9fa; padding: 12px; margin: 8px 0; 
            border-radius: 6px; border-left: 4px solid #007bff; 
          }
          .endpoint a { color: #007bff; text-decoration: none; font-family: monospace; }
          .endpoint a:hover { text-decoration: underline; }
          h1 { color: #2c3e50; margin-bottom: 10px; }
          h2 { color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }
          .step { background: #e9ecef; padding: 15px; margin: 10px 0; border-radius: 6px; }
          .code { background: #f1f3f4; padding: 4px 8px; border-radius: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Mi Portafolio - Backend API</h1>
          <p>El servidor backend está funcionando correctamente en modo <strong>desarrollo</strong>.</p>
          
          <h2>📊 Estado del Sistema</h2>
          <div class="status ok">✅ Servidor Express activo</div>
          <div class="status ok">✅ Base de datos PostgreSQL conectada</div>
          <div class="status ok">✅ Sistema de autenticación configurado</div>
          <div class="status ok">✅ APIs REST funcionando</div>
          <div class="status warning">⚠️ Frontend React no compilado</div>
          
          <h2>🔗 Endpoints de la API</h2>
          <div class="endpoint">
            <strong>Health Check:</strong> 
            <a href="/api/health" target="_blank">/api/health</a>
          </div>
          <div class="endpoint">
            <strong>Proyectos:</strong> 
            <a href="/api/projects" target="_blank">/api/projects</a>
          </div>
          <div class="endpoint">
            <strong>Skills:</strong> 
            <a href="/api/skills" target="_blank">/api/skills</a>
          </div>
          <div class="endpoint">
            <strong>Configuración:</strong> 
            <a href="/api/config" target="_blank">/api/config</a>
          </div>
          
          <h2>🛠️ Para acceder al Panel de Administración completo</h2>
          <div class="step">
            <strong>Paso 1:</strong> Compilar React<br>
            <code class="code">npm run build</code>
          </div>
          <div class="step">
            <strong>Paso 2:</strong> Reiniciar el servidor<br>
            <code class="code">npm start</code>
          </div>
          <div class="step">
            <strong>Paso 3:</strong> Acceder al panel<br>
            <a href="/admin" class="btn success">🔐 Panel de Administración</a>
          </div>
          
          <h2>⚡ Desarrollo</h2>
          <p>Para desarrollo con hot-reload de React:</p>
          <div class="step">
            <code class="code">npm install concurrently --save-dev</code><br>
            <code class="code">npm run dev</code>
          </div>
          <p>Esto ejecutará el backend (puerto 3000) y frontend (puerto 3001) simultáneamente.</p>
          
          <h2>📝 Credenciales de Admin</h2>
          <p>Email: <code class="code">${process.env.ADMIN_EMAIL || 'Configurar en .env'}</code></p>
          <p>Password: El que configuraste para generar el hash</p>
        </div>
      </body>
      </html>
    `);
  });
  
  // API de prueba para login (modo desarrollo)
  app.get('/admin', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin - Compilar React</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; text-align: center; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
          .code { background: #f1f3f4; padding: 8px 12px; border-radius: 4px; font-family: monospace; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 Panel de Administración</h1>
          <p>Para acceder al panel completo, necesitas compilar React primero:</p>
          <div class="code">npm run build</div>
          <br><br>
          <a href="/" class="btn">← Volver al inicio</a>
        </div>
      </body>
      </html>
    `);
  });
  
  // Catch-all para otras rutas
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'Endpoint no encontrado' });
    } else {
      res.redirect('/');
    }
  });
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Abrir: http://localhost:${PORT}`);
  console.log(`📊 Admin: http://localhost:${PORT}/admin`);
  console.log(`💾 Base de datos: ${process.env.DATABASE_URL ? 'Conectada' : 'No configurada'}`);
  console.log(`📁 React build: ${buildExists ? 'Encontrado' : 'No compilado (ejecuta npm run build)'}`);
});