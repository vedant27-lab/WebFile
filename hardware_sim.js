// hardware_simulator.js
const WebSocket = require('ws');

// --- CONFIGURATION ---
// For local testing, this connects to the server you run with `npm run dev`
const SERVER_URL = 'ws://localhost:3000'; 
// For production, you would use your deployed server's URL, e.g., 'wss://your-app-name.onrender.com'

const DEVICE_ID = 'ESP32-Master-Grid';
// -------------------

const ws = new WebSocket(SERVER_URL);

// Fired when the connection is successfully opened
ws.on('open', function open() {
  console.log(`[Simulator] ✅ Connected to server at ${SERVER_URL}`);

  // 1. Immediately identify the device to the server.
  const connectMessage = {
    type: 'hardware_connect',
    deviceId: DEVICE_ID
  };
  ws.send(JSON.stringify(connectMessage));
  console.log(`[Simulator] Sent connection request for '${DEVICE_ID}'. Waiting for approval...`);
});

// Fired when a message is received from the server
ws.on('message', function incoming(message) {
  const data = JSON.parse(message.toString());
  console.log('[Simulator] Received command from server:', data);

  // 2. Check if this is the command to start sending data.
  if (data.type === 'command' && data.command === 'start_sending_data') {
    console.log('[Simulator] Approval received! Starting data transmission. 🛰️');

    // 3. Once approved, start sending simulated sensor data every 3 seconds.
    setInterval(() => {
      const simulatedData = {
        voltage: 220.0 + (Math.random() * 10 - 5), // Fluctuates around 220V
        current: 5.0 + (Math.random() * 2 - 1),   // Fluctuates around 5A
        temperature: 28.0 + (Math.random() * 5),  // Temp between 28-33°C
      };
      // Calculate power based on the basics
      simulatedData.power = simulatedData.voltage * simulatedData.current;

      const dataMessage = {
        type: 'sensor_data',
        payload: simulatedData
      };
      
      ws.send(JSON.stringify(dataMessage));
      console.log(`[Simulator] Sent data:`, simulatedData);
    }, 3000);
  }
});

// Fired when the connection is closed
ws.on('close', function close() {
  console.log('[Simulator] ❌ Disconnected from server.');
});

// Fired if an error occurs
ws.on('error', function error(err) {
  console.error('[Simulator] WebSocket error:', err.message);
  console.log('[Simulator] Tip: Is your main server running? Try running `npm run dev` first.');
});