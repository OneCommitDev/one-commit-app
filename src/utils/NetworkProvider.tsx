// src/context/NetworkProvider.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as Network from "expo-network";

type NetworkContextType = {
  isConnected: boolean;
};

export const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
});

export default function NetworkProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? false);
    };

    checkConnection();

    // Poll every 3 seconds (expo-network has no event listener like NetInfo)
    const interval = setInterval(checkConnection, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
}
