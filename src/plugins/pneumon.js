'use strict'

const cp = require('child_process')
const exec = w => cp.execSync(w).toString().replace(/\n/g, '')
const path = require('path')
const {subst} = require('../utils')

module.exports = (module, config, env, out) => {
  config.updater = subst(env, config.ota)
  delete config.ota
  config.name = module.id

  if (!module.version) {
    throw new Error('Pneumon mod needs version mod')
  }

  config.version = env.TAG

  if (!out.bundle) {
    throw new Error('Pneumon mod needs bundler')
  }

  out.script.push(`

const Pneumon = require('pneumon')

const app = global.OTA = Pneumon(${JSON.stringify(config).replace('@FILE', out.bundle.getFile)})

if (!await app.isInstalled() || !await app.isRunningAsService()) {
  switch (process.argv.pop()) {
    case 'uninstall':
      console.log('Uninstalling...')
      await app.service.stop()
      await app.uninstall()
      break
    case 'install':
    case 'update':
    default:
      if (await app.checkForUpdates()) {
        console.log('Updating...')
        await app.update()
      } else {
        console.log('Installing...')
        await app.install()
      }
      console.log('Done!')
  }
  process.exit(0) // quit this instance
}

`)

  out.actions.push(async () => {
    await Promise.all((await out.bundle.files()).map(async (file) => {
      console.log(await exec(`npx pneumon --file ${JSON.stringify(path.resolve(out.outPath, file))} --out ${JSON.stringify(path.join(out.outPath, file + '.json'))}`))
    }))
  })
}

const Joi = require('joi')

module.exports.config = {
  format: Joi.string().required()
}
