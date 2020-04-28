import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import extract from 'extract-zip';
import jsQR from 'jsqr';

//base de datos
import ExplorerDB from "./../explorerDB/querys";
//

const router = express.Router();

const TYPE_FILTERS = ["title", "author", "topic", "location"];
const FILE_EXTENSIONS = ["zip", "png", "jpg", "jpeg"];
const OBJECT_KEYS_JSON = ["title","author","location","topic","places","nombres","latitudes","longitudes","comments"];

router.post("/", (req, res, next) => {
    let qr = req.files.qr;
    let images = req.files.images;
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
        if (err) return res.status(500).json({ 'message': 'Internal Error with images' }).end();
    });

    let pathImages;
    try {
        // se guarda la ruta donde se han descomprimido las imagenes si todo ha ido bien
        pathImages = extractZipTo(`src/tmp/${images.name}`, `${__dirname.substring(0, __dirname.length - 6)}`, (images.name).split('.')[0])
    } catch (err) {
        console.log('ERROR EN ZIP TYPE:>', err);
        res.status(500).json({ "message": err });
    }

    let pathQr = path.join('src/tmp/',qr.name);

    qr.mv(pathQr, err => {
        if(err) return res.status(500).json({'message':'internal error with QR'}).end();
    });

    
    const pixelsArray = getPixelsArray(pathQr);
   
    
    const qrData = jsQR(pixelsArray,image.width,image.height);
    const routeData = qrData.data;

   

    let isOk = validateFormatRoute(routeData);

    if (!isOk) {
        deleteQrAndPlacesImages(pathQr,pathImages);
        return res.status(418).end();
    }
    const route = JSON.parse(routeData);
    ExplorerDB.insertRoute({
        "title": route.title,
        "author": route.author,
        "topic": route.topic,
        "location": route.location,
        "places": route.places,
        "qrKey": qr.name.split('.')[0],
        "placesKey": images.name.split('.')[0], 
    }, (err,result) => {
        if (err){
            deleteQrAndPlacesImages(pathQr,pathImages);
            return res.status(500).json({"message":"internal error"});
        }
        
        let ({response}) = result;
        
        if(response = 'true'){
            // mover el qr a la carpeta storage/qr
            fs.rename(pathQr, `src/storage/qr/${pathQr.substring(6)}`);
            // mover la carpeta de images en tmp a storage/images
            fs.rename(pathImages, `src/storage/images/${pathImages.substring(6)}`);
            return res.status(200).json({ 'message': 'Ok' }).end();
        }
        else {
            deleteQrAndPlacesImages(pathQr,pathImages);
            return res.status(500).json({"message":"internal error"}).end();
        }

    });
});

router.get("/:location", (req, res, next) => {
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

            let rutas = result.map(({ qrKey,stars,placesKey }) => {qrKey,stars,placesKey});

            if (rutas.length == 0) {
                // no hay ninguna ruta
                return res.status(204).json({
                    message: "it wasn't found results",
                });
            }

            return res.status(200).json(rutas).end();
            
        },
    });
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

            let rutas = result.map(({ qrKey,stars,placesKey }) => {qrKey,stars,placesKey});

            if (rutas.length == 0) {
                return res.status(204).json({
                    message: "it wasn't found results",
                });
            }

            return res.status(200).json(rutas).end();
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



const getPixelsArray = path => {
    let image = new Image();
    image.src = path;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    return ctx.createImageData().data;
}

const validateFormatRoute = route => {
    let jRoute = JSON.parse(route);
    let first = Object.keys(jRoute).map(item => OBJECT_KEYS_JSON.includes(item)).includes(false);
    if (first) {
        // formato no valido
        return false;
    }
    let places = jRoute.places;
    let second = Object.keys(places).map(item => OBJECT_KEYS_JSON.includes(item)).includes(false);
    if (second) {
        // formato no valido
        return false;
    }
    if(Object.keys(jRoute).map(key => jRoute[key]).includes(false) || Object.keys(places).map(key => places[key]).includes(false) ) {
        return false;
    }

    return true;
}


const deleteQrAndPlacesImages = (pathQr,pathPlaces) => {
    fs.unlink(pathQr,err => {
        if (err) {
            console.log('Error:>',err);
        }
        else{
            console.log("Fichero",pathQr,"Eliminado.");
        }
    });
    fs.unlink(pathPlaces, err => {
        if (err) {
            console.log('Error:>',err);
        }
        else{
            console.log("Fichero",pathQr,"Eliminado.");
        }
    });
}



export default router;
