const path = require('path')

//absolute path

console.log(path.resolve('./file.txt'))

//forming path

const midFolder = 'reports'
const fileName = 'report01.pdf'

const finalPath = path.join("/", 'files', midFolder, fileName)

console.log(finalPath)