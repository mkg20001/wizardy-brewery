'use strict'

const Joi = require('joi')

const {subst} = require('../utils')

module.exports = {
  name: 'startupPrint',
  config: Joi.array().required(),
  code: (module, config, env, out) => {
    config.forEach(line => {
      out.script.push(`console.log(${JSON.stringify(subst(env, line))})`)
    })
  }
}
