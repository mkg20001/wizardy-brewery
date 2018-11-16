'use strict'

const Joi = require('joi')

module.exports = {
  name: 'eFlag',
  config: Joi.boolean().required(),
  code: (module, config, env, out) => {
    out.script.push(`

  const path = require('path')
  const os = require('os')
  const fs = require('fs')
  const E_FLAG = path.join(os.tmpdir(), ${JSON.stringify('.error-flag-' + module.id)})
  const eFlag = global._EFLAG = {
    get: () => fs.existsSync(E_FLAG),
    true: () => fs.writeFileSync(E_FLAG, '1'),
    false: () => fs.existsSync(E_FLAG) ? fs.unlinkSync(E_FLAG) : null
  }

  process.on('uncaughtException', () => eFlag.true())

`)
    out.errScript.push('global._EFLAG.true()')
  }
}
