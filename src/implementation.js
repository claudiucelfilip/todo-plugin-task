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
    plugin.db.create(request.payload).then(function success () {
        reply(200);
    }, function error (error) {
        reply(500, error);
    });
};
plugin.update = function (request, reply) {
    plugin.db.update(request.payload).then(function success() {
        reply(200);
    }, function error (error) {
        reply(400, error);
    });
};
plugin.remove = function (request, reply) {
    plugin.db.remove({
        id: parseInt(request.params.id)
    }).then(function success() {
        reply(200);
    }, function error (error) {
        reply(400, error);
    });
};
plugin.list = function (request, reply) {
    plugin.db.find(request.payload).then(function success(results) {
        reply(results);
    }, function error (error) {
        reply(400, error);
    });
};
plugin.findOne = function (request, reply) {

    plugin.db.findOne({
        id: parseInt(request.params.id)
    }).then(function success(results) {
        reply(results);
    }, function error (error) {
        reply(400, error);
    });
};
module.exports = constructor;