// server/routes/skills.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/skills - Obtener todos los skills
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM skills';
    let params = [];
    
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY category, level DESC, name';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener skills:', error);
    res.status(500).json({ error: 'Error al obtener skills' });
  }
});

// GET /api/skills/categories - Obtener categorías únicas
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT category FROM skills ORDER BY category');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /api/skills/:id - Obtener skill específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM skills WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener skill:', error);
    res.status(500).json({ error: 'Error al obtener skill' });
  }
});

// POST /api/skills - Crear nuevo skill (protegido)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, level, category, iconUrl } = req.body;
    
    if (!name || level === undefined || !category) {
      return res.status(400).json({ error: 'Nombre, nivel y categoría son requeridos' });
    }
    
    if (level < 0 || level > 100) {
      return res.status(400).json({ error: 'El nivel debe estar entre 0 y 100' });
    }
    
    const result = await db.query(`
      INSERT INTO skills (name, level, category, icon_url, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [name, level, category, iconUrl]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear skill:', error);
    res.status(500).json({ error: 'Error al crear skill' });
  }
});

// PUT /api/skills/:id - Actualizar skill (protegido)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, category, iconUrl } = req.body;
    
    if (level !== undefined && (level < 0 || level > 100)) {
      return res.status(400).json({ error: 'El nivel debe estar entre 0 y 100' });
    }
    
    const result = await db.query(`
      UPDATE skills 
      SET name = $1, level = $2, category = $3, icon_url = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [name, level, category, iconUrl, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar skill:', error);
    res.status(500).json({ error: 'Error al actualizar skill' });
  }
});

// DELETE /api/skills/:id - Eliminar skill (protegido)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill no encontrado' });
    }
    
    res.json({ message: 'Skill eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar skill:', error);
    res.status(500).json({ error: 'Error al eliminar skill' });
  }
});

module.exports = router;