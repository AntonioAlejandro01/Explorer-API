import express from "express";
import config from "./config";
import router from "./router";
//DB
import ExplorerDB from "./explorerDB/querys";
//
import { writeQRTermial } from "./utilities";

let _server;

const server = {
  start() {
    const app = express();

    // config
    config(app);
    //router
    router(app);
    //server
    _server = app.listen(process.env.PORT, () => {
      if (process.env.NODE_ENV !== "test") {
        // start
        console.log("\x1b[31m", "\n\nLocal address", "\x1b[0m");
        writeQRTermial(`http://${process.env.IP}:${process.env.PORT}`);
        console.log(
          `Server open at http://${process.env.HOST}:${process.env.PORT}`
        );
        console.log("Workspace: ", __dirname);
      }
    });
  },
  close() {
    _server.close();
    ExplorerDB.close();
  },
};

export default server;

if (!module.parent) {
  server.start();
}
