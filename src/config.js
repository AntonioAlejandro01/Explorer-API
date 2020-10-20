import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import express from "express";

const SETTINGS = config();

export default (app) => {
  app.disable("x-powered-by");

  app.set("env", SETTINGS.parsed.ENV);
  app.set("config", SETTINGS.parsed);

  app.locals.env = app.get("env");
  app.locals.config = app.get("config");

  console.log("config", app.locals.config);

  if (process.env.NODE_ENV !== "test") {
    app.use(logger("combined"));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(fileUpload());
  app.use(express.static(__dirname + "/public"));

  app.use(cors());
};
