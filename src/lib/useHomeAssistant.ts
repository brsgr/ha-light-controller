"use client";

import { useEffect, useState } from "react";
import { subscribeToLights } from "./homeassistant";
import { HassEntity } from "home-assistant-js-websocket";

export function useHomeAssistant() {
  const [lights, setLights] = useState<Record<string, HassEntity>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const connect = async () => {
      try {
        unsubscribe = await subscribeToLights((newLights) => {
          setLights(newLights);
          setIsConnected(true);
          setError(null);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect");
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { lights, isConnected, error };
}
