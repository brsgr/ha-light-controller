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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
            Light Groups
          </h1>
          <p className="text-sm text-neutral-500">
            Control and manage light groups from Home Assistant
          </p>
        </div>
        <a
          href={`${haUrl}/config/helpers`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Create in HA
        </a>
      </div>

      {/* Connection Status */}
      {!isConnected && !error && (
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <p className="text-neutral-500">Connecting to Home Assistant...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
        <h3 className="font-medium text-neutral-900 mb-2">
          About Light Groups
        </h3>
        <p className="text-sm text-neutral-600 mb-3">
          Light groups allow you to control multiple lights as a single entity.
          Home Assistant manages groups through the Helpers interface.
        </p>
        <p className="text-sm text-neutral-600">
          To create or modify groups, click &quot;Create in HA&quot; above or
          visit{" "}
          <span className="font-mono text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
            Settings → Devices & Services → Helpers
          </span>{" "}
          in Home Assistant.
        </p>
      </div>

      {/* Groups Grid */}
      {isConnected && lightGroups.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
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
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No light groups yet
          </h3>
          <p className="text-neutral-500 mb-4">
            Create light groups in Home Assistant to control multiple lights
            together
          </p>
          <a
            href={`${haUrl}/config/helpers`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors"
          >
            Create Light Group in HA
          </a>
        </div>
      )}
    </div>
  );
}
