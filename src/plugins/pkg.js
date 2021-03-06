'use strict'

const Joi = require('joi')
const log = require('../log')

const pkg = require('pkg')
const fs = require('fs')

module.exports = {
  name: 'pkg',
  config: Joi.object().required(),
  code: (module, config, env, out) => {
    const args = Object.keys(config).reduce((args, key) => {
      let s = key.length === 1 ? '-' : '--'
      let val = config[key]

      args.push(s + key)
      if (typeof val !== 'boolean') {
        args.push(val)
      }

      return args
    }, [])

    out.actions.push(async () => {
      let execArgs = args.concat(['--out-path', out.outPath, out.filePath])
      log.info('Executing $ pkg %s', execArgs.join(' '))
      await pkg.exec(execArgs)
    })

    out.bundle = {
      getFile: '" + Pneumon.guessPkg("$ID") + "'.replace('$ID', module.id),
      files: () =>
        fs.readdirSync(out.outPath).filter(f => f.startsWith(module.id))
    }
  }
}
