// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Crear directorio uploads si no existe
const ensureUploadsDir = async () => {
  const uploadDir = path.join(__dirname, '../../uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Configuración de multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = await ensureUploadsDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 
    'application/zip', 'application/x-zip-compressed',
    'application/octet-stream'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// GET /api/upload - Obtener archivos
router.get('/', requireAuth, async (req, res) => {
  try {
    const { type, projectId } = req.query;
    
    let query = 'SELECT * FROM media_files';
    let params = [];
    let conditions = [];

    if (type) {
      conditions.push('file_type = $' + (params.length + 1));
      params.push(type);
    }

    if (projectId) {
      conditions.push('project_id = $' + (params.length + 1));
      params.push(projectId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
});

// POST /api/upload - Subir archivo
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // Determinar tipo de archivo
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype === 'application/pdf' || 
               req.file.mimetype === 'text/plain') {
      fileType = 'document';
    } else if (req.file.mimetype.includes('zip') || 
               req.file.mimetype === 'application/octet-stream') {
      fileType = 'executable';
    }

    // Guardar en base de datos
    const result = await db.query(`
      INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, file_type, project_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.size,
      req.file.mimetype,
      fileType,
      req.body.projectId || null
    ]);

    res.json({
      success: true,
      file: result.rows[0],
      url: `/uploads/${req.file.filename}`
    });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// DELETE /api/upload/:id - Eliminar archivo
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener info del archivo
    const fileResult = await db.query('SELECT * FROM media_files WHERE id = $1', [id]);
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const file = fileResult.rows[0];

    // Eliminar archivo físico
    try {
      await fs.unlink(file.file_path);
    } catch (error) {
      console.warn('No se pudo eliminar archivo físico:', error.message);
    }

    // Eliminar de base de datos
    await db.query('DELETE FROM media_files WHERE id = $1', [id]);

    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

module.exports = router;