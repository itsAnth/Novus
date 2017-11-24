var _ = require('lodash');

var config = {
	dev:'development',
	test:'testing',
	prod:'production',
	port: process.env.PORT || 3000,
	keyPublishable: process.env.PUBLISHABLE_KEY || 123,
	keySecret: process.env.SECRET_KEY || 1234,
	// 1 hour in seconds
	expireTime: 60 *60 *1,
	secrets: {
		jwt: process.env.JWT || 'panda'
	}
};

// if there is no predetermined node env, use dev
process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

var envConfig;
// require could error out if
// the file don't exist so lets try this statement
// and fallback to an empty object if it does error out
try {
  envConfig = require('./' + config.env);
  // just making sure the require actually
  // got something back :)
  envConfig = envConfig || {};
} catch(e) {
  envConfig = {};
}

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig);