'use strict';
var Joi = require('joi');
var rabbitHub = require('rabbitmq-nodejs-client');

module.exports = function (server, plugin) {

    var subHub = rabbitHub.create( {task: 'sub', channel: 'todo'});
    var pubHub = rabbitHub.create( { task: 'pub', channel: 'todo:dataLayer' } );

    pubHub.on('connection', function(hub) {
        plugin.pub = hub;
    });
    pubHub.connect();


    subHub.on('connection', function(hub) {
        plugin.sub = hub;
    });
    subHub.connect();

    var schema = Joi.object().keys({
        id:   Joi.number().optional(),
        text: Joi.string().required()
    });

    server.route({
        method:  ['POST'],
        path:    '/task',
        handler: plugin.create,
        config:  {
            validate: {
                payload: schema
            }
        }
    });
    server.route({
        method:  ['POST', 'PUT'],
        path:    '/task/{id}',
        handler: plugin.update,
        config:  {
            validate: {
                payload: schema
            }
        }
    });

    server.route({
        method:  'GET',
        path:    '/task/{id}',
        handler: plugin.findOne
    });

    server.route({
        method:  'GET',
        path:    '/task',
        handler: plugin.list
    });

    server.route({
        method:  'DELETE',
        path:    '/task/{id}',
        handler: plugin.remove
    });

};
