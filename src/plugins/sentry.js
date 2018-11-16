'use strict'

module.exports = (module, config, env, out) => {
  out.script.push(`const Sentry = require('@sentry/node'); Sentry.init({ dsn: ${JSON.stringify(config.dsn)} })`)
}

const Joi = require('joi')

module.exports.config = Joi.object().required().keys({
  dsn: Joi.string().required()
})
