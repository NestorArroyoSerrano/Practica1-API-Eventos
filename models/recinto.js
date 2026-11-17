const mongoose = require('mongoose');

// Esquema para los recintos donde se celebran eventos
const recintoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del recinto es obligatorio'],
    minlength: [5, 'El nombre debe tener al menos 5 caracteres'],
    trim: true
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    minlength: [10, 'La dirección debe tener al menos 10 caracteres'],
    trim: true
  },
  localidad: {
    type: String,
    required: [true, 'La localidad es obligatoria'],
    minlength: [3, 'La localidad debe tener al menos 3 caracteres'],
    trim: true
  },
  aforoMaximo: {
    type: Number,
    min: [0, 'El aforo máximo debe ser mayor o igual a 0']
  }
});

// Modelo 'recintos' exigido por el enunciado
const Recinto = mongoose.model('recintos', recintoSchema);

module.exports = Recinto;
