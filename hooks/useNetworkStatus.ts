// lib/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(true);
  
    useEffect(() => {
      const checkConnection = async () => {
        try {
          const response = await fetch('https://www.google.com');
          setIsOnline(response.status === 200);
        } catch (error) {
          setIsOnline(false);
        }
      };
  
      const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
      checkConnection(); // Initial check
  
      return () => clearInterval(interval);
    }, []);
  
    return isOnline;
  };