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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Presets</h1>
          <p className="text-gray-400">
            Quick access light scenes from Home Assistant
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          + Save Current State
        </button>
      </div>

      {/* Create Scene Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              Save Current State as Scene
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              This will capture the current state of all lights and save it as a
              new scene in Home Assistant.
            </p>
            <input
              type="text"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Scene name (e.g., 'Evening Relax')"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewSceneName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScene}
                disabled={!newSceneName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Save Scene
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <p className="text-gray-400">Loading scenes...</p>
        </div>
      )}

      {/* Scenes Grid */}
      {!isLoading && sceneList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sceneList.map(([sceneId, scene]) => (
            <div
              key={sceneId}
              className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all relative group"
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteScene(sceneId, e)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600/80 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
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
                <h3 className="font-semibold mb-1">
                  {scene.attributes.friendly_name ||
                    sceneId.replace("scene.", "")}
                </h3>
                <p className="text-xs text-gray-500">Click to activate</p>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sceneList.length === 0 && !error && (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">No scenes yet</h3>
          <p className="text-gray-400 mb-4">
            Create your first scene by setting up your lights and clicking "Save
            Current State"
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="font-medium mb-2">About Presets</h3>
        <p className="text-sm text-gray-400">
          Presets use Home Assistant's scene system. When you save a scene, it
          captures the current state of all your lights (brightness, color
          temperature, on/off) and stores it in Home Assistant. Click any scene
          card to activate it instantly.
        </p>
      </div>
    </div>
  );
}
