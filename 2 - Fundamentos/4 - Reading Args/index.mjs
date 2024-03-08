import returnData from "./internals_functions.mjs"

const args = process.argv.slice(2)

const name = returnData(args[0])
const age = returnData(args[1])

console.log(name, age)