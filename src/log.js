'use strict'

/* eslint-disable no-console */

const chalk = require('chalk')

const prefixed = (prefix, fnc) => {
  return (...a) => {
    if (typeof a[0] === 'string') {
      a[0] = prefix + ' ' + a[0]
    } else {
      a.unshift(prefix + ' %o')
    }

    return fnc(...a)
  }
}

module.exports = {
  debug: prefixed(chalk.grey('[DEBUG]'), console.log),
  info: prefixed(chalk.white.bold('[INFO]'), console.log),
  warn: prefixed(chalk.yellow.bold('[WARN]'), console.error),
  error: prefixed(chalk.red.bold('[ERROR]'), console.error)
}
