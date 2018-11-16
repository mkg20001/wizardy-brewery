'use strict'

const pkg = require('pkg')

module.exports = (module, config, env, out) => {
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
    await pkg(args.concat(['--out-path', out.outPath, out.filePath]))
  })
}
