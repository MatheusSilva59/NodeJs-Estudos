const fs = require('fs')

console.log('Start')

fs.writeFile('file.txt', 'Heeey!', (err) => {
    setTimeout(() => {
        console.log('The file has been edited.')
    }, 1000)
})

console.log('End')