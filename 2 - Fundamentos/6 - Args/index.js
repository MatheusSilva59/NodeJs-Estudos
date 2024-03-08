// externo
const minimist = require('minimist')

// interno
const plus = require('./plus').plus


const args = minimist(process.argv.slice(2))
const a = args['n1']
const b = args['n2']

console.log(plus(a, b))