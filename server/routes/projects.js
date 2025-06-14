// server/routes/projects.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/projects - Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM projects';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

// GET /api/projects/:id - Obtener proyecto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
});

// POST /api/projects - Crear nuevo proyecto (protegido)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, tags, downloadUrl, liveUrl, status = 'draft', imageUrl } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }
    
    const result = await db.query(`
      INSERT INTO projects (title, description, tags, download_url, live_url, status, image_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [title, description, tags || [], downloadUrl, liveUrl, status, imageUrl]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
});

// PUT /api/projects/:id - Actualizar proyecto (protegido)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, downloadUrl, liveUrl, status, imageUrl } = req.body;
    
    const result = await db.query(`
      UPDATE projects 
      SET title = $1, description = $2, tags = $3, download_url = $4, 
          live_url = $5, status = $6, image_url = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [title, description, tags || [], downloadUrl, liveUrl, status, imageUrl, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

// DELETE /api/projects/:id - Eliminar proyecto (protegido)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

module.exports = router;