var expect = require('chai').expect;
var nock = require('nock');

// Subject
var OpenTok = require('../lib/opentok.js');

describe('MuteModeration', function () {
  var opentok = new OpenTok('APIKEY', 'APISECRET');
  var SESSIONID = '1_MX4xMDB-MTI3LjAuMC4xflR1ZSBKYW4gMjggMTU6NDg6NDAgUFNUIDIwMTR-MC43NjAyOTYyfg';
  var STREAMID = '4072fe0f-d499-4f2f-8237-64f5a9d936f5';

  afterEach(function () {
    nock.cleanAll();
  });

  describe('forceMute', function () {
    function mockRequest(status, body) {
      var url = '/v2/project/APIKEY/session/' + SESSIONID + '/stream/' + STREAMID +'/mute';
      nock('https://api.opentok.com:443')
        .post(url)
        .reply(status, body, {
          server: 'nginx',
          date: 'Fri, 31 Jan 2014 06:32:16 GMT',
          connection: 'keep-alive'
        });
    }

    describe('valid responses', function () {
      beforeEach(function () {
        mockRequest(204, '');
      });

      it('should not return an error', function (done) {
        opentok.forceMute(SESSIONID, STREAMID, function (err) {
          expect(err).to.be.null;
          done();
        });
      });

      it('should return an error for empty stream Id', function (done) {
        opentok.forceMute(SESSIONID, null, function (err) {
          expect(err).to.not.be.null;
          done();
        });
      });

      it('should return an error for empty session', function (done) {
        opentok.forceMute(null, STREAMID, function (err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('invalid responses', function () {
      var errors = [400, 403, 404, 500];
      var i;
      function test(error) {
        it('should fail for status ' + error, function (done) {
          mockRequest(error, '');

          opentok.forceMute(SESSIONID, STREAMID, function (err) {
            expect(err).to.not.be.null;
            done();
          });
        });
      }
      for (i = 0; i < errors.length; i++) {
        test(errors[i]);
      }
    });
  });
  describe('forceMuteAll', function () {
    function mockRequest(status, body) {
      var url = '/v2/project/APIKEY/session/' + SESSIONID +'/mute';
      nock('https://api.opentok.com:443')
        .post(url)
        .reply(status, body, {
          server: 'nginx',
          date: 'Fri, 31 Jan 2014 06:32:16 GMT',
          connection: 'keep-alive'
        });
    }
    const excludedSteamIds = JSON.parse('{"1":1, "2":2}');
    describe('valid responses', function () {
      beforeEach(function () {
        mockRequest(204, '');
      });

      it('should not return an error', function (done) {
        opentok.forceMuteAll(SESSIONID, excludedSteamIds, function (err) {
          expect(err).to.be.null;
          done();
        });
      });

      it('should not return an error for empty stream Id list', function (done) {
        opentok.forceMuteAll(SESSIONID, null, function (err) {
          expect(err).to.be.null;
          done();
        });
      });

      it('should return an error for empty session', function (done) {
        opentok.forceMuteAll(null, excludedSteamIds, function (err) {
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('invalid responses', function () {
      var errors = [400, 403, 404, 500];
      var i;
      function test(error) {
        it('should fail for status ' + error, function (done) {
          mockRequest(error, '');

          opentok.forceMuteAll(SESSIONID, excludedSteamIds, function (err) {
            expect(err).to.not.be.null;
            done();
          });
        });
      }
      for (i = 0; i < errors.length; i++) {
        test(errors[i]);
      }
    });
  });
});
