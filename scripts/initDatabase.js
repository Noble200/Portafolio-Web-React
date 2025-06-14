// scripts/initDatabase.js
// Script para inicializar la base de datos con datos básicos

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando configuración de la base de datos...');

    // Crear las tablas si no existen
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        download_url VARCHAR(500),
        live_url VARCHAR(500),
        tags TEXT[],
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level INTEGER CHECK (level >= 0 AND level <= 100),
        category VARCHAR(50) NOT NULL,
        icon_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        file_type VARCHAR(20) CHECK (file_type IN ('image', 'document', 'executable', 'other')),
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tablas creadas correctamente');

    // Crear índices
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);',
      'CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);',
      'CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);',
      'CREATE INDEX IF NOT EXISTS idx_media_project_id ON media_files(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);'
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }

    console.log('✅ Índices creados correctamente');

    // Función para actualizar timestamps
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Triggers para auto-actualizar
    await client.query(`
      DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
      CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
      CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Funciones y triggers creados correctamente');

    // Insertar configuración inicial si no existe
    const configExists = await client.query('SELECT COUNT(*) FROM site_config');
    if (parseInt(configExists.rows[0].count) === 0) {
      const initialConfig = [
        ['site_title', 'Mi Portafolio', 'string'],
        ['site_description', 'Portafolio profesional de desarrollo web', 'string'],
        ['owner_name', 'Tu Nombre', 'string'],
        ['owner_email', process.env.ADMIN_EMAIL || 'tu@email.com', 'string'],
        ['social_github', 'https://github.com/tuusuario', 'string'],
        ['social_linkedin', 'https://linkedin.com/in/tuusuario', 'string'],
        ['show_contact_form', 'true', 'boolean'],
        ['projects_per_page', '9', 'number']
      ];

      for (const [key, value, dataType] of initialConfig) {
        await client.query(
          'INSERT INTO site_config (key, value, data_type) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
          [key, value, dataType]
        );
      }
      console.log('✅ Configuración inicial creada');
    }

    // Insertar skills de ejemplo si no existen
    const skillsExist = await client.query('SELECT COUNT(*) FROM skills');
    if (parseInt(skillsExist.rows[0].count) === 0) {
      const initialSkills = [
        ['React', 90, 'frontend'],
        ['JavaScript', 85, 'frontend'],
        ['Node.js', 80, 'backend'],
        ['PostgreSQL', 75, 'database'],
        ['Python', 70, 'backend'],
        ['CSS/SASS', 85, 'frontend'],
        ['Git', 80, 'tools'],
        ['Docker', 65, 'devops']
      ];

      for (const [name, level, category] of initialSkills) {
        await client.query(
          'INSERT INTO skills (name, level, category) VALUES ($1, $2, $3)',
          [name, level, category]
        );
      }
      console.log('✅ Skills de ejemplo creados');
    }

    // Crear proyecto de ejemplo si no existe
    const projectsExist = await client.query('SELECT COUNT(*) FROM projects');
    if (parseInt(projectsExist.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO projects (title, description, tags, status) 
        VALUES ($1, $2, $3, $4)
      `, [
        'Mi Primer Proyecto',
        'Este es un proyecto de ejemplo para demostrar las capacidades del portafolio.',
        ['React', 'Node.js', 'PostgreSQL'],
        'published'
      ]);
      console.log('✅ Proyecto de ejemplo creado');
    }

    console.log('🎉 Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Función para crear el hash del password del admin
async function createAdminPasswordHash() {
  const plainPassword = process.argv[2];
  if (!plainPassword) {
    console.log('Uso: node initDatabase.js [password]');
    console.log('Para generar hash de password: node scripts/initDatabase.js mi_password_seguro');
    return;
  }
  
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log('Hash generado para el password:');
  console.log(hash);
  console.log('\nAñade esto a tu .env como ADMIN_PASSWORD_HASH');
}

// Ejecutar según los argumentos
if (process.argv.length > 2) {
  createAdminPasswordHash();
} else {
  initializeDatabase();
}