'use strict'

const {subst} = require('../utils')

module.exports = (module, config, env, out) => {
  config.forEach(line => {
    out.script.push(`console.log(${JSON.stringify(subst(env, line))})`)
  })
}

const Joi = require('joi')

module.exports.config = Joi.array().required()
