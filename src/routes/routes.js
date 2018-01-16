'use strict';

const services = require('../services/services');

module.exports = function() {
    return [
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                reply('Server Running With No Problem');
            }
        },
        {
            method: 'GET',
            path: '/get-all-schemas',
            handler: (request, reply) => {
                services.getAllSchemas()
                .then((success) => {
                    reply(success);
                })
                .catch((err) => {
                    reply('Error fetching schemas!');
                });
            }
        },
        {
            method: 'GET',
            path: '/get-published',
            config: {
                handler: (request, reply) => {
                    services.getPublished()
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply(err);
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/get-schema/{id}',
            handler: (request, reply) => {

                var id = request.params.id;

                services.getSchema(id)
                .then((success) => {
                    reply(success);
                })
                .catch((err) => {
                    reply(err);
                });

            }
        },
        {
            method: 'POST',
            path: '/save-schema',
            config: {
                handler: (request, reply) => {

                    var data = request.payload;
                    services.saveSchema(data)
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply('There was an error saving schema');
                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/publish-schema',
            config: {
                handler: (request, reply) => {

                    var payload = request.payload;

                    services.publishSchema(payload)
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply('There was an error Publishing schema');
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

                    services.unPublishSchema(id)
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply('There was an error unpublishing schema');
                    });

                }
            }
        },
        {
            method: 'POST',
            path: '/retire-schema',
            config: {
                handler: (request, reply) => {

                    var payload = request.payload;

                    services.retireSchema(payload)
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply('There was error retiring schema');
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

                    services.unretireSchema(id)
                    .then((success) => {
                        reply(success);
                    })
                    .catch((err) => {
                        reply('There was an error unretiring schema');
                    });
                    
                }
            }
        }

    ];
}();
