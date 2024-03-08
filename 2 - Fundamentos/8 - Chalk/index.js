const chalk = require('chalk')

const score = 5

if (score >= 7){
    console.log(chalk.green('Congratulations! You are approved!'))
}
else{
    console.log(chalk.bgRed.white.bold('Unfortunately, you are not approved.'))
}