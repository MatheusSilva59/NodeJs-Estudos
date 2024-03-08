const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question('What is your favorite language for programming? ', (language) => {
    console.log(`Your favorite language is ${language}.`)
    readline.close()
})