// src/lib/store.ts
import { create } from 'zustand';

type SensorData = {
  temperature?: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
  powerFactor?: number;
};

type SensorState = {
  connectionStatus: 'Connecting' | 'Connected' | 'Disconnected';
  sensorData: SensorData;
  pendingDevices: string[]; // Holds IDs of devices awaiting approval
  hardwareDevices: any[]; 
  actions: {
    setConnectionStatus: (status: SensorState['connectionStatus']) => void;
    updateSensorData: (data: SensorData) => void;
    addPendingDevice: (deviceId: string) => void;
    removePendingDevice: (deviceId: string) => void;
    setHardwareDevices: (devices: any[]) => void;
  }
};

export const useSensorStore = create<SensorState>((set) => ({
  connectionStatus: 'Disconnected',
  sensorData: {},
  pendingDevices: [], // Initialize as an empty array
  hardwareDevices: [],
  actions: {
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    updateSensorData: (data) => set((state) => ({ 
      sensorData: { ...state.sensorData, ...data } 
    })),
    addPendingDevice: (deviceId) => set((state) => ({
      pendingDevices: state.pendingDevices.includes(deviceId) 
        ? state.pendingDevices 
        : [...state.pendingDevices, deviceId]
    })),
    removePendingDevice: (deviceId) => set((state) => ({
      pendingDevices: state.pendingDevices.filter(id => id !== deviceId)
    })),
    setHardwareDevices: (devices) => set({ hardwareDevices: devices }),
  }
}));