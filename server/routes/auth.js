// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    // Verificar credenciales
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({ error: 'Configuración de admin incompleta' });
    }
    
    if (email === adminEmail && await bcrypt.compare(password, adminPasswordHash)) {
      const token = jwt.sign(
        { email, role: 'admin', id: 1 },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true,
        token, 
        user: { email, role: 'admin', name: 'Administrador' } 
      });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Verificar token
router.get('/verify', requireAuth, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  });
});

// Logout (solo elimina el token del lado del cliente)
router.post('/logout', requireAuth, (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;