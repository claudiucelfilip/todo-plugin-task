'use strict';

var chai   = require('chai');
var should = chai.should();
var Hapi   = require('hapi');
var domain = require('domain').createDomain();
var q      = require('q');
var server = new Hapi.Server();
var sinon = require('sinon');

function inject(options) {
    var defer = q.defer();

    domain.run(function () {
        server.inject(options, function (response) {
            defer.resolve(response);
        });

    });
    domain.on('error', function (err) {
        defer.reject(err);
        console.log(err.stack);
    });

    return defer.promise;
}

describe('TASK PLUGIN', function () {

    before(function (done) {

        server.connection({
            port: 5000
        });

        server.start(done);

    });

    after(function (done) {
        server.stop();
        done();
    });


    it('should load the dataLayer', function(done) {
        var resolvingPromise = function() {
            var defer = q.defer();
            setTimeout(function() {
                defer.resolve();
            }, 100);
            return defer.promise;
        };

        var dataLayer = {
            create: resolvingPromise
        };

        var loadPlugin = function() {
            server.register([
                {
                    register: require('../src/plugin'),
                    options : {
                        dataLayer: dataLayer
                    }
                }
            ], function (error) {
                if (error) {
                    console.error(error);
                    throw new Error('error loading plugin');

                    return;
                }
                done();

            });
        };
        loadPlugin.should.not.throw();
    });

    it('should give 400 when given an invalid payload', function () {
        return inject({
            method: 'POST',
            url: '/task/create',
            payload: {}
        }).then(function (response) {
            response.statusCode.should.equal(400);
        });
    });

    it('should list all tasks');
    it('should create a task');
    it('should get a task');
    it('should update a task');
    it('should delete a task');

});