const net = require("net")
const server = net.createServer()
const fs = require('fs')
const path = require('path')

server.listen(9527); // Server listens port 9527

server.on("listening", () => {
    console.log("Server listening 9527")
})

server.on("connection", socket => {
    console.log("Client connected")



    socket.on("data", async chunk => {
        // Send image from server
        const filename = path.resolve(__dirname, "./myfiles/sub2/123.jpeg")
        const imageBuffer = await fs.promises.readFile(filename)
        const headerBuffer = Buffer.from(`HTTP/1.1 200 OK
Content-Type: image

`, 'utf-8')

        const result = Buffer.concat([headerBuffer, imageBuffer])
        socket.write(result)

// send HTML from server
//         socket.write(`HTTP/1.1 200 OK
// Content-Type: image
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     <h1>Hello world</h1>
// </body>
// </html>`)
        socket.end()
    })

    socket.on("close", () => {
        console.log("Connection closed")
    })
})