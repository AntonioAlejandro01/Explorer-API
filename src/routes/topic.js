import Express from 'express';
import ExplorerDB from '../explorerDB/querys';

const router = Express.Router();

/**
 * Devuleve al cliente todos los temas disponibles
 */
router.get('/',(req,res,next) => {
    ExplorerDB.getTopics({
        callback(err,result){
            if (err) {
                return res.status(500).json({"message":"Internal Error"})
            }
            let topics = result.map(({topicName}) => topicName);
            return res.status(200).json(topics);

        }
    })
});

export default router;