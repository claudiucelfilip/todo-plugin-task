'use strict';

var chai   = require('chai');
var should = chai.should();
var Hapi   = require('hapi');
var domain = require('domain').createDomain();
var Promise = require('bluebird');
var server = new Hapi.Server();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

function inject(options) {

    return new Promise(function(resolve, reject) {
        domain.run(function () {
            server.inject(options, function (response) {
                resolve(response);
            });

        });
        domain.on('error', function (err) {
            reject(err);
            console.log(err.stack);
        });
    });
}

describe('TASK PLUGIN', function () {

    before(function (done) {

        server.connection({
            port: 5000
        });


        server.register([
            {
                register: require('../src/plugin')
            }
        ], function (error) {
            if (error) {
                console.error(error);
                throw new Error('error loading plugin');
                return;
            }
            done();
        });
        server.start();

    });


    after(function (done) {
        server.stop();
        done();
    });


    it('should give 400 when given an invalid payload', function () {
        return inject({
            method: 'POST',
            url: '/task',
            payload: {}
        }).then(function (response) {
            response.statusCode.should.equal(400);
        });
    });

    it('should put param id on bus on on item request', function () {
        return inject({
            method: 'GET',
            url: '/task/1'
        }).then(function (response) {
            response.statusCode.should.equal(200);
        })
    });

});