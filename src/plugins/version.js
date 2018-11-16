'use strict'

const Joi = require('joi')
const log = require('../log')

const cp = require('child_process')
const exec = w => cp.execSync(w).toString().replace(/\n/g, '')
const path = require('path')
const {subst} = require('../utils')

module.exports = {
  name: 'version',
  config: Joi.object().required().keys({
    format: Joi.string().required()
  }),
  code: (module, config, env, out) => {
    const ver = {}

    env.VERSION = ver.version = require(path.join(out.mainDir, 'package.json')).version
    env.REVISION = ver.revision = exec('git log --oneline | wc -l')
    env.COMMIT = ver.commit = exec('git rev-parse HEAD | fold -w 6 | head -n 1')
    env.COMPILE_TIME = ver.compileTime = Date.now()
    env.TAG = ver.tag = out.version = subst(env, config.format)

    log.info('Version %s', env.TAG)

    out.script.push(`process.moduleVersion = ${JSON.stringify(ver)}`)
  }
}
