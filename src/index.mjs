import http from 'http';
import express from 'express';
import { pool } from './mysql';
import socket from 'socket.io';
import {
  queries,
  interval,
  threshold,
} from './config';

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

let initial = 0;
let reached = false;

io.sockets.on('connection', function(socket) {
  console.log('user connected....');
  socket.emit('count_update', initial);
});

const loadInital = new Promise((resolve, reject) => {
  pool.getConnection((err, con) => {
    con.query(queries.initial, (err, rows) => {
      if (rows.length > 0) {
        initial = rows[0].count;
        console.log('initial query done...', initial);
        io.emit('count_update', initial);
      }
      con.release();
      checkThreshold(initial);
      resolve(initial);
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
        let addition = rows[0].count;
        let total = initial + rows[0].count;
        console.log('fetched addition...', addition, 'sum:', total);
        io.emit('count_update', total);
        checkThreshold(total);
      }
      con.release();
    });

    con.on('error', (err) => {
      con.release();
      return;
    });
  });
};

const checkThreshold = (count) => {
  if (!reached && threshold <= count) {
    console.log('reached threshold...', count);
    io.emit('threshold_reached');
    reached = true;
  }
}

loadInital.then(() => {
  setInterval(load, interval);
});
