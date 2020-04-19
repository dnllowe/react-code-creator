#!/usr/bin/env node
const { fork } = require("child_process")
const args = process.argv.slice(2)
const currentDir = process.cwd()

const execArgs = ['--plopfile', `${currentDir}/node_modules/plop-react/bin/plopfile.js`, '--dest', './']
const allArgs = execArgs.concat(args)

fork(`${currentDir}/node_modules/plop-react/node_modules/plop/bin/plop.js`, allArgs, { cwd: './' })