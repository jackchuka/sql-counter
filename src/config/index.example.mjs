export const config = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  port: '3306',
  database: 'yourdb',
};

export const query = "SELECT count(1) AS count FROM items LIMIT 1";
export const interval = 30000;
