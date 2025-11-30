import { HassEntity } from "home-assistant-js-websocket";

// Home Assistant light feature flags (DEPRECATED - for backward compatibility)
// https://developers.home-assistant.io/docs/core/entity/light/
const SUPPORT_BRIGHTNESS = 1;
const SUPPORT_COLOR_TEMP = 2;

// Modern color modes (preferred)
const COLOR_MODE_ONOFF = "onoff";
const COLOR_MODE_BRIGHTNESS = "brightness";
const COLOR_MODE_COLOR_TEMP = "color_temp";
const COLOR_MODE_HS = "hs";
const COLOR_MODE_RGB = "rgb";
const COLOR_MODE_RGBW = "rgbw";
const COLOR_MODE_RGBWW = "rgbww";
const COLOR_MODE_XY = "xy";

export function supportsBrightness(entity: HassEntity): boolean {
  // Modern approach: check supported_color_modes
  if (entity.attributes.supported_color_modes) {
    const modes = entity.attributes.supported_color_modes as string[];
    // Brightness is supported if the light has any mode other than 'onoff'
    return modes.some((mode) => mode !== COLOR_MODE_ONOFF);
  }

  // Fallback to deprecated supported_features
  const features = entity.attributes.supported_features || 0;
  return (features & SUPPORT_BRIGHTNESS) !== 0;
}

export function supportsColorTemp(entity: HassEntity): boolean {
  // Modern approach: check supported_color_modes
  if (entity.attributes.supported_color_modes) {
    const modes = entity.attributes.supported_color_modes as string[];
    return modes.includes(COLOR_MODE_COLOR_TEMP);
  }

  // Fallback to deprecated supported_features
  const features = entity.attributes.supported_features || 0;
  return (features & SUPPORT_COLOR_TEMP) !== 0;
}

export function getCurrentBrightness(entity: HassEntity): number {
  // HA brightness is 0-255, we'll use 0-100 for the UI
  const brightness = entity.attributes.brightness || 0;
  return Math.round((brightness / 255) * 100);
}

export function getCurrentColorTemp(entity: HassEntity): number {
  // Return kelvin value if available, otherwise convert from mireds
  if (entity.attributes.color_temp_kelvin) {
    return entity.attributes.color_temp_kelvin;
  }
  if (entity.attributes.color_temp) {
    // Convert mireds to kelvin: K = 1,000,000 / mireds
    return Math.round(1000000 / entity.attributes.color_temp);
  }
  // Default to 4000K if no color temp is set
  return 4000;
}

export function getColorTempRange(entity: HassEntity): {
  min: number;
  max: number;
} {
  // Default range in Kelvin
  const defaultRange = { min: 2700, max: 6500 };

  if (
    entity.attributes.min_color_temp_kelvin &&
    entity.attributes.max_color_temp_kelvin
  ) {
    return {
      min: entity.attributes.min_color_temp_kelvin,
      max: entity.attributes.max_color_temp_kelvin,
    };
  }

  if (entity.attributes.min_mireds && entity.attributes.max_mireds) {
    return {
      min: Math.round(1000000 / entity.attributes.max_mireds),
      max: Math.round(1000000 / entity.attributes.min_mireds),
    };
  }

  return defaultRange;
}

export function supportsRgbColor(entity: HassEntity): boolean {
  // Modern approach: check supported_color_modes
  if (entity.attributes.supported_color_modes) {
    const modes = entity.attributes.supported_color_modes as string[];
    // RGB is supported if the light has any RGB-capable mode
    return modes.some((mode) =>
      [
        COLOR_MODE_RGB,
        COLOR_MODE_RGBW,
        COLOR_MODE_RGBWW,
        COLOR_MODE_HS,
        COLOR_MODE_XY,
      ].includes(mode),
    );
  }

  // Fallback: check for SUPPORT_COLOR flag (16)
  const features = entity.attributes.supported_features || 0;
  return (features & 16) !== 0;
}

export function getCurrentRgbColor(
  entity: HassEntity,
): [number, number, number] {
  // Return current RGB color, default to white if not set
  if (
    entity.attributes.rgb_color &&
    Array.isArray(entity.attributes.rgb_color)
  ) {
    return entity.attributes.rgb_color as [number, number, number];
  }
  return [255, 255, 255]; // Default to white
}

export function rgbToHex(rgb: [number, number, number]): string {
  const [r, g, b] = rgb;
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 255, 255];
}
