const _ = require('lodash')
const chalk = require('chalk')

const a = [1, 2, 3]
const b = [2, 3, 4]

const diff = _.difference(a, b)

console.log(chalk.green(diff))