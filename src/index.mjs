import http from 'http';
import express from 'express';
import { pool } from './mysql';
import socket from 'socket.io';
import { queries, interval } from './config';

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

let count = 0;

io.sockets.on('connection', function(socket) {
  console.log('user connected....');
  socket.emit('count_update', count);
});

const loadInital = new Promise((resolve, reject) => {
  pool.getConnection((err, con) => {
    con.query(queries.initial, (err, rows) => {
      if (rows.length > 0) {
        count = rows[0].count;
        console.log('initial query done...', count);
        io.emit('count_update', count);
      }
      con.release();
      resolve(count);
    });
  });
});

const load = () => {
  pool.getConnection((err, con) => {
    if (err) {
      con.release();
      return;
    }
    con.query(queries.additional, (err, rows) => {
      if (rows.length > 0) {
        const addition = rows[0].count;
        console.log('fetched...', addition);
        count += addition;
        io.emit('count_update', count);
      }
      con.release();
    });

    con.on('error', (err) => {
      con.release();
      return;
    });
  });
};

loadInital.then(() => {
  setInterval(load, interval);
});
