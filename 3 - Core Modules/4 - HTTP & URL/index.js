const http = require('http')
const url = require('url')

const port = 3000

const server = http.createServer((req, res) => {

    const urlInfo = url.parse(req.url, true)
    const name = urlInfo.query.name

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if(!name){
        res.end('<h1>Type your name.</h1><form method="GET"><input type="text" name="name"/><input type="submit" value="Send"/></form>')
    }
    else{
        res.end(`<h1>Welcome, ${name}!</h1>`)
    }
    

})

server.listen(port, () => {
    console.log(`The server is operational on the port ${port}.`)
})