const fs = require('fs')

fs.unlink('file.txt', function(err){
    if (err){
        console.log(err)
        return
    }
    console.log('The file has been deleted.')
})