import express from "express";
import cors from "cors";
import {setupLogging} from "./logging.ts";
import {setupProxies} from "./proxy.ts";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:3000",
  credentials: false
}),
);

setupLogging(app);
setupProxies(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("Hello from API Gateway!"));
app.listen(port, () => {
  console.log(`Server running on port ${port}`)});


