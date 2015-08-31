'use strict';
var Joi = require('joi');
var rabbitHub = require('rabbitmq-nodejs-client');

var subHub = rabbitHub.create( { task: 'sub', channel: 'myChannel' } );


var pubHub = rabbitHub.create( { task: 'pub', channel: 'myChannel' } );


module.exports = function (server, plugin) {

    subHub.on('connection', function(hub) {
        hub.on('message', function(msg) {
            console.log('todo', msg);
        }.bind(this));

    });

    pubHub.on('connection', function(hub) {
        hub.send('todog Hello World!');
    });

    subHub.connect();
    pubHub.connect();

    server.route({
        method:  'GET',
        path:    '/task/say-hey',
        handler: plugin.showText,
        config:  {}
    });

    var schema = Joi.object().keys({
        id:   Joi.number().optional(),
        text: Joi.string().required()
    });
    server.route({
        method:  ['POST', 'PUT'],
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
