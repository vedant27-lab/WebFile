// server.js (Complete and Corrected Version)

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3001;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const clients = new Map();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url, true);
    if (pathname !== '/') {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log('🔌 Application client connected.');
    ws.on('error', console.error);

    const clientInfo = {};
    clients.set(ws, clientInfo);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        switch (data.type) {
            case 'frontend_connect':
              clientInfo.type = 'frontend';
              console.log(`Frontend client connected.`);
              broadcastDeviceList();
              break;
            case 'hardware_connect':
              clientInfo.type = 'hardware';
              clientInfo.deviceId = data.deviceId;
              clientInfo.status = 'pending'; // Start as pending
              console.log(`Hardware device '${data.deviceId}' registered, awaiting approval.`);
              broadcastToFrontends({ type: 'device_pending', deviceId: data.deviceId });
              broadcastDeviceList();
              break;
            case 'device_approval':
              for (const [connection, clientMeta] of clients.entries()) {
                if (clientMeta.deviceId === data.deviceId) {
                  if (data.action === 'accept') {
                    clientMeta.status = 'approved';
                    connection.send(JSON.stringify({ type: 'command', command: 'start_sending_data' }));
                    console.log(`Device '${data.deviceId}' approved.`);
                    broadcastToFrontends({ type: 'device_approved', deviceId: data.deviceId });
                  } else {
                    clientMeta.status = 'denied';
                    connection.close(); // If denied, close the connection
                    console.log(`Device '${data.deviceId}' denied.`);
                    broadcastToFrontends({ type: 'device_denied', deviceId: data.deviceId });
                  }
                  broadcastDeviceList();
                  break;
                }
              }
              break;
            case 'sensor_data':
              broadcastToFrontends({ type: 'sensor_data', payload: data.payload });
              break;
          }
      } catch (e) {
        console.error("Failed to process message:", e);
      }
    });

    ws.on('close', () => {
      const disconnectedClient = clients.get(ws);
      if (disconnectedClient?.type === 'hardware') {
        console.log(`Hardware '${disconnectedClient.deviceId}' disconnected.`);
        broadcastToFrontends({ type: 'device_disconnected', deviceId: disconnectedClient.deviceId });
      } else {
        console.log('Client disconnected.');
      }
      clients.delete(ws);
      broadcastDeviceList();
    });
  });

  function broadcastToFrontends(message) {
    for (const [connection, clientMeta] of clients.entries()) {
      if (clientMeta.type === 'frontend' && connection.readyState === 1) {
        connection.send(JSON.stringify(message));
      }
    }
  }

  function broadcastDeviceList() {
    const hardwareList = [];
    for (const [_, clientMeta] of clients.entries()) {
      if (clientMeta.type === 'hardware') {
        hardwareList.push({ 
          deviceId: clientMeta.deviceId, 
          status: clientMeta.status 
        });
      }
    }
    broadcastToFrontends({ type: 'hardware_list_update', payload: hardwareList });
  }

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});