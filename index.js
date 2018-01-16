'use strict';

const Hapi = require('hapi');
const config = require('./src/config/config');
const mysql = require('mysql');
const connection = require('./src/connection/connection');
const tls = require('tls');
const fs = require('fs');

var routes = require('./src/routes/routes');

const server = new Hapi.Server();

var tls_config = false;

if (config.application.tls) {
    tls_config = tls.createServer({
        key: fs.readFileSync(config.application.key),
        cert: fs.readFileSync(config.application.cert)
    });
}

server.connection({
        port: config.application.port,
        host: config.application.host,
        tls: tls_config
});

connection.connect();

for (var route in routes) {
        server.route(routes[route]);
}

server.start((err) => {

        if (err) {
                throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
});
