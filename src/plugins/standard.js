'use strict'

const Joi = require('joi')
const log = require('../log')

const cp = require('child_process')
const exec = w => cp.execSync(w).toString().replace(/\n/g, '')

module.exports = {
  name: 'standard',
  config: Joi.boolean().required(),
  code: (module, config, env, out) => {
    out.actions.push(async () => {
      let cmd = `standard --fix ${JSON.stringify(out.filePath)}`
      log.info('Executing $ %s', cmd)
      exec(cmd)
    })
  }
}
