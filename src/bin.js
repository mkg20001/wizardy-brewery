'use strict'

const brewery = require('./brewery')

const config = require(process.argv[2])
const mainDir = require('path').dirname(process.argv[2])

brewery(config, mainDir)
