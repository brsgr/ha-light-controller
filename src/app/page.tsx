"use client";

import { useHomeAssistant } from "@/lib/useHomeAssistant";

export default function Home() {
  const { lights, isConnected, error } = useHomeAssistant();

  const lightEntries = Object.entries(lights);
  const individualLights = lightEntries.filter(
    ([_, entity]) => !entity.attributes.entity_id,
  );
  const lightGroups = lightEntries.filter(
    ([_, entity]) =>
      entity.attributes.entity_id && Array.isArray(entity.attributes.entity_id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Control your lights</p>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <div>
            <p className="font-medium">
              {isConnected ? "Connected to Home Assistant" : "Disconnected"}
            </p>
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
            {isConnected && (
              <p className="text-sm text-gray-400 mt-1">
                {individualLights.length} lights, {lightGroups.length} groups
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Individual Lights */}
      {individualLights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Individual Lights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualLights.map(([id, entity]) => (
              <div
                key={id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {entity.attributes.friendly_name || id}
                </h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>
                    State: <span className="text-white">{entity.state}</span>
                  </p>
                  {entity.attributes.brightness && (
                    <p>
                      Brightness:{" "}
                      <span className="text-white">
                        {Math.round(entity.attributes.brightness / 2.55)}%
                      </span>
                    </p>
                  )}
                  {(entity.attributes.color_temp_kelvin ||
                    entity.attributes.color_temp) && (
                    <p>
                      Color Temp:{" "}
                      <span className="text-white">
                        {entity.attributes.color_temp_kelvin ||
                          entity.attributes.color_temp}
                        K
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Light Groups */}
      {lightGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Light Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightGroups.map(([id, entity]) => (
              <div
                key={id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {entity.attributes.friendly_name || id}
                </h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>
                    State: <span className="text-white">{entity.state}</span>
                  </p>
                  <p>
                    Lights:{" "}
                    <span className="text-white">
                      {entity.attributes.entity_id?.length || 0}
                    </span>
                  </p>
                  <div className="mt-2 text-xs">
                    {entity.attributes.entity_id?.map((lightId: string) => (
                      <div key={lightId} className="text-gray-500">
                        {lightId}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No lights message */}
      {!isConnected && !error && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <p className="text-gray-400">Connecting to Home Assistant...</p>
        </div>
      )}
    </div>
  );
}
