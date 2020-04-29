import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import AdmZip from 'adm-zip';
import qrcode from 'qrcode';
import imageDataUri from 'image-data-uri';
//base de datos
import ExplorerDB from './../explorerDB/querys';
//
import writeLog,{deleteFile} from '../utilities';

const router = express.Router();

const TYPE_FILTERS = ['title', 'author', 'topic', 'location'];
const FILE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const OBJECT_KEYS_JSON = ['title', 'author', 'location', 'topic', 'places', 'nombres', 'latitudes', 'longitudes', 'comments'];

router.post('/', (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({
        message: 'Bad Request without files',
      })
      .end();
  }
  //save request data
  const images = req.files.images;
  const routeData = req.body.route;

  if (!images) {
    return res
      .status(400)
      .json({
        message: 'Bad Request key incorrect',
      })
      .end();
  }

  //get new unique name's file
  images.name = `${uuidv4()}${path.extname(images.name)}`;
  let nameQr = uuidv4();
  //zip format validation(without directory and files extensions are correct)
  if (!validateZip(images.data)) {
    return res.status(400).json({ message: "error zip format or file's zip extensions" }).end();
  }
  //zip is Ok

  //validate json format
  let isOk = validateFormatRoute(routeData);
  if (!isOk) {
    return res.status(418).end();
  } else {
    // json is correct

    //create qr
    createQR(JSON.stringify(routeData), (err, uri) => {
      if (err) {
        writeLog(err);
        return res.status(500).json({ message: 'internal error' }).end();
      }
      // have buffer from uri's qr
      let dataUri = imageDataUri.decode(uri);
      let rutaQR = path.join(__dirname, '../storage/qr', `${nameQr}.png`);

      fs.writeFile(rutaQR, dataUri.dataBuffer, (err) => {
        if (err) {
          writeLog(err);
          return res.status(500).json({ message: 'internal error qr file generate' }).end();
        }
        //parser json and insert into database
        const route = JSON.parse(routeData);
        ExplorerDB.insertRoute(
          {
            title: route.title,
            author: route.author,
            topic: route.topic,
            location: route.location,
            places: JSON.stringify(route.places),
            qrKey: nameQr,
            placesKey: images.name.split('.')[0],
          },
          (err, result) => {
            if (err) {
              writeLog(err);
              deleteFile(rutaQR);
              return res.status(500).json({ message: 'internal error' });
            }

            if ((result.response = 'true')) {
              //put zip in final directory for future request for the server can serve
              images.mv(`src/storage/images/${images.name}`, (err) => {
                if (err) {
                  writeLog(err);
                  deleteFile(rutaQR);
                  return res.status(500).json({ message: 'internal error with QR file' }).end();
                }
              });
              return res.status(200).json({ message: 'Ok', key: nameQr }).end();
            } else {
              deleteFile(rutaQR);
              return res.status(500).json({ message: 'internal error' }).end();
            }
          }
        );
      });
    });
  }
});

router.get('/:location', (req, res, next) => {
  writeLog('location information');
  let location = req.params.location;
  if (!location) {
    return res.status(400).json({
      message: 'error with arguments',
    });
  }

  ExplorerDB.getRoutes({
    location,
    callback(err, result) {
      if (err) {
        writeLog(err);
        return res.status(500).json({
          message: 'internal error',
        });
      }

      if (result.length == 0) {
        //empty results
        return res.status(204).json({
          message: "it wasn't found results",
        });
      }

      return res.status(200).json(result).end();
    },
  });
});

router.get('/:filterType/:filterValue', (req, res, next) => {
  let filterType = req.params.filterType.toLowerCase();
  // validate filterType is permited
  if (!TYPE_FILTERS.includes(filterType)) {
    return res.status(400).json({
      message: 'Bad with request',
    });
  }
  let filterValue = req.params.filterValue.toLowerCase();

  ExplorerDB.getRoutesBy({
    filterType: filterType.toLowerCase() == 'location' ? 'loca' : filterType,
    filterValue,
    callback(err, result) {
      if (err) {
        writeLog(err);
        return res.status(500).json({
          message: 'internal error',
        });
      }
      if (result.length == 0) {
        return res.status(204).json({
          message: "it wasn't found results",
        });
      }

      return res.status(200).json(result).end();
    },
  });
});

const validateZip = (source) => {
  let zip = new AdmZip(source);

  let zipEntries = zip.getEntries();
  //check if zip have folder
  if (zipEntries.map((item) => item.isDirectory).includes(true)) {
    return undefined;
  }
  // check if files have correct extension
  if (zipEntries.map((item) => FILE_EXTENSIONS.includes(item.name.split('.')[1])).includes(false)) {
    return undefined;
  }

  return true;
};

const validateFormatRoute = (route) => {
  console.log(route);

  let jRoute = JSON.parse(route);
  console.log(jRoute);

  console.log('\nkeys\n-----');
  console.log(typeof jRoute);

  let first = Object.keys(jRoute)
    .map((item) => {
      OBJECT_KEYS_JSON.includes(item);
      console.log(item);
    })
    .includes(false);
  if (first) {
    //global format is not valid
    return false;
  }
  let places = jRoute.places;
  let second = Object.keys(places)
    .map((item) => OBJECT_KEYS_JSON.includes(item))
    .includes(false);
  if (second) {
    // attribute place format is not valid
    return false;
  }
  if (
    Object.keys(jRoute)
      .map((key) => jRoute[key])
      .includes(false) ||
    Object.keys(places)
      .map((key) => places[key])
      .includes(false)
  ) {
    return false;
  }

  return true;
};

const createQR = (data, callback) => {
  qrcode.toDataURL(data, callback);
};

export default router;
