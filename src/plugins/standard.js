'use strict'

const Joi = require('joi')
const log = require('../log')

const fs = require('fs')
const standard = require('standard')

module.exports = {
  name: 'standard',
  config: Joi.boolean().required(),
  code: (module, config, env, out) => {
    out.actions.push(async () => {
      log.info('Standard format %s', out.filePath)
      const fixed = standard.lintTextSync(String(fs.readFileSync(out.filePath)), {fix: true}).results[0].output
      fs.writeFileSync(out.filePath, fixed)
    })
  }
}
