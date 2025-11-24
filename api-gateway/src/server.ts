import express from "express";
import {setupLogging} from "./logging.ts";
import {setupProxies} from "./proxy.ts";

const app = express();
const port = process.env.PORT || 5000;

setupLogging(app);
setupProxies(app);


app.get("/", (req, res) => res.send("Hello from API Gateway!"));
app.listen(port, () => console.log(`Server running on port ${port}`));