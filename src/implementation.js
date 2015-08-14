'use strict';

var plugin = {};

var constructor = function (options) {
    plugin.options = options || {};
    plugin.db = options.dataLayer;
    return plugin;
};

plugin.showText = function (request, reply) {

    reply({text: 'hey'});
};

plugin.create = function (request, reply) {

    plugin.db.create(request.payload).then(function () {
        reply(200);
    }, function (error) {
        reply(500, error);
    });
};
plugin.update = function (request, reply) {

    plugin.db.update(request.payload).then(function () {
        reply(200);
    }, function (error) {
        reply(400, error);
    });
};

module.exports = constructor;