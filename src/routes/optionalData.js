import Express from 'express';
// base de datos
import ExplorerDB from '../explorerDB/querys.js';
//
import { writeLog } from '../utilities.js';

const router = Express.Router();

router.get('/:key', (req, res) => {
  const qrKey = req.params.key;
  if (!qrKey) {
    return res.status(400).json({ message: 'Bad request' }).end();
  }

  ExplorerDB.getRouteOptionalData({
    qrKey,
    callback(err, result) {
      if (err) {
        writeLog(err);
        return res.status(500).json({ message: 'internal error' }).end();
      }

      if (result.length == 0) {
        return res.status(204).end();
      }

      return res.status(200).json(result[0]).end();
    },
  });
});

export default router;
