/* global require, exports */
/* jshint strict:false, eqnull:true */

var request = require('request');
var errors = require('./errors');
var pkg = require('../package.json');
var _ = require('lodash');
var generateJwt = require('./generateJwt');

var api = function (config, method, session, stream, body, callback) {
  var rurl = config.apiEndpoint + '/v2/project/' + config.apiKey + '/session/' + session;
  if (stream) {
    rurl += '/stream/' + stream;
  }
  rurl += '/mute';
  request.defaults(_.pick(config, 'proxy', 'timeout'))({
    url: rurl,
    method: method,
    headers: {
      'X-OPENTOK-AUTH': generateJwt(config),
      'User-Agent': 'OpenTok-Node-SDK/' + pkg.version +
        (config.uaAddendum ? ' ' + config.uaAddendum : '')
    },
    json: body
  }, callback);
};

handleForceMute = function (config, sessionId, streamId, excludedStreamIds = null, callback) {
  if (typeof callback !== 'function') {
    throw (new errors.ArgumentError('No callback given to signal'));
  }
  if (sessionId == null) {
    return callback(new errors.ArgumentError('No sessionId or connectionId given to signal'));
  }
  let body=null;
  if(excludedStreamIds){
    body = JSON.stringify({excluded:excludedStreamIds});
  }
  return api(config, 'POST', sessionId, streamId, body, function (err, response) {
    if (err || Math.floor(response.statusCode / 100) !== 2) {
      if (response && response.statusCode === 403) {
        callback(new errors.AuthError('Invalid API key or secret'));
      }
      else if (response && response.statusCode === 404) {
        callback(new errors.ForceMuteError('Session or Stream not found'));
      }
      else {
        callback(new errors.RequestError('Unexpected response from OpenTok'));
      }
    }
    else {
      callback(null);
    }
  });
};

exports.forceMute = function(config, sessionId, streamId, callback) {
    return this.handleForceMute(config,sessionId,streamId,null,callback);
}

exports.forceMuteAll = function(config, sessionId, excludedStreamIds=null, callback) {
    return this.handleForceMute(config,sessionId,null,excludedStreamIds,callback);
}
