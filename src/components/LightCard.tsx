"use client";

import { HassEntity } from "home-assistant-js-websocket";
import { useState, useRef, useEffect } from "react";
import { controlLight } from "@/lib/homeassistant";
import {
  supportsBrightness,
  supportsColorTemp,
  getCurrentBrightness,
  getCurrentColorTemp,
  getColorTempRange,
} from "@/lib/lightCapabilities";

interface LightCardProps {
  entityId: string;
  entity: HassEntity;
  isGroup?: boolean;
}

export default function LightCard({
  entityId,
  entity,
  isGroup = false,
}: LightCardProps) {
  const isOn = entity.state === "on";
  const hasBrightness = supportsBrightness(entity);
  const hasColorTemp = supportsColorTemp(entity);

  const [brightness, setBrightness] = useState(getCurrentBrightness(entity));
  const [colorTemp, setColorTemp] = useState(getCurrentColorTemp(entity));
  const colorTempRange = getColorTempRange(entity);

  // Refs to track pending updates
  const brightnessTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colorTempTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (brightnessTimeoutRef.current)
        clearTimeout(brightnessTimeoutRef.current);
      if (colorTempTimeoutRef.current)
        clearTimeout(colorTempTimeoutRef.current);
    };
  }, []);

  const handleToggle = async () => {
    try {
      await controlLight(entityId, isOn ? "turn_off" : "turn_on");
    } catch (error) {
      console.error("Failed to toggle light:", error);
    }
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);

    // Clear any pending timeout
    if (brightnessTimeoutRef.current) {
      clearTimeout(brightnessTimeoutRef.current);
    }

    // Set new timeout to update after user stops dragging
    brightnessTimeoutRef.current = setTimeout(async () => {
      if (isOn) {
        try {
          // Convert 0-100 to 0-255 for HA
          await controlLight(entityId, "turn_on", {
            brightness: Math.round((value / 100) * 255),
          });
        } catch (error) {
          console.error("Failed to set brightness:", error);
        }
      }
    }, 300); // Wait 300ms after user stops dragging
  };

  const handleColorTempChange = (value: number) => {
    setColorTemp(value);

    // Clear any pending timeout
    if (colorTempTimeoutRef.current) {
      clearTimeout(colorTempTimeoutRef.current);
    }

    // Set new timeout to update after user stops dragging
    colorTempTimeoutRef.current = setTimeout(async () => {
      if (isOn) {
        try {
          await controlLight(entityId, "turn_on", {
            color_temp_kelvin: value,
          });
        } catch (error) {
          console.error("Failed to set color temperature:", error);
        }
      }
    }, 300); // Wait 300ms after user stops dragging
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {entity.attributes.friendly_name || entityId}
          </h3>
          {isGroup && entity.attributes.entity_id && (
            <p className="text-xs text-gray-500 mt-1">
              {entity.attributes.entity_id.length} lights
            </p>
          )}
        </div>

        {/* On/Off Toggle */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? "bg-blue-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isOn ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* State */}
      <div className="text-sm text-gray-400 mb-4">
        State: <span className="text-white">{entity.state}</span>
      </div>

      {/* Brightness Slider */}
      {hasBrightness && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Brightness</label>
            <span className="text-sm text-white">{brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
            disabled={!isOn}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
          />
        </div>
      )}

      {/* Color Temperature Slider */}
      {hasColorTemp && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Color Temp</label>
            <span className="text-sm text-white">{colorTemp}K</span>
          </div>
          <input
            type="range"
            min={colorTempRange.min}
            max={colorTempRange.max}
            value={colorTemp}
            onChange={(e) => handleColorTempChange(parseInt(e.target.value))}
            disabled={!isOn}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Warm ({colorTempRange.min}K)</span>
            <span>Cool ({colorTempRange.max}K)</span>
          </div>
        </div>
      )}
    </div>
  );
}
