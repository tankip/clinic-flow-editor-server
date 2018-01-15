"use strict";

module.exports = function() {
    var obj = {
                application : {
                        host : 'xxxxx',
                        port : 1234,
                        key: 'xxxxxx',
                        cert: 'xxxxxx',
                        tls: false
                },
                database : {
                        host     : 'localhost',
                        user     : 'xxxx',
                        password : 'xxxx',
                        port     : 1234,
                        database : 'xxxx',
                        table: 'xxxxx'
                },
                server : {
                        defaultHost : 'xxxxx'
                }
        };

        if (!obj.application['host']) {
                throw new Error('Missing constant application.host.');
        } else if (!obj.application['port']) {
                throw new Error('Missing constant application.port.');
        } else if (!obj.database['host']) {
                throw new Error('Missing constant database.host.');
        } else if (!obj.database['user']) {
                throw new Error('Missing constant database.user.');
        } else if (!obj.database['password']) {
                throw new Error('Missing constant database.password.');
        } else if (!obj.database['database']) {
                throw new Error('Missing constant database.database.');
        }

        return obj;

}();
