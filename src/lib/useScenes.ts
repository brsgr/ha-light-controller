'use client';

import { useEffect, useState } from 'react';
import { subscribeToScenes } from './homeassistant';
import { HassEntity } from 'home-assistant-js-websocket';

export function useScenes() {
  const [scenes, setScenes] = useState<Record<string, HassEntity>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const connect = async () => {
      try {
        unsubscribe = await subscribeToScenes((newScenes) => {
          setScenes(newScenes);
          setIsLoading(false);
          setError(null);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load scenes");
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { scenes, isLoading, error };
}
