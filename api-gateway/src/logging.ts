import morgan from "morgan";
import {type Express} from "express";

export function setupLogging(app: Express) {
    app.use(morgan("combined"));
}