'use strict';

const connection = require('../connection/connection');
const config = require('../config/config');
const Promise = require('bluebird');

const services = {
    getAllSchemas: getAllSchemas,
    getSchema: getSchema,
    getPublished: getPublished,
    saveSchema: saveSchema,
    publishSchema: publishSchema,
    unPublishSchema: unPublishSchema,
    retireSchema: retireSchema,
    unretireSchema: unretireSchema
};

module.exports = services;

function getAllSchemas() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM '+ config.database.table + '', (err, results, fields) => {
            if (err) {
                reject('Error fetching schemas');
            } else {
                resolve(results);
            }
        });
    });
}

function getSchema(id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clinic_workflows where id="' + id + '"' , (err, results, fields) => {
            if (err) {
                reject('Error fetching schema');
            } else {
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

                resolve(returnData);
            }
        });
    });
}

function getPublished() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM '+ config.database.table + ' where published=1' , (err, results, fields) => {

            if (err) {
                reject(err);
            } else {
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

                resolve(returnData);
            }

        });
    });
}

function saveSchema(payload) {

    var user = payload.creator;
    var name = payload.name;
    var schema = payload.schema;
    var uuid = payload.uuid;
    var description = payload.description;
    var version = 1;

    return new Promise((resolve, reject) => {
        connection.query('SELECT MAX(version), uuid FROM clinic_workflows where uuid="' + uuid + '"' , (err, results, fields) => {
            if (results.length > 0 ) {
                if(results[0].uuid === uuid) {
                    version = results[0]['MAX(version)'] + 1;
                }
            }
            connection.query('INSERT INTO clinic_workflows (name, created_by, published, uuid, retired, version, description, workflow )' +
            'VALUES ("' + name + '","' + user + '","' + 0 + '","' + uuid + '","' + 0 + '","' + version + '","' + description + '",?)', schema, function(error, success, fields) {

                if (error) {
                    reject(error);
                }
                
                connection.query('SELECT * FROM clinic_workflows where id="' + success.insertId + '"' , (err, results, fields) => {
                    if (err) {
                        reject(err);
                    }

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

                    resolve(returnData);
                });

            });

        });
    });
}

function publishSchema(payload) {

    var id = payload.id;
    var uuid = payload.uuid;
    var version = payload.version;

    return new Promise((resolve, reject) => {
        connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE published=1 AND uuid="' + uuid + '";' +
                         'UPDATE ' + config.database.table + ' SET published=1 WHERE version=' + version + ' AND id=' + id + '', (err, success) => {
            if (err) {
                reject(err);
            } else {
                resolve(success[1]);
            }
        });
    });
}

function unPublishSchema(id) {

    return new Promise((resolve, reject) => {
        connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE id="' + id + '"', (err, success) => {
            
            if (err) {
                reject(err);
            } else {
                resolve(success);
            }

        });
    });

}

function retireSchema(payload) {
    var id = payload.id;
    var user = payload.user;

    return new Promise((resolve, reject) => {
        connection.query('UPDATE ' + config.database.table + ' SET published=0 WHERE published=1 AND id="' + id + '";' +
                         'UPDATE ' + config.database.table + ' SET retired_by="' + user + '", date_retired=NOW(), retired=1 WHERE id=' + id + '', (err, success) => {
            if (err) {
                reject(err);
            } else {
                resolve(success[1]);
            }

        });
    });
}

function unretireSchema(id) {

    return new Promise((resolve, reject) => {
        connection.query('UPDATE ' + config.database.table + ' SET retired=0 WHERE id="' + id + '"', (err, success) => {
            
            if (err) {
                reject(err);
            } else {
                resolve(success);
            }

        });
    });

}
