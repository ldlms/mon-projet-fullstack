import express, { json } from "express";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authRoutes from './routes/auth.ts';
import userRoutes from './routes/user.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';
import cors from 'cors';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());
const router = app.router;

const prisma = new PrismaClient({
  adapter,
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/test", (req, res) => res.send("Hello from user-service!"));

router.use('/auth', authRoutes);
router.use('/', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));


