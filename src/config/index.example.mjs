export const db_config = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  port: '3306',
  database: 'yourdb',
};

export const queries = {
  initial: "SELECT count(1) AS count FROM items WHERE created < DATE(NOW())",
  additional: "SELECT count(1) AS count FROM items WHERE created >= DATE(NOW())",
}

export const interval = 10000;
