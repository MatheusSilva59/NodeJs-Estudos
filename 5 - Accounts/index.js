const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')

main()

function main() {
    console.clear()
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                '1 - Create account',
                '2 - Check balance',
                '3 - Deposit',
                '4 - Withdraw',
                '5 - Check All Accounts',
                '6 - Exit'
            ]
        }
    ]).then((answers) => {
        const operationNumber = answers.option[0] - 1

        const actions = [createAccount, checkBalance, deposit, withdraw, checkAllBalance, exit]

        actions[operationNumber]()

    }).catch(err => console.log(err))
}

async function prompt(type, name, message) {
    return await inquirer.prompt([
        { type, name, message }
    ]).then((answers) => {
        return answers[name]
    }).catch(err => console.log(err))
}

async function createAccount() {
    console.clear()

    const value = await prompt('string', 'createAccount', 'Type the account name: ')
    const oldData = getCurrentData()

    if (value && !oldData[value]) {
        const newObj = { [value]: { balance: 0 } }
        const currentData = { ...oldData, ...newObj }
        writeFileSync(currentData)
        console.log(chalk.green(`The account ` + chalk.bold(value) + ` has been created successfully.`))
    }
    else if (value.length === 0) {
        console.log(chalk.bgRed.black('Invalid name.'))
    }
    else {
        console.log(chalk.bgRed.black('This name is being used.'))
    }

    setTimeToFunction(clear = true, main)
}

async function checkBalance() {
    console.clear()

    const value = await prompt('string', 'checkBalance', 'Type the account name that you would like to check: ')

    const currentData = getCurrentData()
    if (currentData[value]) {
        console.clear()
        console.log(chalk.bgWhite.black('The balance for the account requested is ' + chalk.bold(currentData[value].balance) + ' BRL.'))
    }
    else {
        console.log(chalk.bgRed.black(`This account does not exist.`))
    }
    setTimeToFunction(clear = true, main, 3500)
}
function checkAllBalance(){
    const currentData = getCurrentData()
    for (account in currentData){
        let normalize = 10 - account.length
        console.log(`Account: ${chalk.bold(account)}${(' ').repeat(normalize)}| Balance: ${chalk.bold(currentData[account].balance)} BRL`)
    } 
    // console.log(currentData)
    setTimeToFunction(clear = true, main, 3500)
}
async function deposit() {
    console.clear()
    const oldData = getCurrentData()

    const account = await prompt('string', 'accountSelected', 'What is the destination account?')

    console.clear()

    if (oldData[account]) {
        const value = await prompt('number', 'deposit', 'How many BRL would you like to deposit? ')

        if (value && value > 0) {
            oldData[account].balance += value

            writeFileSync(oldData)
            console.log(chalk.green('Your deposit of ' + chalk.bold(value) + ' BRL has been made successfully.'))
        }
        else {
            console.log(chalk.bgRed.black('The amount requested is invalid.'))
        }

    }
    else {
        console.log(chalk.bgRed.black('This account does not exist.'))
    }
    setTimeToFunction(clear = true, main)
}

async function withdraw() {
    console.clear()

    const oldData = getCurrentData()
    const account = await prompt('string', 'accountSelected', 'What is the destination account?')

    if (oldData[account]) {
        const value = await prompt('number', 'deposit', 'How many BRL would you like to deposit? ')

        if (value && value > 0) {

            if (oldData[account].balance - value > 0) {
                oldData[account].balance -= value
                writeFileSync(oldData)
                console.log(chalk.green('Your deposit of ' + chalk.bold(value) + ' BRL has been made successfully.'))
            }
            else{
                console.log(chalk.bgRed.black('This account does not have sufficient balance for this withdrawal.\nThe current balance is ' + chalk.bold(oldData[account].balance) + ' BRL.'))
            }

        }
        else {
            console.log(chalk.bgRed.black('The amount requested is invalid.'))
        }

    }
    else {
        console.log(chalk.bgRed.black('This account does not exist.'))
    }

    setTimeToFunction(clear = true, main)
}

function exit() {
    console.clear()
    console.log(chalk.bgWhite.black('Your session has been ended.'))
    process.exit()
}


function setTimeToFunction(clear = false, func, time = 2000) {
    setTimeout(() => {
        if (clear) {
            console.clear()
        }
        func()
    }, time)
}

function getCurrentData() {
    const data = fs.readFileSync('./data/accounts.json')
    try {
        return JSON.parse(data)
    }
    catch {
        return {}
    }
}

function writeFileSync(newFile, path = './data/accounts.json') {
    fs.writeFileSync(path, JSON.stringify(newFile))
}