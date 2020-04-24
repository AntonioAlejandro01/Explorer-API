import express from "express";
import sha256file from "sha256-file";
import fs from "fs";
import qrParser from "qrcode-parser";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import extract from 'extract-zip';

//base de datos
import ExplorerDB from "./../explorerDB/querys";
//


const router = express.Router();

const TYPE_FILTERS = ["title", "author", "topic", "location"];
const FILE_EXTENSIONS = ["zip", "png", "jpg", "jpeg"];

router.get("/:location", (req, res, next) => {
    //me devuleve las mejores rutas(titulo de la foto qr que es su hash por lo que es unico) de su localizacion
    let location = req.params.location;
    if (!location) {
        return res.status(400).json({
            message: "error with arguments",
        });
    }

    ExplorerDB.getRoutes({
        location,
        callback(err, result) {
            if (err)
                return res.status(500).json({
                    message: "internal error",
                });

            let rutas = result.map(({ imageQR }) => imageQR);

            if (rutas.length == 0) {
                // no hay ninguna ruta
                return res.status(204).json({
                    message: "it wasn't found results",
                });
            }

            res.status(200).json(rutas);
            return res.end();
        },
    });
});

/*

    Estructura JSON Ruta: 
    {
        title:'Nombre de la ruta',
        author: 'Autor de la ruta (Puede ser nulo. En ese caso contendrá =>  '')',
        location: 'Lugar donde el usuario ha escrito que es la ruta',
        topic: Tema de que trata la ruta
        places: 'Los lugares en formato JSON',

    }

    Estructura JSON Places
    {
        nombres:[Paco,juan,antonio],
        latitudes:[],
        longitudes[],
        comments:[],
        stars:[],
    }


*/

router.post("/", (req, res, next) => {
    let qr = req.files.qr;
    let images = req.files.images;
    //console.log(files);
    if (!qr || !images) {
        return res
            .status(400)
            .json({
                message: "Bad Request",
            })
            .end();
    }
    //establecer nuevos nombres con los identificadores uuid
    qr.name = `${uuidv4()}${path.extname(qr.name)}`;
    images.name = `${uuidv4()}${path.extname(images.name)}`;
    
    // colocar ficheros en carpeta TMP para poder descomprimirlo
    images.mv(`src/tmp/${images.name}`, err => {
        if (err) return res.status(500).json({ 'message': 'Internal Error' }).end();
    });

    let pathImages;
    try {
        // se guarda la ruta donde se han descomprimido las imagenes si todo ha ido bien
        pathImages = extractZipTo(`src/tmp/${images.name}`, `${__dirname.substring(0, __dirname.length - 6)}`, (images.name).split('.')[0])
    } catch (err) {
        console.log('ERROR EN ZIP TYPE:>', err);
        res.status(500).json({ "message": 'Internal error' });
    }
    //revisar ahora QR

    //  revisar el fichero zip

    /*
        let imagesPlaces;
        let ruta;
        qrParser(qr).then(respuesta => {
            let jsonRuta = JSON.parse(respuesta.data);

            let [title, author, location, topic, places] = {
                jsonRuta
            };
            ruta = {
                title,
                author,
                location,
                topic,
                places,
                imageQR,
                imagesPlaces,
            };

            ExplorerDB.insertRoute(ruta,
                (err, result) => {
                    if (err) res.status(500).json({
                        "Message": "Internal Error"
                    })
                    console.log("Insertado con resultado: ", result);

                    //valido
                    // mover ficheros


                    res.status(200).json({
                        'message': 'Ruta Registrada'
                    }).end();
                }
            );




        })
        
        */


    //Si los ficheros son validos
    // mover la carpeta de images en tmp a storage/images
    fs.rename(pathImages, `src/storage/images/${pathImages.substring(6)}`);
    // mover el qr a la carpeta storage/qr

    //
    console.log("Images que contiene el qr", qr.name);
    console.log("Zip que contiene las imagenes", path.extname(images.name));

    //comprobar ficheros

    return res.status(200).json({ 'message': 'Ok' }).end();
});

router.get("/:filterType/:filterValue", (req, res, next) => {
    let filterType = req.params.filterType.toLowerCase();
    if (!TYPE_FILTERS.includes(filterType)) {
        // el filtro no es valido
        return res.status(400).json({
            message: "Bad with request",
        });
    }
    let filterValue = req.params.filterValue.toLowerCase();

    ExplorerDB.getRoutesBy({
        filterType,
        filterValue,
        callback(err, result) {
            if (err)
                return res.status(500).json({
                    message: "internal error",
                });

            let rutas = result.map(({ imageQR }) => imageQR);

            if (rutas.length == 0) {
                return res.status(204).json({
                    message: "it wasn't found results",
                });
            }

            res.status(200).json(rutas);
            return res.end();
        },
    });
});
const extractZipTo = async (source, dirname, filename) => {
    try {
        let pathDirectory = path.join(dirname, `tmp/${filename}`);
        // espero a que se descomprima el zip
        await extract(source, { dir: pathDirectory });
        // leo los fichero que contiene
        fs.readdir(pathDirectory, (err, files) => {
            if (err) throw err;
            console.log('Listado de Ficheros');
            console.log(files);


            let haveDirectories = files.map(item => fs.lstatSync(path.join(dirname, '/tmp/', filename, '/', item)).isDirectory() ? undefined: item).includes(undefined);
            
            if (haveDirectories){ // el zip tiene directorios . FORMAT ERROR
                throw 'ZIP FORMAT ERROR.';
            }
            // comprobar la extension de todos los ficheros
            let haveIncorrectExtensions = files.map(item => path.extname(item) != FILE_EXTENSIONS[0] && FILE_EXTENSIONS.includes(path.extname(item))).includes(false);

            if (haveIncorrectExtensions){
                throw 'one or more files have incorrect extension';
            }
            // TODO: WORK
            
            console.log("ZIP format and images format are OK!!!");
            
            if (directorios == 0) { //  no hay carpetas // valido
                if (files.length == files.filter(item => path.extname(item) != 'zip' && FILE_EXTENSIONS.includes(path.extname(item)))) {
                    // todos los ficheros tienen la extension correcta
                    console.log('Ficheros de zip correctos');
                    fs.rmdir(pathDirectory, err => { console.log(err); })
                    return source;
                }
            }
            // no valido
            fs.unlink(source, err => { console.log(err); })
            fs.rmdir(pathDirectory, err => { console.log(err); })
            throw 'file extension or format error';

        });
    } catch (error) {
        console.log('EERROORR', error);
        throw error.message;

    }

}



export default router;
