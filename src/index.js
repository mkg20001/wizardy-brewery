'use strict'

const clone = require('clone')
const merge = require('merge').recursive
const rimraf = require('rimraf').sync
const mkdirp = require('mkdirp').sync

const plugins = require('./plugins')

const fs = require('fs')
const path = require('path')

const log = require('./log')

module.exports = async function brewery (config, mainDir) {
  log.info('Brewery v%s', require('../package.json').version)

  const modules = Array.isArray(config.modules) ? config.modules.map(mod => merge(clone(config), mod)) : [config]

  const outTpl = {
    actions: [],
    script: [],
    errScript: [],
    bakePath: path.join(mainDir, 'bake'),
    outPath: path.join(mainDir, 'prod'),
    mainDir
  }

  rimraf(outTpl.bakePath)
  mkdirp(outTpl.bakePath)
  rimraf(outTpl.outPath)
  mkdirp(outTpl.outPath)

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]

    log.info('Module %s', module.id)

    const env = {}
    const out = clone(outTpl)
    out.entry = path.resolve(mainDir, module.entry)
    out.filePath = path.join(mainDir, 'bake', module.id + '.js')

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
    log.info('Written %s', out.filePath)

    for (let i = 0; i < out.actions.length; i++) {
      const action = out.actions[i]
      log.debug('action %o/%o', i + 1, out.actions.length)
      await action()
    }
  }
}
