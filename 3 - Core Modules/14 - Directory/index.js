const fs = require('fs')

if(!fs.existsSync('./myfolder')){
    console.log('It does not exist.')
    fs.mkdirSync('myfolder')
}
else if(!fs.existsSync('./myfolder')){
    console.log('It does not exist.')
}