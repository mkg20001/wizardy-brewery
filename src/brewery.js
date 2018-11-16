'use strict'

const clone = require('clone')
const merge = require('merge-recursive').recursive

const plugins = require('./plugins')

const fs = require('fs')
const path = require('path')

module.exports = async function brewery (config, mainDir) {
  const modules = Array.isArray(config.modules) ? config.modules.map(mod => merge(clone(config), mod)) : [config]

  const res = await Promise.all(modules.map(async (module) => {
    const env = {}
    const out = {
      actions: [],
      script: [],
      errScript: [],
      filePath: path.join(mainDir, 'bake', module.id + '.js'),
      outPath: path.join(mainDir, 'prod'),
      entry: path.resolve(mainDir, module.entry),
      mainDir
    }

    for (var i = 0; i < plugins.length; i++) {
      let plugin = plugins[i]

      await plugin(module, env, out)
    }

    return out
  }))

  await Promise.all(res.map(async (out) => {
    const tpl = `#!/usr/bin/env node

'use strict'

/* eslint-disable no-console */

(async () => {
  ${out.script.join('\n')}
}.then(() => {
  require(${JSON.stringify(out.entry)})
}, (err) => {
  ${out.errScript.join('\n')}
  console.error(err.stack)
  process.exit(2)
}))

`
    fs.writeFileSync(out.filePath, tpl)
  }))
}
