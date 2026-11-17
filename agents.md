
# Instrucciones del proyecto: API REST de Eventos

## 1. Descripción general

Desarrollar una API REST utilizando Node.js, Express y Mongoose para gestionar eventos, sus entradas y los recintos donde se celebran.

El proyecto corresponde a una práctica de 2º de DAM de Despliegue de Aplicaciones Web.

Es obligatorio respetar el enunciado del profesor, especialmente los nombres de campos, las rutas, los códigos HTTP y la estructura de carpetas.

## 2. Tecnologías

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- Render

Utilizar CommonJS en todo el proyecto:
- require() para importar módulos.
- module.exports para exportar módulos.

No utilizar ES Modules.

## 3. Estructura obligatoria

La estructura del proyecto debe ser exactamente:

- models/
  - evento.js
  - recinto.js
- routes/
  - eventos.js
  - recintos.js
- index.js
- package.json
- agents.md

No crear carpetas adicionales como controllers, services o middlewares.

## 4. Modelo de datos: Evento

Crear el esquema y modelo en models/evento.js.

El modelo debe llamarse eventos.

Campos:

- nombre: String, obligatorio y con longitud mínima de 5 caracteres.
- fecha: Date, obligatorio.
- entradas: Array de subdocumentos del esquema de entradas.
- recinto: ObjectId que referencia al modelo recintos. Obligatorio.

## 5. Modelo de datos: Entrada

Definir el esquema de entradas dentro de models/evento.js.

Campos:

- tipo: String, obligatorio y longitud mínima de 3 caracteres.
- precio: Number, obligatorio y mínimo 0.
- disponibles: Number, obligatorio, entero y mínimo 0.

Las entradas deben almacenarse como subdocumentos dentro de cada evento.

## 6. Modelo de datos: Recinto

Crear el esquema y modelo en models/recinto.js.

El modelo debe llamarse recintos.

Campos:

- nombre: String, obligatorio y longitud mínima de 5 caracteres.
- direccion: String, obligatorio y longitud mínima de 10 caracteres.
- localidad: String, obligatorio y longitud mínima de 3 caracteres.
- aforoMaximo: Number, opcional.

## 7. Endpoints de recintos

Definir todas las rutas en routes/recintos.js.

GET /recintos
- Obtener todos los recintos.
- Código 200 si existen.
- Código 500 si no hay resultados o falla la consulta.
- Respuesta: { ok: true, resultado: [...] } o { ok: false, error: "No se han encontrado recintos" }.

GET /recintos/:id
- Obtener un recinto por su identificador.
- Código 200 si existe.
- Código 404 si no existe o falla la consulta.
- Mensaje: "Recinto X no encontrado".

GET /recintos/localidad/:nombre
- Obtener recintos de una localidad.
- Código 200 si existen.
- Código 404 si no hay resultados o falla la consulta.
- Mensaje: "No se han encontrado recintos de la localidad indicada".

POST /recintos
- Crear un recinto utilizando los datos recibidos en JSON.
- Código 201 si se crea correctamente.
- Código 500 si falla.
- Mensaje de error: "Error añadiendo recinto".

DELETE /recintos/:id
- Eliminar un recinto por su identificador.
- Código 200 si se elimina correctamente.
- Código 404 si no existe o falla la operación.
- Mensaje: "Error eliminando recinto X".

## 8. Endpoints de eventos

Definir todas las rutas en routes/eventos.js.

GET /eventos
- Obtener todos los eventos.
- Incluir toda la información del recinto mediante populate().
- Incluir también las entradas.
- Código 200 si existen resultados.
- Código 500 si no hay resultados o falla la consulta.
- Mensaje: "No se han encontrado eventos".

GET /eventos/:id
- Obtener un evento por su identificador.
- Código 200 si existe.
- Código 404 si no existe o falla la consulta.
- Mensaje: "Evento X no encontrado".

GET /eventos/localidad/:nombre
- Obtener eventos de una localidad cuya fecha todavía no haya pasado.
- Utilizar populate() para acceder a la localidad del recinto.
- Código 200 si existen resultados.
- Código 404 si no hay resultados o falla la consulta.
- Mensaje: "No se han encontrado eventos".

POST /eventos
- Crear un evento con los datos recibidos mediante JSON.
- Código 201 si se crea correctamente.
- Código 500 si falla.
- Mensaje: "Error añadiendo evento".

PUT /eventos/:id
- Actualizar un evento por su identificador.
- Código 200 si se actualiza correctamente.
- Código 404 si no existe o falla la operación.
- Mensaje: "Error actualizando evento X".

DELETE /eventos/:id
- Eliminar un evento por su identificador.
- Código 200 si se elimina correctamente.
- Código 404 si no existe o falla la operación.
- Mensaje: "Error eliminando evento X".

## 9. Endpoints de entradas

GET /eventos/entradas/:idEvento/:tipoEntrada
- Buscar las entradas de un evento por su identificador y tipo.
- Devolver únicamente precio y disponibles dentro de resultado.
- Código 200 si se encuentran.
- Código 404 si no existen o falla la consulta.
- Mensaje: "Error obteniendo datos de entrada para evento X".

PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad
- Descontar la cantidad indicada de las entradas disponibles.
- Comprobar que la cantidad sea válida y que existan suficientes entradas.
- No permitir cantidades negativas ni cero.
- Código 200 si la operación se realiza correctamente.
- Código 404 si falla la operación o no hay suficientes entradas.
- Mensaje: "Error actualizando entradas del evento X".

La actualización debe realizarse de forma que nunca se puedan vender más entradas de las disponibles.

## 10. Formato de las respuestas

Todas las respuestas deben incluir el campo booleano ok.

Respuestas satisfactorias:
{ ok: true, resultado: ... }

Respuestas con error:
{ ok: false, error: "..." }

Respetar exactamente los nombres de los campos y mensajes establecidos en el enunciado.

## 11. Servidor principal

Crear index.js con las siguientes responsabilidades:

- Importar las librerías necesarias.
- Conectar con MongoDB mediante Mongoose.
- Utilizar express.json() para procesar peticiones JSON.
- Cargar los enrutadores de eventos y recintos.
- Registrar las rutas /eventos y /recintos.
- Iniciar el servidor en un puerto configurable mediante process.env.PORT.
- Gestionar los errores de conexión.

## 12. Normas de programación

- Utilizar CommonJS en todo el proyecto.
- Utilizar async/await en todos los endpoints.
- Gestionar errores mediante try/catch.
- Utilizar códigos HTTP adecuados y respetar los indicados en el enunciado.
- Mantener un código sencillo, claro y comprensible para un estudiante de 2º de DAM.
- Utilizar nombres de variables descriptivos.
- Añadir comentarios cuando ayuden a comprender el código.
- No introducir librerías o arquitecturas innecesarias.
- No cambiar la estructura obligatoria.
- No inventar endpoints adicionales.
- Mantener los nombres de campos exactamente como aparecen en el enunciado.

## 13. Desarrollo y despliegue

La aplicación debe funcionar primero en local.

Posteriormente se conectará a MongoDB Atlas y se desplegará en Render.

Las credenciales de MongoDB deben almacenarse en variables de entorno. Nunca incluir contraseñas en el código ni subir archivos con credenciales a GitHub.

## 14. Instrucciones para Antigravity

Antes de generar o modificar código:

1. Leer estas instrucciones completas.
2. Respetar el enunciado de la práctica.
3. Revisar los archivos existentes antes de modificarlos.
4. No eliminar ni modificar archivos sin necesidad.
5. Explicar qué archivos se van a crear o modificar.
6. No instalar dependencias innecesarias.
7. No dar por finalizada una tarea sin comprobar los resultados.

El objetivo es desarrollar una API REST funcional, sencilla y completamente ajustada a los criterios de evaluación del profesor.

