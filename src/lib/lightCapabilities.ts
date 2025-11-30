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
