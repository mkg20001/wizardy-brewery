'use strict'

module.exports = (module, config, env, out) => {
  Object.keys(config).forEach(key => {
    if (!config[key]) {
      out.script.push(`delete process.env[${JSON.stringify(key)}]`)
    } else {
      out.script.push(`process.env[${JSON.stringify(key)}] = ${JSON.stringify(config[key])}`)
    }
  })
}

const Joi = require('joi')

module.exports.config = Joi.object().required()
