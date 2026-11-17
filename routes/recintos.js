const express = require('express');
const router = express.Router();
const Recinto = require('../models/recinto');

// 1. GET /recintos - Obtener todos los recintos
router.get('/', async (req, res) => {
  try {
    const resultado = await Recinto.find();

    // Comprobar si no hay resultados
    if (!resultado || resultado.length === 0) {
      return res.status(500).json({
        ok: false,
        error: 'No se han encontrado recintos'
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'No se han encontrado recintos'
    });
  }
});

// 2. GET /recintos/localidad/:nombre - Obtener recintos de una localidad
// Se coloca antes de /:id para evitar que Express confunda 'localidad' con un id
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const resultado = await Recinto.find({ localidad: req.params.nombre });

    // Comprobar si no hay resultados para esa localidad
    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'No se han encontrado recintos de la localidad indicada'
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'No se han encontrado recintos de la localidad indicada'
    });
  }
});

// 3. GET /recintos/:id - Obtener un recinto por su identificador
router.get('/:id', async (req, res) => {
  try {
    const resultado = await Recinto.findById(req.params.id);

    // Si el recinto no existe
    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Recinto ${req.params.id} no encontrado`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    // Si el ID es inválido o falla la consulta
    res.status(404).json({
      ok: false,
      error: `Recinto ${req.params.id} no encontrado`
    });
  }
});

// 4. POST /recintos - Crear un nuevo recinto con datos JSON
router.post('/', async (req, res) => {
  try {
    const nuevoRecinto = new Recinto(req.body);
    const resultado = await nuevoRecinto.save();

    res.status(201).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'Error añadiendo recinto'
    });
  }
});

// 5. DELETE /recintos/:id - Eliminar un recinto por su identificador
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await Recinto.findByIdAndDelete(req.params.id);

    // Si no se encontró el recinto para eliminar
    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Error eliminando recinto ${req.params.id}`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    // Si el ID es inválido o falla la operación
    res.status(404).json({
      ok: false,
      error: `Error eliminando recinto ${req.params.id}`
    });
  }
});

module.exports = router;
