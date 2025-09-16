// src/app/devices/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSensorStore } from "@/lib/store";
import { IoHardwareChip, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

export default function DevicesPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Manage the socket connection for this page
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.host}`;
    const ws = new WebSocket(url);
    ws.onopen = () => ws.send(JSON.stringify({ type: 'frontend_connect' }));
    setSocket(ws);
    return () => ws.close();
  }, []);

  const { hardwareDevices, pendingDevices } = useSensorStore((state) => ({
    hardwareDevices: state.hardwareDevices,
    pendingDevices: state.pendingDevices,
  }));
  const { removePendingDevice } = useSensorStore((state) => state.actions);

  const handleApproval = (deviceId: string, action: 'accept' | 'reject') => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'device_approval', deviceId, action }));
      // Optimistically remove from UI
      removePendingDevice(deviceId);
    }
  };

  const approvedDevices = hardwareDevices.filter(d => d.status === 'approved');
  const connectedDevices = hardwareDevices.filter(d => d.status === 'connected');

  return (
    <div className="container p-4 mx-auto">
      {/* Pending Requests Section */}
      {pendingDevices.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-yellow-400">Pending Requests</h2>
          <div className="flex flex-col gap-3">
            {pendingDevices.map(deviceId => (
              <div key={deviceId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="font-mono text-white"><strong>{deviceId}</strong></span>
                <div className="flex gap-3">
                  <button onClick={() => handleApproval(deviceId, 'accept')} className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <IoCheckmarkCircle /> Accept
                  </button>
                  <button onClick={() => handleApproval(deviceId, 'reject')} className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                    <IoCloseCircle /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Devices Section */}
      <h1 className="mb-6 text-3xl font-bold text-green-400">Approved Devices</h1>
      {approvedDevices.length === 0 ? (
        <p className="text-gray-400">No hardware devices have been approved.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approvedDevices.map((device) => (
            <div key={device.deviceId} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
              <IoHardwareChip className="w-10 h-10 text-blue-400" />
              <div>
                <p className="font-bold text-white">{device.deviceId}</p>
                <p className="text-sm text-green-400 capitalize">{device.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}