// server/routes/config.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/config - Obtener toda la configuración
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value, data_type FROM site_config ORDER BY key');
    
    // Convertir a objeto para facilitar el uso
    const config = {};
    result.rows.forEach(row => {
      let value = row.value;
      
      // Convertir según el tipo de dato
      if (row.data_type === 'number') {
        value = parseFloat(value);
      } else if (row.data_type === 'boolean') {
        value = value.toLowerCase() === 'true';
      } else if (row.data_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn(`Error parsing JSON for ${row.key}:`, e);
        }
      }
      
      config[row.key] = value;
    });
    
    res.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// GET /api/config/:key - Obtener configuración específica
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.query('SELECT value, data_type FROM site_config WHERE key = $1', [key]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    
    let value = result.rows[0].value;
    const dataType = result.rows[0].data_type;
    
    // Convertir según el tipo
    if (dataType === 'number') {
      value = parseFloat(value);
    } else if (dataType === 'boolean') {
      value = value.toLowerCase() === 'true';
    } else if (dataType === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.warn(`Error parsing JSON for ${key}:`, e);
      }
    }
    
    res.json({ key, value, data_type: dataType });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// PUT /api/config/:key - Actualizar configuración (protegido)
router.put('/:key', requireAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, data_type = 'string' } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'El valor es requerido' });
    }
    
    // Validar tipo de dato
    const validTypes = ['string', 'number', 'boolean', 'json'];
    if (!validTypes.includes(data_type)) {
      return res.status(400).json({ error: 'Tipo de dato inválido' });
    }
    
    // Convertir valor a string para almacenar
    let stringValue = value;
    if (data_type === 'json') {
      stringValue = JSON.stringify(value);
    } else if (data_type === 'boolean') {
      stringValue = value.toString();
    } else if (data_type === 'number') {
      stringValue = value.toString();
    }
    
    const result = await db.query(`
      INSERT INTO site_config (key, value, data_type, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, data_type = $3, updated_at = NOW()
      RETURNING *
    `, [key, stringValue, data_type]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

// POST /api/config - Crear nueva configuración (protegido)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { key, value, data_type = 'string' } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Clave y valor son requeridos' });
    }
    
    // Convertir valor a string
    let stringValue = value;
    if (data_type === 'json') {
      stringValue = JSON.stringify(value);
    } else if (data_type === 'boolean') {
      stringValue = value.toString();
    } else if (data_type === 'number') {
      stringValue = value.toString();
    }
    
    const result = await db.query(`
      INSERT INTO site_config (key, value, data_type, updated_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [key, stringValue, data_type]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'La clave ya existe' });
    }
    console.error('Error al crear configuración:', error);
    res.status(500).json({ error: 'Error al crear configuración' });
  }
});

// DELETE /api/config/:key - Eliminar configuración (protegido)
router.delete('/:key', requireAuth, async (req, res) => {
  try {
    const { key } = req.params;
    
    const result = await db.query('DELETE FROM site_config WHERE key = $1 RETURNING *', [key]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    
    res.json({ message: 'Configuración eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    res.status(500).json({ error: 'Error al eliminar configuración' });
  }
});

module.exports = router;