import mysql from 'mysql';
import { config } from './config';

export const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database,
});
