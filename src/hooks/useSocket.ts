// src/hooks/useSocket.ts
import { useEffect } from 'react';
import { useSensorStore } from '@/lib/store';
import toast from 'react-hot-toast';

export const useSocket = (socket: WebSocket | null) => {
  const { 
    setConnectionStatus, 
    updateSensorData, 
    addPendingDevice, 
    removePendingDevice,
    setHardwareDevices
  } = useSensorStore((state) => state.actions);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus('Connected');
      socket.send(JSON.stringify({ type: 'frontend_connect' }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch(data.type) {
          case 'sensor_data':
            updateSensorData(data.payload);
            break;
          case 'device_pending':
            addPendingDevice(data.deviceId);
            toast.success(`New device '${data.deviceId}' wants to connect!`);
            break;
          case 'device_approved':
            removePendingDevice(data.deviceId);
            break;
          case 'device_disconnected':
            removePendingDevice(data.deviceId);
            break;
          case 'hardware_list_update':
            setHardwareDevices(data.payload);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('Disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Disconnected');
    };

  }, [socket, setConnectionStatus, updateSensorData, addPendingDevice, removePendingDevice, setHardwareDevices]);
};