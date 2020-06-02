import Express from 'express';
import ExplorerDB from '../explorerDB/querys';
import { writeLog } from '../utilities';

const router = Express.Router();

/**
 * Devuelve al cliente todos los temas disponibles
 */
router.get('/', (req, res, next) => {
  ExplorerDB.getTopics({
    callback(err, result) {
      if (err) {
        writeLog(err);
        return res.status(500).json({ message: 'Internal Error' });
      }
      let topics = result.map(({ topicName }) => topicName);
      if (topics.length == 0) {
        return res.status(204).end();
      }
      return res.status(200).json(topics);
    },
  });
});

export default router;
