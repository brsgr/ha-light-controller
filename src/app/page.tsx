"use client";

import { useHomeAssistant } from "@/lib/useHomeAssistant";
import LightCard from "@/components/LightCard";
import { supportsRgbColor } from "@/lib/lightCapabilities";

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

  // Helper to check if all lights in a group support RGB
  const groupSupportsRgb = (groupEntity: any) => {
    if (!groupEntity.attributes.entity_id) return false;
    const memberLights = groupEntity.attributes.entity_id as string[];
    return memberLights.every((lightId) => {
      const light = lights[lightId];
      return light && supportsRgbColor(light);
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500">Control your lights</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {isConnected ? "Connected to Home Assistant" : "Disconnected"}
            </p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            {isConnected && (
              <p className="text-xs text-neutral-500 mt-1">
                {individualLights.length} lights, {lightGroups.length} groups
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Individual Lights */}
      {individualLights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Individual Lights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualLights.map(([id, entity]) => (
              <LightCard key={id} entityId={id} entity={entity} />
            ))}
          </div>
        </div>
      )}

      {/* Light Groups */}
      {lightGroups.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Light Groups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightGroups.map(([id, entity]) => (
              <LightCard key={id} entityId={id} entity={entity} isGroup />
            ))}
          </div>
        </div>
      )}

      {/* No lights message */}
      {!isConnected && !error && (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <p className="text-neutral-500">Connecting to Home Assistant...</p>
        </div>
      )}
    </div>
  );
}
