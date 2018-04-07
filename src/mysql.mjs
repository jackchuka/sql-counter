import mysql from 'mysql';
import { db_config } from './config';

export const pool = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  port: db_config.port,
  database: db_config.database,
});
