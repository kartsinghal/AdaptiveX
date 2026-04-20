import { useState, useEffect } from 'react';
import type { NetworkSpeed } from '../context/AdaptiveContext';

export function useNetworkStatus(): NetworkSpeed {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>('fast');

  useEffect(() => {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkSpeed('offline');
        return;
      }

      // @ts-ignore - navigator.connection is strongly typed in some TS versions, but not all
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const type = connection.effectiveType;
        if (type === 'slow-2g' || type === '2g') {
          setNetworkSpeed('slow');
        } else if (type === '3g') {
          setNetworkSpeed('medium');
        } else {
          setNetworkSpeed('fast');
        }
      } else {
        // Fallback
        setNetworkSpeed('fast');
      }
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // @ts-ignore
    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkSpeed;
}
