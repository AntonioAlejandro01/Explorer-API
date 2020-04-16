// rutas para la API

import rutas from './routes/rutas';
import images from './routes/images';

export default app => {
//  app.use("/",documentation) => Documentacion para 
    app.use("/routes",rutas); // obtiene las claves de los qr para la ruta
    app.use("/images",images); // a partir de la clave obtiene las diferentes imagenes
}