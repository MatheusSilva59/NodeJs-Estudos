const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Testing</h1><p>Testing updates</p>')

})

server.listen(port, () => {
    console.log(`The server is operational on the port ${port}.`)
})