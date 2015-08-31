'use strict';

var plugin = {};

var constructor = function (options) {
    plugin.options = options || {};
    return plugin;
};

plugin.sendMessage = function (type, payload) {
    return new Promise(function (resolve, reject) {
        var id = (new Date()).getTime();

        plugin.pub.send({
            id: id,
            type: type,
            payload: payload
        });

        plugin.sub.on('message', function (msg) {
            if (msg.id === id) {
                if (msg.error) {
                    reject(msg.error);
                } else {
                    resolve(msg.payload);
                }
            }
        })
    });
};
plugin.create = function (request, reply) {
    plugin.sendMessage('create', request.payload)
        .then(function success () {
            reply(200);
        }, function error (error) {
            reply(500, error);
        });
};
plugin.update = function (request, reply) {

    plugin.sendMessage('update', request.payload)
        .then(function success () {
            reply(200);
        }, function error (error) {
            reply(500, error);
        });
};
plugin.remove = function (request, reply) {
    var payload = {
        id: parseInt(request.params.id)
    };

    plugin.sendMessage('remove', payload)
        .then(function success () {
            reply(200);
        }, function error (error) {
            reply(500, error);
        });
};
plugin.list = function (request, reply) {
    var payload = {};

    plugin.sendMessage('find', payload)
        .then(function success () {
            reply(200);
        }, function error (error) {
            reply(500, error);
        });
};
plugin.findOne = function (request, reply) {
    var payload = {
        id: parseInt(request.params.id)
    };

    plugin.sendMessage('findOne', payload)
        .then(function success () {
            reply(200);
        }, function error (error) {
            reply(500, error);
        });
};
module.exports = constructor;