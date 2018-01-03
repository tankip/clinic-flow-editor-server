'use strict';

var fs = require('fs');
const connection = require('../connection/database');
const config = require('../config/config');

module.exports = function() {
    return [
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                reply('Server Running With No Problem');
            }
        },
        {
            method: 'GET',
            path: '/get-all-schemas',
            handler: (request, reply) => {

                connection.query('SELECT * FROM '+ config.database.table + '', function(err, results, fields) {
                    reply(results);
                });

            }
        },
        {
            method: 'GET',
            path: '/get-schema/{id}',
            handler: (request, reply) => {

                var id = request.params.id;

                connection.query('SELECT * FROM clinic_workflows where id="' + id + '"' , function(err, results, fields) {
                    if (err) throw err;

                    var data = results[0];
                    var returnData = {
                        id: data.id,
                        version: data.version,
                        name: data.name,
                        schema: JSON.parse(data.workflow),
                        date_created: data.date_created,
                        created_by: data.created_by,
                        uuid: data.uuid,
                        retired: data.retired,
                        date_retired: data.date_retired,
                        retired_by: data.retired_by,
                        published: data.published,
                        description: data.description
                    }

                    reply(returnData);
                });

            }
        },
        {
            method: 'POST',
            path: '/update-schema',
            config: {
                handler: (request, reply) => {

                    var data = request.payload;
                    var user = data.creator;
                    var name = data.name;
                    var schema = data.schema;
                    var uuid = data.uuid;

                    connection.query('INSERT INTO clinic_workflows (name, created_by, published, uuid, retired, version, workflow )' +
                    'VALUES ("' + name + '","' + user + '","' + 0 + '","' + uuid + '","' + 0 + '","' + 0.1 + '",?)', schema, function(error, success, fields) {

                        if (error) throw error;

                        reply(schema);

                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/save-schema',
            config: {
                handler: (request, reply) => {

                    var data = request.payload;
                    var user = data.creator;
                    var name = data.name;
                    var schema = data.schema;
                    var uuid = data.uuid;
                    var description = data.description;
                    var version = 1;

                    connection.query('SELECT MAX(version), uuid FROM clinic_workflows where uuid="' + uuid + '"' , function(err, results, fields) {
                        if (results.length > 0 ) {
                            if(results[0].uuid === uuid) {
                                version = results[0]['MAX(version)'] + 1;
                            }
                        }
                        connection.query('INSERT INTO clinic_workflows (name, created_by, published, uuid, retired, version, description, workflow )' +
                        'VALUES ("' + name + '","' + user + '","' + 0 + '","' + uuid + '","' + 0 + '","' + version + '","' + description + '",?)', schema, function(error, success, fields) {

                            if (error) throw error;
                            connection.query('SELECT * FROM clinic_workflows where id="' + success.insertId + '"' , function(err, results, fields) {
                                if (err) throw err;

                                var data = results[0];
                                var returnData = {
                                    id: data.id,
                                    version: data.version,
                                    name: data.name,
                                    schema: JSON.parse(data.workflow),
                                    date_created: data.date_created,
                                    created_by: data.created_by,
                                    uuid: data.uuid,
                                    retired: data.retired,
                                    date_retired: data.date_retired,
                                    retired_by: data.retired_by,
                                    published: data.published,
                                    description: data.description
                                }

                                reply(returnData);
                            });

                        });

                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/deploy-schema',
            config: {
                handler: (request, reply) => {

                    var version = request.payload.version;
                    var id = request.payload.id;
                    var uuid = request.payload.uuid;

                    connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE published=1 AND uuid="' + uuid + '";' +
                                     'UPDATE ' + config.database.table + ' SET published=1 WHERE version=' + version + ' AND id=' + id + '', function(err, success) {
                        if (err) throw err;
                        reply(success[1]);
                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/unpublish-schema',
            config: {
                handler: (request, reply) => {

                    var id = request.payload.id;

                    connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE id="' + id + '"', function(err, success) {
                        if (err) throw err;
                        reply(success);
                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/retire-schema',
            config: {
                handler: (request, reply) => {

                    var id = request.payload.id;
                    var user = request.payload.user;

                    connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE published=1 AND id="' + id + '";' +
                                     'UPDATE ' + config.database.table + ' SET retired_by="' + user + '", retired=1 WHERE id=' + id + '', function(err, success) {
                        if (err) throw err;
                        reply(success[1]);
                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/unretire-schema',
            config: {
                handler: (request, reply) => {

                    var id = request.payload.id;

                    connection.query('UPDATE ' + config.database.table + ' SET retired=0 WHERE id="' + id + '"', function(err, success) {
                        if (err) throw err;
                        reply(success);
                    });

                }
            }
        },
        {
            method: 'GET',
            path: '/get-published',
            config: {
                handler: (request, reply) => {

                    connection.query('SELECT * FROM '+ config.database.table + ' where published=1' , function(err, results, fields) {

                        if (err) throw err;

                        var returnData = [];
                        for(var i = 0; i < results.length; i ++ ) {
                            var data = results[i];
                            returnData.push({
                                id: data.id,
                                version: data.version,
                                name: data.name,
                                schema: JSON.parse(data.workflow),
                                date_created: data.date_created,
                                created_by: data.created_by,
                                uuid: data.uuid,
                                retired: data.retired,
                                date_retired: data.date_retired,
                                retired_by: data.retired_by,
                                published: data.published,
                                description: data.description
                            });
                        }

                        reply(returnData);

                    });

                }
            }
        }

    ];
}();
