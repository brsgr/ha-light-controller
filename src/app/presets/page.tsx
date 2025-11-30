"use client";

import { useState } from "react";
import { useScenes } from "@/lib/useScenes";
import { useHomeAssistant } from "@/lib/useHomeAssistant";
import { activateScene, createScene, deleteScene } from "@/lib/homeassistant";

export default function PresetsPage() {
  const { scenes, isLoading, error } = useScenes();
  const { lights } = useHomeAssistant();
  const [isCreating, setIsCreating] = useState(false);
  const [newSceneName, setNewSceneName] = useState("");

  const sceneList = Object.entries(scenes);

  const handleActivateScene = async (sceneId: string) => {
    try {
      await activateScene(sceneId);
    } catch (err) {
      console.error("Failed to activate scene:", err);
    }
  };

  const handleDeleteScene = async (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent activating scene when clicking delete

    const sceneName =
      scenes[sceneId]?.attributes.friendly_name ||
      sceneId.replace("scene.", "");
    if (!confirm(`Delete scene "${sceneName}"?`)) {
      return;
    }

    try {
      await deleteScene(sceneId);
    } catch (err) {
      console.error("Failed to delete scene:", err);
      alert("Failed to delete scene. Check console for details.");
    }
  };

  const handleCreateScene = async () => {
    if (!newSceneName.trim()) return;

    try {
      // Get all light entity IDs
      const lightIds = Object.keys(lights);

      if (lightIds.length === 0) {
        alert("No lights available to create scene");
        return;
      }

      await createScene(newSceneName, lightIds);
      setNewSceneName("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create scene:", err);
      alert("Failed to create scene. Check console for details.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
            Presets
          </h1>
          <p className="text-sm text-neutral-500">
            Quick access light scenes from Home Assistant
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Save Current State
        </button>
      </div>

      {/* Create Scene Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Save Current State as Scene
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              This will capture the current state of all lights and save it as a
              new scene in Home Assistant.
            </p>
            <input
              type="text"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Scene name (e.g., 'Evening Relax')"
              className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewSceneName("");
                }}
                className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScene}
                disabled={!newSceneName.trim()}
                className="flex-1 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Save Scene
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <p className="text-neutral-500">Loading scenes...</p>
        </div>
      )}

      {/* Scenes Grid */}
      {!isLoading && sceneList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sceneList.map(([sceneId, scene]) => (
            <div
              key={sceneId}
              className="bg-white rounded-xl border border-neutral-200 hover:shadow-lg transition-all relative group"
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteScene(sceneId, e)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 shadow-sm"
                title="Delete scene"
              >
                <span className="text-white text-sm">🗑️</span>
              </button>

              {/* Scene card - clickable area */}
              <button
                onClick={() => handleActivateScene(sceneId)}
                className="w-full p-6 text-left"
              >
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {scene.attributes.friendly_name ||
                    sceneId.replace("scene.", "")}
                </h3>
                <p className="text-xs text-neutral-500">Click to activate</p>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sceneList.length === 0 && !error && (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No scenes yet
          </h3>
          <p className="text-neutral-500 mb-4">
            Create your first scene by setting up your lights and clicking
            &quot;Save Current State&quot;
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
        <h3 className="font-medium text-neutral-900 mb-2">About Presets</h3>
        <p className="text-sm text-neutral-600">
          Presets use Home Assistant&apos;s scene system. When you save a scene,
          it captures the current state of all your lights (brightness, color
          temperature, on/off) and stores it in Home Assistant. Click any scene
          card to activate it instantly.
        </p>
      </div>
    </div>
  );
}
