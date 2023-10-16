import express from "express";
import WebSocket from "ws";
import http from "http";
import path from "path";

const app = express();
const port = 23517;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

wss.on("connection", (ws) => {
  console.log("establish websocket connection");

  ws.on("message", (message) => {
    console.log("received: %s", message);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, `../public/index.html`));
});

app.post("/", (req, res) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(req.body));
    }
  });

  res.sendStatus(200);
});

server.listen(port, () =>
  console.log(`http server is listening on http://localhost:${port}`)
);
