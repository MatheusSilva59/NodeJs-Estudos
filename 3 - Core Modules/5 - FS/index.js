const fs = require('fs')
const http = require('http')
const url = require('url')

const port = 3000

const server = http.createServer((req, res) => {

    fs.readFile('message.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data)
        return res.end()
    })

})

server.listen(port, () => {
    console.log(`The server is operational on the port ${port}.`)
})