const fs = require('fs')

fs.rename('file.txt', 'newfile.txt', function(err){
    if (err){
        console.log(err)
        return
    }
    console.log('The file has been renamed.')
})