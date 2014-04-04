module.exports = function(options) {
  var EventEmitter = require('events').EventEmitter
    , e = new EventEmitter
    , cloudinary = require('cloudinary')
    , _ = require('lodash')
    , moment = require('moment')
    , now = moment()
    , is_target = function(resource) {
        var created_at = moment(resource.created_at);

        return (now.unix() - created_at.unix()) > options.moment;
      }
    , reshape = function(array, n) {
        if (array.length === 0) {
          return [];
        }

        return [_.first(array, n)].concat(reshape(_.rest(array, n), n));
      }
    , clean;

  options = _.assign({
    "initialize": true,
    "cursor": null,
    "cloudname": null,
    "apikey": null,
    "secret": null,
    "dry-run": false,
    "type": "fetch",
    "moment": 86400,
    "economize": 50
  }, options);

  if (!_.every([options.cloudname, options.apikey, options.secret])) {
    throw 'cloudinary options are required.';
  }

  cloudinary.config({
    cloud_name: options.cloudname,
    api_key: options.apikey,
    api_secret: options.secret
  });

  clean = function(result) {
    var delete_ids = [];

    e.emit('debug', { type: 'api', response: result, request_type: 'resources' });

    if (result.resources && result.resources.length) {
      _(result.resources).each(function(resource) {
        if (resource.type === options.type && is_target(resource)) {
          delete_ids[delete_ids.length] = resource.public_id;
        }
      });
    } else {
      e.emit('error', { message: 'No results.' });
      return;
    }

    e.emit('debug', { type: 'delete_targets', targets: delete_ids });

    if (!options['dry-run'] && delete_ids.length) {
      _(reshape(delete_ids, 100)).each(function(ids) {
        cloudinary.api.delete_resources(ids, function(response) {
          e.emit('debug', { type: 'api', response: response, request_type: 'delete_resources' });
          e.emit('info', { rate_limit_remaining: response.rate_limit_remaining });
        }, { type: options.type });
      });
    }

    if (result.rate_limit_remaining > options.economize && result.next_cursor) {
      e.emit('info', { rate_limit_remaining: result.rate_limit_remaining });

      cloudinary.api.resources(clean, {
        max_results: 500,
        next_cursor: result.next_cursor
      }, { type: options.type });
    }
  };

  cloudinary.api.usage(function(result){
    e.emit('initialize', result);
  });

  cloudinary.api.resources(clean, {
    max_results: 500,
    next_cursor: options.cursor
  }, { type: options.type });

  return e;
};
