import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import imageDataUri from 'image-data-uri';
//base de datos
import ExplorerDB from './../explorerDB/querys';
//
import createQR, { deleteFile, writeLog } from '../utilities';
import validateFormatRoute, { validateZip } from '../validaciones';

const TYPE_FILTERS = ['title', 'author', 'topic', 'location'];

const router = express.Router();

router.post('/', (req, res) => {
  const routeData = req.body;

  //get new unique name's file to QR
  let nameQr = uuidv4();

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
          return res
            .status(500)
            .json({ message: 'internal error qr file generate' })
            .end();
        }
        //parser json and insert into database
        const route = routeData;
        ExplorerDB.insertRoute(
          {
            title: route.title,
            author: route.author,
            topic: route.topic,
            location: route.location,
            places: JSON.stringify(route.places),
            qrKey: nameQr,
          },
          (err, result) => {
            if (err) {
              writeLog(err);
              deleteFile(rutaQR);
              console.log(err);

              return res.status(500).json({ message: 'internal error' });
            }

            if ((result.response = 'true')) {
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
      ExplorerDB.registerDownload(result.map(({ qrKey }) => qrKey));
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
      ExplorerDB.registerDownload(result.map(({ qrKey }) => qrKey));
      return res.status(200).json(result).end();
    },
  });
});

export default router;
