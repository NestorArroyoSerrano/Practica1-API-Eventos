const express = require('express');
const router = express.Router();
const Evento = require('../models/evento');

// 1. GET /eventos - Obtener todos los eventos con los datos del recinto
router.get('/', async (req, res) => {
  try {
    const resultado = await Evento.find().populate('recinto');

    // Comprobar si no hay resultados
    if (!resultado || resultado.length === 0) {
      return res.status(500).json({
        ok: false,
        error: 'No se han encontrado eventos'
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'No se han encontrado eventos'
    });
  }
});

// 2. GET /eventos/localidad/:nombre - Obtener eventos futuros de una localidad
// Se coloca antes de /:id para evitar conflictos de rutas
router.get('/localidad/:nombre', async (req, res) => {
  try {
    // Buscar eventos cuya fecha no haya pasado y poblar la información del recinto
    const eventos = await Evento.find({ fecha: { $gte: new Date() } }).populate('recinto');

    // Filtrar los eventos cuyo recinto corresponda a la localidad indicada
    const resultado = eventos.filter(
      (e) => e.recinto && e.recinto.localidad.toLowerCase() === req.params.nombre.toLowerCase()
    );

    // Comprobar si no se encontraron eventos
    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'No se han encontrado eventos'
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'No se han encontrado eventos'
    });
  }
});

// 7. GET /eventos/entradas/:idEvento/:tipoEntrada - Obtener precio y disponibles de un tipo de entrada
// Se coloca antes de /:id para evitar colisiones
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.idEvento);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
      });
    }

    // Buscar el tipo de entrada solicitado (sin distinguir mayúsculas/minúsculas)
    const entrada = evento.entradas.find(
      (e) => e.tipo.toLowerCase() === req.params.tipoEntrada.toLowerCase()
    );

    if (!entrada) {
      return res.status(404).json({
        ok: false,
        error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
      });
    }

    // Devolver exclusivamente precio y disponibles
    res.status(200).json({
      ok: true,
      resultado: {
        precio: entrada.precio,
        disponibles: entrada.disponibles
      }
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
    });
  }
});

// 8. PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad - Restar entradas disponibles
// Se coloca antes de /:id para evitar colisiones
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
  try {
    const cantidad = Number(req.params.cantidad);

    // Validar que la cantidad sea un número entero y mayor que cero
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(404).json({
        ok: false,
        error: `Error actualizando entradas del evento ${req.params.idEvento}`
      });
    }

    // Actualización atómica con findOneAndUpdate, $elemMatch e $inc
    const resultado = await Evento.findOneAndUpdate(
      {
        _id: req.params.idEvento,
        entradas: {
          $elemMatch: {
            tipo: new RegExp(`^${req.params.tipoEntrada}$`, 'i'),
            disponibles: { $gte: cantidad }
          }
        }
      },
      {
        $inc: { 'entradas.$.disponibles': -cantidad }
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Si no existe el evento, el tipo de entrada o no hay suficientes entradas disponibles
    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Error actualizando entradas del evento ${req.params.idEvento}`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error actualizando entradas del evento ${req.params.idEvento}`
    });
  }
});

// 3. GET /eventos/:id - Obtener un evento por su identificador
router.get('/:id', async (req, res) => {
  try {
    const resultado = await Evento.findById(req.params.id).populate('recinto');

    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Evento ${req.params.id} no encontrado`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Evento ${req.params.id} no encontrado`
    });
  }
});

// 4. POST /eventos - Crear un evento
router.post('/', async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    const resultado = await nuevoEvento.save();

    res.status(201).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'Error añadiendo evento'
    });
  }
});

// 5. PUT /eventos/:id - Actualizar un evento por su identificador
router.put('/:id', async (req, res) => {
  try {
    const resultado = await Evento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Error actualizando evento ${req.params.id}`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error actualizando evento ${req.params.id}`
    });
  }
});

// 6. DELETE /eventos/:id - Eliminar un evento por su identificador
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await Evento.findByIdAndDelete(req.params.id);

    if (!resultado) {
      return res.status(404).json({
        ok: false,
        error: `Error eliminando evento ${req.params.id}`
      });
    }

    res.status(200).json({
      ok: true,
      resultado
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error eliminando evento ${req.params.id}`
    });
  }
});

module.exports = router;
