import Express from 'express';


// base de datos
import ExplorerDB from '../explorerDB/querys.js';

const router = Express.Router();

router.get('/:key', (req,res) => {
    const qrKey = req.params.key;
    if (!qrKey) {
        return res.status(204).json({"message":"Bad request"}).end();
    }

    ExplorerDB.getRouteOptionalData({
        qrKey,
        callback(err,result){
            console.log(result);
            
            if (err) return res.status(500).json({"message":"internal error"}).end();

            if(result.length == 0){
                return res.status(200).json({"message":"empty results"}).end();
            }

            return res.status(200).json(result[0]).end();
        }

    });




});






export default router;