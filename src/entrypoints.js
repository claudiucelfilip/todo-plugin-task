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
        id:   Joi.number(),
        text: Joi.string().required()
    });
    server.route({
        method:  ['POST', 'PUT'],
        path:    '/task/create',
        handler: plugin.create,
        config:  {
            validate: {
                payload: schema
            }
        }
    });
    //
    //rabbit.on('pam pam', function (params) {
    //    plugin.doSomething(params);
    //});

};
