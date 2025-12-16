import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool();

export default db;