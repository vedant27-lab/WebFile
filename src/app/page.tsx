// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSocket } from "@/hooks/useSocket";
import { useSensorStore } from "@/lib/store";
import Meter from '@/components/Meter';
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

export default function HomePage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // This useEffect hook manages the single WebSocket connection for the page
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.host}`;
    const ws = new WebSocket(url);
    setSocket(ws);
    
    // Cleanup function to close the socket when the component is unmounted
    return () => {
      ws.close();
    }
  }, []);

  // Our hook now receives the socket instance to attach listeners
  useSocket(socket);

  // Get data and pending devices from our central store
  const { sensorData, pendingDevices } = useSensorStore();

  // This function sends the approval message to the server
  const handleApproval = (deviceId: string, action: 'accept' | 'reject') => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'device_approval',
        deviceId,
        action,
      }));
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-green-400">
        ⚡ Generation Dashboard
      </h1>

      {/* Approval Section */}
      {pendingDevices.length > 0 && (
        <div className="p-4 mb-6 text-center bg-yellow-900 border border-yellow-600 rounded-lg shadow-lg animate-pulse">
          <h2 className="text-xl font-semibold text-yellow-200">Pending Connection Requests</h2>
          {pendingDevices.map(deviceId => (
            <div key={deviceId} className="flex items-center justify-between p-3 mt-3 bg-gray-800 rounded-md">
              <span className="font-mono text-white">Device ID: <strong>{deviceId}</strong></span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApproval(deviceId, 'accept')}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                  <IoCheckmarkCircle /> Accept
                </button>
                <button
                  onClick={() => handleApproval(deviceId, 'reject')}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                >
                  <IoCloseCircle /> Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meter Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Meter title="Voltage" value={sensorData.voltage} unit="V" min={200} max={250} color="#8884d8" />
        <Meter title="Current" value={sensorData.current} unit="A" min={0} max={10} color="#82ca9d" />
        <Meter title="Power" value={sensorData.power} unit="W" min={0} max={3000} color="#ffc658" />
        <Meter title="Temperature" value={sensorData.temperature} unit="°C" min={0} max={50} color="#ff7300" />
      </div>
    </div>
  );
}