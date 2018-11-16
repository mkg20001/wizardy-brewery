'use strict'

const Joi = require('joi')

module.exports = {
  name: 'sentry',
  config: Joi.object().required().keys({
    dsn: Joi.string().required()
  }),
  code: (module, config, env, out) => {
    if (!config.release && out.version) {
      config.release = `${module.id}@${out.version}`
    }
    out.script.push(`const Sentry = require('@sentry/node'); Sentry.init(${JSON.stringify(config)})`)
    out.errScript.push(`const Sentry = require('@sentry/node'); Sentry.captureException(err)`)
  }
}
