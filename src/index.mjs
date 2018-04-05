import http from 'http';
import express from 'express';
import { pool } from './mysql';
import socket from 'socket.io';
import { query, interval } from './config';

const app = express();
const server = http.Server(app);
const io = socket(server);

const filename = typeof __filename !== 'undefined' ? __filename : (/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1];
const dirname = typeof __dirname !== 'undefined' ? __dirname : filename.replace(/[\/\\][^\/\\]*?$/, '');

app.get('/', (req, res) => {
  res.sendFile(dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

const load = () => {
    pool.getConnection((err, con) => {
    if (err) {
      con.release();
      return;
    }
    con.query(query, (err, rows) => {
      if (rows.length > 0) {
        const count = rows[0].count;
        console.log(count);
        io.emit('count_update', count);
      }
      con.release();
    });

    con.on('error', (err) => {
      con.release();
      return;
    });
  });
}

setInterval(load, interval);
