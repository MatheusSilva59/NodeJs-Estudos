const chalk = require('chalk')
const inquirer = require('inquirer')

inquirer.prompt([
    {
        name: 'name', message: 'What is your name?'
    },
    {
        name: 'age', message: 'How old are you?'
    }
]).then(
    (answers) => {
        if (!answers.name || !answers.age){
            throw new Error('The name or age is missing.')
        }
        console.log(chalk.bgYellow.black(`Your name is ${answers.name} and you are ${answers.age} years old.`))
    }
).catch((err) => console.log(err))