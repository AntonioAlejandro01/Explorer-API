import explorerDB from './explorerDB';


const ExplorerDB = {

    getTopics({ callback = (err, result) => { } }) { // llamada a la API en el GET endpoint /topic 
        if (typeof callback != 'function') throw 'parameter type error';

        explorerDB.query('SELECT topicName from Explorer.Topic', [], callback);
    },
    getRoutesBy({ filterType, filterValue, callback = (err, result) => { } }) {// llamada a la api en el endpoint GET /routes/:fiterType/:filterValue
        if (typeof callback != 'function') throw 'parameter type error';

        explorerDB.query('SELECT qrKey FROM Explore.Route WHERE ? = ?', [filterType, filterValue], callback);

    },
    getRoutes(location, { callback = (err, result) => { } }) {// llamada a la api en el endpoint GET /route
        if (typeof callback != 'function') throw 'parameter type error';

        explorerDB.query('SELECT qrKey FROM Explorer.Route where location = ?', [location], callback);
    },
    insertRoute({ title, author, topic, location, places, qrKey, placesKey }, callbackAfterInsert = (err, result) => { }, callbackAfterGetLastRoute = undefined) { // llamda a la API en el endpoint POST /route
        if (typeof callback != 'function') throw 'parameter type error';
        explorerDB.query('CALL resgiterRoute(?,?,?,?,?,?,?)', [title, (!author) ? null : author, topic, location, places, qrKey, placesKey], (err, result) => {
            callbackAfterInsert(err, result);
            if (callbackAfterGetLastRoute) {
                defaultCallbackToInsert(callbackAfterGetLastRoute);
            }

        });
    },
    close() {
        explorerDB.end();
    }



}


const defaultCallbackToInsert = (callback = (err, result) => { }) => {
    if (typeof callback != 'function') throw 'parameter type error';
    explorerDB.query('SELECT title,autor,topic,location,places,qrKey,placesKey FROM Explorer.Route order by id desc limit 1', [], callback);
}

export default ExplorerDB;