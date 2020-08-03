/**
 * Sample Test Server
 */

'use strict';

const util = require('util');
const http = require('http');

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
  if (req.url == '/hello') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    res.end('Hello World');
  } else if (req.url == '/scannetworks') {
    setTimeout(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      const jsonResponse = JSON.stringify([{
        'ssid': '2.4 GHZ NETWORK',
        'signal': -30,
        'secure': 8,
      },
      {
        'ssid': 'Fake 5 GHZ NETWORK',
        'signal': -67,
        'secure': 4,
      },
      {
        'ssid': 'NO SECURITY',
        'signal': -50,
        'secure': 7,
      },
      {
        'ssid': 'WEAK Network',
        'signal': -70,
        'secure': 8,
      },
      {
        'ssid': 'Invalid signal WEP',
        'signal': 's5',
        'secure': 5,
      },
      ], null, 3);

      // const jsonResponse = JSON.stringify([], null, 3);

      res.end(jsonResponse);
    }, 500);
  } else if (req.url == '/getinfo') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Custom-Restart-Flag', '1');

    const jsonResponse = JSON.stringify({
      'firmwareversion': '20201231.2359',
      'mac': '00:00:00:00:00',
      'chipid': '1640E0',
      'flashchipid': '54CC05',
      'flashchiprealsize': 4194304,
      'sketchsize': 40943,
    });

    res.end(jsonResponse);
  } else if (req.url == '/savedebug') {
    const post = {};

    if (req.method == 'POST') {
      req.on('data', (data)=> {
        data = data.toString();
        data = data.split('&');
        for (let i = 0; i < data.length; i++) {
          const _data = data[i].split('=');
          post[_data[0]] = _data[1];
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(post, null, 3));
        res.end();
      });
    }
  } else if (req.url == '/save') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const jsonResponse = JSON.stringify({
      'status': true,
    });

    res.end(jsonResponse);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.end(util.inspect(req));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
