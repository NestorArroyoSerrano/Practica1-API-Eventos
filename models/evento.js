const mongoose = require('mongoose');

// Esquema de entradas (se utilizará como subdocumento dentro del evento)
const entradaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de entrada es obligatorio'],
    minlength: [3, 'El tipo de entrada debe tener al menos 3 caracteres'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio de la entrada es obligatorio'],
    min: [0, 'El precio debe ser mayor o igual a 0']
  },
  disponibles: {
    type: Number,
    required: [true, 'El número de entradas disponibles es obligatorio'],
    min: [0, 'Las entradas disponibles deben ser mayor o igual a 0'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} debe ser un número entero'
    }
  }
});

// Esquema principal de eventos
const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del evento es obligatorio'],
    minlength: [5, 'El nombre del evento debe tener al menos 5 caracteres'],
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del evento es obligatoria']
  },
  entradas: [entradaSchema],
  recinto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recintos',
    required: [true, 'El recinto es obligatorio']
  }
});

// Modelo 'eventos' exigido por el enunciado
const Evento = mongoose.model('eventos', eventoSchema);

module.exports = Evento;
