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
    var dataLayer = {
        create: function() {},
        find: function() {},
        findOne: function() {},
        update: function() {},
        remove: function() {}
    };

    var createStub,
        findStub,
        findOneStub,
        updateStub,
        removeStub;

    before(function (done) {

        server.connection({
            port: 5000
        });

        server.start(done);

    });

    beforeEach(function (done) {
        createStub = sinon.stub(dataLayer, 'create');
        findStub = sinon.stub(dataLayer, 'find');
        findOneStub = sinon.stub(dataLayer, 'findOne');
        updateStub = sinon.stub(dataLayer, 'update');
        removeStub = sinon.stub(dataLayer, 'remove');

        done();
    });
    afterEach(function (done) {
        createStub.restore();
        findStub.restore();
        findOneStub.restore();
        updateStub.restore();
        removeStub.restore();
        done();
    });

    after(function (done) {
        server.stop();
        done();
    });


    it('should load the dataLayer', function(done) {


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
            url: '/task',
            payload: {}
        }).then(function (response) {
            response.statusCode.should.equal(400);
        });
    });


    it('should list all tasks', function() {
        findStub.returns(Promise.resolve([
            {
                id: 2,
                text: 'task 2'
            },
            {
                id: 3,
                text: 'task 3'
            },
            {
                id: 4,
                text: 'task 4'
            }
        ]));

        return inject({
            method: 'GET',
            url: '/task'
        }).then(function (response) {
            response.statusCode.should.equal(200);
            findStub.calledOnce.should.be.true;
            response.result.length.should.equal(3);
        });
    });

    it('should create a task', function () {
        createStub.returns(Promise.resolve(200));
        return inject({
            method: 'POST',
            url: '/task',
            payload: {
                text: 'new task'
            }
        }).then(function (response) {
            response.statusCode.should.equal(200);
            createStub.calledOnce.should.be.true;

        })
    });
    it('should get a task', function () {
        var id = 1;

        findOneStub.withArgs({
            id: id
        }).returns(Promise.resolve({
            id: id,
            text: 'new task'
        }));

        return inject({
            method: 'GET',
            url: '/task/1'
        }).then(function (response) {
            response.statusCode.should.equal(200);
            findOneStub.calledOnce.should.be.true;

        });
    });
    it('should update a task', function () {
        var oldState = {
            id: 1,
            text: 'old task'
        };

        var newState = {
            id: 1,
            text: 'changed task'
        };

        updateStub.withArgs(newState)
            .returns(Promise.resolve(200));

        findOneStub.withArgs({
                id: oldState.id
            })
            .onFirstCall()
            .returns(Promise.resolve(oldState));

        findOneStub.withArgs({
                id: oldState.id
            })
            .onSecondCall()
            .returns(Promise.resolve(newState));

        var getOldState = function () {
            return inject({
                method: 'GET',
                url: '/task/1'
            }).then(function (response) {
                response.statusCode.should.equal(200);
                findOneStub.should.have.callCount(1);
            });
        };
        var updateState = function () {
            return inject({
                method: 'PUT',
                url: '/task/1',
                payload: newState
            }).then(function (response) {
                response.statusCode.should.equal(200);
                updateStub.should.have.callCount(1);
            });
        };
        var getNewState = function () {
            return inject({
                method: 'GET',
                url: '/task/1'
            }).then(function (response) {
                response.statusCode.should.equal(200);
                findOneStub.should.have.callCount(2);
            });
        };

        return getOldState()
            .then(updateState)
            .then(getNewState);
    });
    it('should delete a task', function () {
        removeStub.withArgs({
            id: 1
        }).returns(Promise.resolve(200));

        return inject({
            method: 'DELETE',
            url: '/task/1'
        }).then(function (response) {
            response.statusCode.should.equal(200);
            removeStub.should.have.callCount(1);
        });
    });

});