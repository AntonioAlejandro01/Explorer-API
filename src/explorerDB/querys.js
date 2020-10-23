import explorerDB from "./explorerDB";

const ExplorerDB = {
  getTopics({ callback = (err, result) => {} }) {
    // llamada a la API en el GET endpoint /topic
    throwError(callback);

    explorerDB.query("SELECT topicName from Explorer.Topic", [], callback);
  },
  getRoutesBy({ filterType, filterValue, callback = (err, result) => {} }) {
    // llamada a la api en el endpoint GET /routes/:fiterType/:filterValue
    throwError(callback);

    let query =
      filterType == "topic"
        ? "SELECT title,qrKey FROM Explorer.Route WHERE topic in (SELECT id from Explorer.Topic where topicName = ?)"
        : `SELECT title, qrKey FROM Explorer.Route WHERE ${filterType} = ?`;

    explorerDB.query(query, [filterValue], callback);
  },
  getRoutes({ location, callback = (err, result) => {} }) {
    // llamada a la api en el endpoint GET /route
    throwError(callback);
    explorerDB.query(
      "SELECT title,qrKey FROM Explorer.Route where loca = ?",
      [location],
      callback
    );
  },
  getRouteOptionalData({ qrKey, callback = (err, result) => {} }) {
    throwError(callback);

    explorerDB.query(
      "SELECT stars, creationDate  FROM Explorer.Route INNER JOIN Explorer.CreationsLog on Explorer.Route.id = Explorer.CreationsLog.idRoute WHERE Explorer.Route.qrkey = ?",
      [qrKey],
      callback
    );
  },
  insertRoute(
    { title, author, topic, location, places, qrKey },
    callbackAfterInsert = (err, result) => {},
    callbackAfterGetLastRoute = undefined
  ) {
    // llamda a la API en el endpoint POST /route
    throwError(callbackAfterInsert);
    explorerDB.query(
      "CALL registerRoute(?,?,?,?,?,?)",
      [title, !author ? null : author, topic, location, places, qrKey],
      (err, result) => {
        callbackAfterInsert(err, result);
        if (callbackAfterGetLastRoute) {
          defaultCallbackToInsert(callbackAfterGetLastRoute);
        }
      }
    );
  },
  registerDownload(qrkeys = []) {
    if (!qrkeys) {
      return;
    }
    qrkeys.forEach((key) => {
      explorerDB.query(
        "CALL registerDowload((select id from Explorer.Route where qrKey = ?))",
        [key],
        (err, result) => {}
      );
    });
  },
  close() {
    explorerDB.end();
  },
};

const defaultCallbackToInsert = (callback = (err, result) => {}) => {
  throwError(callback);
  explorerDB.query(
    "SELECT title,author,topic,loca,places,qrKey FROM Explorer.Route order by id desc limit 1",
    [],
    callback
  );
};

const throwError = (callback) => {
  if (typeof callback != "function") throw "parameter type error";
};

export default ExplorerDB;
