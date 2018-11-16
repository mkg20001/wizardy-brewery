#!/usr/bin/env node

'use strict'

const brewery = require('.')
const fs = require('fs')

const confFile = fs.realpathSync(process.argv[2])
const config = require(confFile)
const mainDir = require('path').dirname(confFile)

brewery(config, mainDir)
