'use strict'

const Joi = require('joi')

module.exports = {
  name: 'env',
  config: Joi.object().required(),
  code: (module, config, env, out) => {
    Object.keys(config).forEach(key => {
      if (!config[key]) {
        out.script.push(`delete process.env[${JSON.stringify(key)}]`)
      } else {
        out.script.push(`process.env[${JSON.stringify(key)}] = ${JSON.stringify(config[key])}`)
      }
    })
  }
}
