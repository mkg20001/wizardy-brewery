'use strict'

const Joi = require('joi')

module.exports = {
  name: 'sentry',
  config: Joi.object().required().keys({
    dsn: Joi.string().required()
  }),
  code: (module, config, env, out) => {
    out.script.push(`const Sentry = require('@sentry/node'); Sentry.init({ dsn: ${JSON.stringify(config.dsn)} })`)
    out.errScript.push(`Sentry.captureException(err)`)
  }
}
