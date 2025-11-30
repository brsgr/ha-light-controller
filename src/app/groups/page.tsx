"use client";

import { useHomeAssistant } from "@/lib/useHomeAssistant";
import LightCard from "@/components/LightCard";

export default function GroupsPage() {
  const { lights, isConnected, error } = useHomeAssistant();

  const lightGroups = Object.entries(lights).filter(
    ([_, entity]) =>
      entity.attributes.entity_id && Array.isArray(entity.attributes.entity_id),
  );

  const haUrl =
    process.env.NEXT_PUBLIC_HA_URL || "http://homeassistant.local:8123";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Light Groups</h1>
          <p className="text-gray-400">
            Control and manage light groups from Home Assistant
          </p>
        </div>
        <a
          href={`${haUrl}/config/helpers`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          + Create in HA
        </a>
      </div>

      {/* Connection Status */}
      {!isConnected && !error && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400">Connecting to Home Assistant...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-300 mb-2">About Light Groups</h3>
        <p className="text-sm text-blue-200 mb-3">
          Light groups allow you to control multiple lights as a single entity.
          Home Assistant manages groups through the Helpers interface.
        </p>
        <p className="text-sm text-blue-200">
          To create or modify groups, click "Create in HA" above or visit{" "}
          <span className="font-mono text-blue-100">
            Settings → Devices & Services → Helpers
          </span>{" "}
          in Home Assistant.
        </p>
      </div>

      {/* Groups Grid */}
      {isConnected && lightGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Your Light Groups ({lightGroups.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightGroups.map(([id, entity]) => (
              <LightCard key={id} entityId={id} entity={entity} isGroup />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isConnected && lightGroups.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No light groups yet</h3>
          <p className="text-gray-400 mb-4">
            Create light groups in Home Assistant to control multiple lights
            together
          </p>
          <a
            href={`${haUrl}/config/helpers`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Light Group in HA
          </a>
        </div>
      )}
    </div>
  );
}
