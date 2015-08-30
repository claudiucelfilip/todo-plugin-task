'use strict';
var Joi = require('joi');

module.exports = function (server, plugin) {

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

    //
    //rabbit.on('pam pam', function (params) {
    //    plugin.doSomething(params);
    //});

};
