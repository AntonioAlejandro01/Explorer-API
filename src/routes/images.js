import express from "express";
import fs from "fs";

const router = express.Router();

router.get('/places/:key', (req, res, next) => { // Devuelvo las imagenes de los lugares
    let key = req.params.key;

    fs.readdir('src/storage/images', (err,files) => {
        if(err) return res.status(500).json({'message':'internal error'});

        for(let i = 0; i < files.length; i++){
            if (files[i].substring(0,files[i].lastIndexOf('.')) == key) {
                let fd = fs.createReadStream(`src/storage/images/${files[i]}`);
                res.setHeader('Content-Type','application/zip');
                return fd.pipe(res);
            } 
        }

        res.status(204).json({"message":"Image not found"});
        return res.end();
    });
});

router.get('/QR/:key', (req, res, next) => { // Devuelve la imagen qr con los datos de la ruta
    let key = req.params.key;

    fs.readdir('src/storage/qr', (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) return res.status(500).json({ "message": "internal error" });

        for (let i = 0; i < files.length; i++) {
            let [, extension] = files[i].split('.');

            if (files[i].substring(0, files[i].lastIndexOf('.')) == key) {// foto encontrada
                let fd = fs.createReadStream(`src/storage/qr/${files[i]}`);
                res.setHeader('Content-Type', `image/${extension}`);

                return fd.pipe(res);
            }

        }

        res.status(204).json({"message":"Image not found"});
        return res.end();
    });
});





export default router;