'use strict'

const clone = require('clone')
const merge = require('merge-recursive').recursive

const plugins = require('./plugins')

const fs = require('fs')
const path = require('path')

const log = require('./log')

module.exports = async function brewery (config, mainDir) {
  log.info('Brewery v%s', require('../package.json').version)

  const modules = Array.isArray(config.modules) ? config.modules.map(mod => merge(clone(config), mod)) : [config]

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]

    log.info('Module %s', module.id)

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

    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i]

      if (module[plugin.name]) {
        log.debug('%s->%s %O', module.id, plugin.name, module[plugin.name])
        await plugin.code(module, module[plugin.name], env, out)
      }
    }

    const tpl = `#!/usr/bin/env node

'use strict';

/* eslint-disable no-console */

(async () => {
  ${out.script.join('\n')}
})().then(() => {
  require(${JSON.stringify(out.entry)})
}, (err) => {
  ${out.errScript.join('\n')}
  console.error(err.stack)
  process.exit(2)
})

`
    fs.writeFileSync(out.filePath, tpl)
  }
}
