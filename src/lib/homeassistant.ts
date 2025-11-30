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

export async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  const haUrl = process.env.NEXT_PUBLIC_HA_URL;
  const haToken = process.env.NEXT_PUBLIC_HA_TOKEN;

  if (!haUrl || !haToken) {
    throw new Error(
      "Missing Home Assistant credentials. Please set NEXT_PUBLIC_HA_URL and NEXT_PUBLIC_HA_TOKEN in .env.local",
    );
  }

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
  data?: { brightness?: number; color_temp_kelvin?: number },
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
