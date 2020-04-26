// rutas para la API

import rutas from './routes/rutas.js';
import images from './routes/images.js';
import topics from './routes/topic.js'

export default app => {
    app.use("/routes",rutas); // obtiene las claves de los qr para la ruta
    app.use("/images",images); // a partir de la clave obtiene las diferentes imagenes
    app.use("/topics",topics); //obtiene todos los temas
}