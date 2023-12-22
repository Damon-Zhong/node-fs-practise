const net = require('net')

// Create a read/write stream
const socket = net.createConnection({
    host: "duyi.ke.qq.com",
    port: 80
}, () => {
    console.log("Connection established!")
})

socket.write(`GET / HTTP/1.1
Host: duyi.ke.qq.com

`)

let isFirst = true

/**
 * Extract response head and body
 * @param {*} response 
 */
function parseHeader(response){
    const headIdx = response.indexOf("<html>")
    console.log(headIdx)
    const head = response.substring(0, headIdx)
    const body = response.substring(headIdx)

    const headParts = head.split("\r\n").slice(1).map
    headParts.reduce((a, b) => {

    },)

    console.log("head", headParts)

}

socket.on("data", (chunk) => {
    const resStr = chunk.toString("utf-8")
    if(isFirst){
        parseHeader(resStr)
        isFirst = false
    }
    console.log(chunk.toString("utf-8"))
})


socket.on("close", () => {
    console.log("Connection closed")
})