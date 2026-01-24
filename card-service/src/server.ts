import express, { json } from "express";
import {PrismaClient} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

const prisma = new PrismaClient({
  adapter,
});

app.use(json());

const port = process.env.PORT || 5002;


app.get("/", (req, res) => res.send("Hello from card-service!"));

app.get('/test', (req, res) =>  res.send('/test of API of cardService'));

app.listen(port, () => console.log(`Server running on port ${port}`));