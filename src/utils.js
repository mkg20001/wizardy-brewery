'use strict'

module.exports = {
  subst: (env, str) =>
    str.replace(/\$([A-Z_]+)/gm, (_, v) => {
      if (typeof env[v] === 'undefined') {
        throw new Error(`${JSON.stringify(str)} accessed undefined env var ${v}`)
      }

      return env[v]
    })
}
