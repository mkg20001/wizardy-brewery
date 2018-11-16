'use strict'

const Joi = require('joi')

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
    const ver = {
      version: require(path.join(out.mainDir, 'package.json')).version,
      revision: exec('git log --oneline | wc -l'),
      commit: exec('git rev-parse HEAD | fold -w 6 | head -n 1'),
      compileTime: Date.now()
    }
    env.VERSION = ver.version
    env.REVISION = ver.revision
    env.COMMIT = ver.commit
    env.COMPILE_TIME = ver.compileTime
    env.TAG = ver.tag = subst(env, config.format)

    out.script.push(`process.moduleVersion = ${JSON.stringify(ver)}`)
  }
}
