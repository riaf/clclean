var cloudinary = require('cloudinary')
  , _ = require('lodash')
  , moment = require('moment')
  , config = require('./config')
  , now = moment()
  , is_target = function(resource) {
      var created_at = moment(resource.created_at);

      return (now.unix() - created_at.unix()) > config.moment;
    }
  , clean;

// configure
cloudinary.config(config.api);

clean = function(result) {
  var delete_ids = [];

  if (result.resources && result.resources.length) {
    _(result.resources).each(function(resource) {
      if (resource.type === config.type && is_target(resource)) {
        delete_ids[delete_ids.length] = resource.public_id;
      }
    });
  } else {
    return;
  }

  if (process.env.NODE_ENV === 'production' && delete_ids.length) {
    cloudinary.api.delete_resources(delete_ids, function(response) {
      console.log(response);
    }, { type: config.type });
  } else {
    console.log('Delete targets:', delete_ids);
  }

  if (result.rate_limit_remaining > 50 && result.next_cursor) {
    console.log('Next cursor', result.next_cursor);
    cloudinary.api.resources(clean, {
      next_cursor: result.next_cursor
    });
  }
};

cloudinary.api.resources(clean);
