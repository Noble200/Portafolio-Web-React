// scripts/updateHeroConfig.js
// Script para agregar la configuración del Hero a la base de datos

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateHeroConfig() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Actualizando configuración del Hero en la base de datos...');

    // Configuración inicial del Hero basada en la imagen de referencia
    const heroConfig = [
      // Información principal del Hero
      ['hero_badge', '⚡ Ready to Innovate', 'string'],
      ['hero_title', 'Frontend', 'string'],
      ['hero_subtitle', 'Developer', 'string'],
      ['hero_profession', 'Network & Telecom Student', 'string'],
      ['hero_description', 'Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital.', 'string'],
      
      // Botones de acción
      ['hero_button1', 'Projects', 'string'],
      ['hero_button2', 'Contact', 'string'],
      
      // Tech Stack como JSON array
      ['hero_tech_stack', JSON.stringify(['React', 'Javascript', 'Node.js', 'Tailwind']), 'json'],
      
      // Redes sociales - Solo agrega URLs válidas para que aparezcan
      ['social_github', '', 'string'],
      ['social_linkedin', '', 'string'],
      ['social_twitter', '', 'string'],
      ['social_instagram', '', 'string'],
      ['social_facebook', '', 'string'],
      ['social_youtube', '', 'string'],
      ['social_behance', '', 'string'],
      ['social_dribbble', '', 'string'],
      
      // Configuración general del sitio
      ['site_title', 'Ekizr', 'string'],
      ['site_description', 'Portafolio profesional de desarrollo web frontend', 'string']
    ];

    console.log('📝 Insertando configuración del Hero...');

    for (const [key, value, dataType] of heroConfig) {
      await client.query(`
        INSERT INTO site_config (key, value, data_type, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (key) 
        DO UPDATE SET value = $2, data_type = $3, updated_at = NOW()
      `, [key, value, dataType]);
      
      console.log(`✅ ${key}: ${dataType === 'json' ? 'Array configurado' : value}`);
    }

    console.log('\n🎉 Configuración del Hero actualizada correctamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Inicia tu aplicación: npm run dev');
    console.log('2. Ve al panel de administración: http://localhost:3000/admin');
    console.log('3. Configura las redes sociales y personaliza el contenido');
    
  } catch (error) {
    console.error('❌ Error al actualizar configuración del Hero:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Función para ver la configuración actual
async function showCurrentConfig() {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT key, value, data_type FROM site_config ORDER BY key');
    
    console.log('\n📋 Configuración actual en la base de datos:');
    console.log('='.repeat(50));
    
    result.rows.forEach(row => {
      let displayValue = row.value;
      if (row.data_type === 'json') {
        try {
          displayValue = JSON.stringify(JSON.parse(row.value), null, 2);
        } catch (e) {
          displayValue = row.value;
        }
      }
      console.log(`${row.key}: ${displayValue} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar según los argumentos
const command = process.argv[2];

if (command === 'show') {
  showCurrentConfig();
} else {
  updateHeroConfig();
}

// Ayuda
if (command === 'help' || command === '--help' || command === '-h') {
  console.log(`
Uso del script de configuración del Hero:

node scripts/updateHeroConfig.js        - Actualiza la configuración del Hero
node scripts/updateHeroConfig.js show   - Muestra la configuración actual
node scripts/updateHeroConfig.js help   - Muestra esta ayuda

Ejemplos:
  node scripts/updateHeroConfig.js
  node scripts/updateHeroConfig.js show
  `);
}