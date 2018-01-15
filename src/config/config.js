"use strict";

module.exports = function() {
    var obj = {
                application : {
                        host : '10.50.80.240',
                        port : 8010,
                        key: '/opt/etl-latest/conf/ampath.or.ke.key',
                        cert: '/opt/etl-latest/conf/ampath.or.ke.crt',
                        tls: true
                },
                database : {
                        host     : '10.50.80.240',
                        user     : 'etl_user',
                        password : '%RTF:zCML2K',
                        port     : 3306,
                        database : 'workflows',
                        table: 'clinic_workflows'
                },
                server : {
                        defaultHost : 'https://test2.ampath.or.ke:8010'
                },
                file : {
                        filePath: '/home/rtanui/schemas-data/',
                        filename: 'program-visits-config.json'
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
