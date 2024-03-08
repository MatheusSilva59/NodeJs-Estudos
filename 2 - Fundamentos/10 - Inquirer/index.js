const inquirer = require('inquirer')

inquirer.prompt([
    {
        name: 'p1', message: 'What is the first score?'
    },
    {
        name: 'p2', message: 'What is the second score?'
    }
]).then((answers) => {
    console.log(answers)

    const average = (parseFloat(answers.p1) + parseFloat(answers.p2)) / 2

    console.log(average)
}).catch(err => console.log(err))