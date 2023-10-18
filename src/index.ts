import http from 'http'
import path from 'path'
import express from 'express'
import WebSocket from 'ws'

const port = 23517

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(express.json())

wss.on('connection', (ws) => {
    console.log('Established websocket connection')

    ws.on('message', (message) => {
        console.log('Received: %s', message)
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, `../public/index.html`))
})

app.post('/', (req, res) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body))
        }
    })

    res.sendStatus(200)
})

server.listen(port, () =>
    console.log(`Server is listening on http://localhost:${port}`)
)
