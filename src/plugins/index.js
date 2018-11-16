'use strict'

module.exports = [
  // basic
  require('./version'),
  require('./env'),
  require('./startupPrint'),
  // extension
  require('./sentry'),
  require('./eFlag'),
  // post-process
  require('./standard'),
  // bundler
  require('./pkg'),
  // distributor
  require('./pneumon')
]
