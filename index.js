require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Importar los enrutadores de la aplicación
const recintosRouter = require('./routes/recintos');
const eventosRouter = require('./routes/eventos');

// Crear la aplicación de Express
const app = express();

// Configuración de puertos y URI de conexión
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventos';

// Middleware para procesar peticiones con cuerpo en formato JSON
app.use(express.json());

// Montar los enrutadores en sus rutas correspondientes
app.use('/recintos', recintosRouter);
app.use('/eventos', eventosRouter);

// Conexión a MongoDB e inicio del servidor
async function iniciarServidor() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexión con MongoDB establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
