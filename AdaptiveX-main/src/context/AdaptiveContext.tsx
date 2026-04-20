import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export type NetworkSpeed = 'fast' | 'medium' | 'slow' | 'offline';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type AdaptiveMode = 'auto' | 'performance' | 'balanced' | 'quality';

interface AdaptiveState {
  networkSpeed: NetworkSpeed;
  deviceType: DeviceType;
  mode: AdaptiveMode;
  activeMode: 'performance' | 'balanced' | 'quality'; // Computed actual mode
  simulatedNetwork: NetworkSpeed | null; // For the toggle
  layoutDensity: 'compact' | 'comfortable' | 'expanded';
  mediaQuality: 'low' | 'medium' | 'high';
  animationsEnabled: boolean;
  setMode: (mode: AdaptiveMode) => void;
  setSimulatedNetwork: (speed: NetworkSpeed | null) => void;
}

const AdaptiveContext = createContext<AdaptiveState | undefined>(undefined);

export const AdaptiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const realNetwork = useNetworkStatus();
  const [mode, setMode] = useState<AdaptiveMode>('auto');
  const [simulatedNetwork, setSimulatedNetwork] = useState<NetworkSpeed | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  // Device detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setDeviceType('mobile');
      else if (window.innerWidth < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveNetwork = simulatedNetwork || realNetwork;

  // Compute the actual mode if set to 'auto'
  let activeMode: 'performance' | 'balanced' | 'quality' = 'quality';
  if (mode !== 'auto') {
    activeMode = mode;
  } else {
    // Auto resolution logic
    if (effectiveNetwork === 'slow' || effectiveNetwork === 'offline' || deviceType === 'mobile') {
      activeMode = 'performance';
    } else if (effectiveNetwork === 'medium' || deviceType === 'tablet') {
      activeMode = 'balanced';
    } else {
      activeMode = 'quality';
    }
  }

  // Derive parameters from activeMode
  const layoutDensity = activeMode === 'performance' ? 'compact' : activeMode === 'balanced' ? 'comfortable' : 'expanded';
  const mediaQuality = activeMode === 'performance' ? 'low' : activeMode === 'balanced' ? 'medium' : 'high';
  const animationsEnabled = activeMode !== 'performance';

  return (
    <AdaptiveContext.Provider
      value={{
        networkSpeed: effectiveNetwork,
        deviceType,
        mode,
        activeMode,
        simulatedNetwork,
        layoutDensity,
        mediaQuality,
        animationsEnabled,
        setMode,
        setSimulatedNetwork,
      }}
    >
      {children}
    </AdaptiveContext.Provider>
  );
};

export const useAdaptive = () => {
  const context = useContext(AdaptiveContext);
  if (context === undefined) {
    throw new Error('useAdaptive must be used within an AdaptiveProvider');
  }
  return context;
};
