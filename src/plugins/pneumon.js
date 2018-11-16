'use strict'

const Joi = require('joi')
const log = require('../log')

const cp = require('child_process')
const exec = w => cp.execSync(w).toString().replace(/\n/g, '')
const path = require('path')
const {subst} = require('../utils')

module.exports = {
  name: 'pneumon',
  config: Joi.object().required().keys({
    ota: Joi.string().required()
  }),
  code: (module, config, env, out) => {
    config.updater = subst(env, config.ota)
    delete config.ota
    config.name = module.id

    if (!out.version) {
      throw new Error('Pneumon mod needs version mod')
    }

    config.version = out.version

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
    }
    console.log('Done!')
    process.exit(0) // quit this instance
  }
  `)

    if (module.eFlag) {
      out.script.push(`
      if (eFlag.get()) {
        await app.update()
        eFlag.false()
      }
`)
    }

    out.actions.push(async () => {
      let files = await out.bundle.files()
      for (var i = 0; i < files.length; i++) {
        let file = files[i]

        const cmd = `npx pneumon --file ${JSON.stringify(path.resolve(out.outPath, file))} --hash --version ${JSON.stringify(out.version)} --out ${JSON.stringify(path.join(out.outPath, file + '.json'))}`
        log.info('Executing $ %s', cmd)
        log.info(await exec(cmd))
      }
    })
  }
}
