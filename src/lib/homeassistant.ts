import {
  createConnection,
  subscribeEntities,
  callService,
  createLongLivedTokenAuth,
  HassEntities,
  Connection,
  HassEntity,
} from "home-assistant-js-websocket";

let connection: Connection | null = null;
let configPromise: Promise<{ haUrl: string; haToken: string }> | null = null;

async function getConfig(): Promise<{ haUrl: string; haToken: string }> {
  if (!configPromise) {
    configPromise = fetch("/api/config")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch configuration: ${res.status} ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("Config received:", {
          haUrl: data.haUrl,
          hasToken: !!data.haToken,
        });
        if (!data.haUrl || !data.haToken) {
          throw new Error(
            "[v2] Missing Home Assistant credentials. Please configure ha_url and ha_token in the add-on Configuration tab and restart the add-on.",
          );
        }
        return data;
      })
      .catch((error) => {
        console.error("Config fetch error:", error);
        throw error;
      });
  }
  return configPromise;
}

export async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  const { haUrl, haToken } = await getConfig();

  try {
    const auth = createLongLivedTokenAuth(haUrl, haToken);
    connection = await createConnection({ auth });
    return connection;
  } catch (error) {
    throw error;
  }
}

export async function subscribeToLights(
  callback: (lights: Record<string, HassEntity>) => void,
) {
  const conn = await getConnection();

  return subscribeEntities(conn, (entities: HassEntities) => {
    // Filter for light entities
    const lights = Object.fromEntries(
      Object.entries(entities).filter(([id]) => id.startsWith("light.")),
    );

    callback(lights);
  });
}

export async function controlLight(
  entityId: string,
  action: "turn_on" | "turn_off",
  data?: {
    brightness?: number;
    color_temp_kelvin?: number;
    rgb_color?: [number, number, number];
  },
) {
  const conn = await getConnection();
  return callService(conn, "light", action, {
    entity_id: entityId,
    ...data,
  });
}

export async function getLightState(
  entityId: string,
): Promise<HassEntity | null> {
  const conn = await getConnection();
  const states = (await conn.sendMessagePromise({
    type: "get_states",
  })) as HassEntity[];
  return states.find((state) => state.entity_id === entityId) || null;
}

// Scene functions
export async function subscribeToScenes(
  callback: (scenes: Record<string, HassEntity>) => void,
) {
  const conn = await getConnection();

  return subscribeEntities(conn, (entities: HassEntities) => {
    // Filter for scene entities
    const scenes = Object.fromEntries(
      Object.entries(entities).filter(([id]) => id.startsWith("scene.")),
    );

    callback(scenes);
  });
}

export async function activateScene(sceneId: string) {
  const conn = await getConnection();
  return callService(conn, "scene", "turn_on", {
    entity_id: sceneId,
  });
}

export async function createScene(sceneName: string, lightEntityIds: string[]) {
  const conn = await getConnection();

  // scene.create takes a snapshot of current light states
  return callService(conn, "scene", "create", {
    scene_id: sceneName.toLowerCase().replace(/\s+/g, "_"),
    snapshot_entities: lightEntityIds,
  });
}

export async function deleteScene(sceneId: string) {
  const conn = await getConnection();

  // Use scene.delete service to remove a scene
  return callService(conn, "scene", "delete", {
    entity_id: sceneId,
  });
}
