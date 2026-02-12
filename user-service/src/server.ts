import express, { json, type NextFunction } from "express";
import { prisma } from '../src/config/prisma';
import { disconnectPrisma } from "./config/prisma";
import authRouter from './routes/authRoute.ts';
import userRouter from "./routes/userRoute.ts";
import deckRouter from "./routes/deckRoute.ts";

const app = express();

app.use(json());

const port = process.env.PORT || 5001;
const router = app.router;

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/test', (req, res) =>  res.send('/test of API of userService'));

router.use('/auth', authRouter);
router.use('/',userRouter)
router.use('/deck',deckRouter);

const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


if (process.env.NODE_ENV === 'test') {
  app.post('/__test__/reset-db', async (_req, res) => {
    await prisma.deckCard.deleteMany();
    await prisma.deck.deleteMany();
    await prisma.user.deleteMany();
    res.json({ ok: true });
  });
}

app.listen(5001,'0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Database connected: ${prisma ? '✓' : '✗'}`);
});



