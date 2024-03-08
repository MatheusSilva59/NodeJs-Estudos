const fs = require('fs')

console.log('Start')

fs.writeFileSync('file.txt', 'Hi!')

console.log('End')