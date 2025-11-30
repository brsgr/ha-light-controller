import { HassEntity } from 'home-assistant-js-websocket';

export interface Light extends HassEntity {
  entity_id: string;
  state: 'on' | 'off';
  attributes: {
    brightness?: number;
    color_temp?: number;
    color_temp_kelvin?: number;
    rgb_color?: [number, number, number];
    friendly_name?: string;
    supported_features?: number;
    entity_id?: string[]; // For groups
  };
}

export interface SchedulePoint {
  hour: number;
  brightness: number;
  colorTemp: number;
}

export interface Schedule {
  id: string;
  name: string;
  target: string; // 'all' | entity_id | area name
  targetName: string;
  enabled: boolean;
  points: SchedulePoint[];
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  created_at?: string;
}

export interface Preset {
  id: string;
  name: string;
  icon: string;
  entity_ids: string[];
  settings: {
    brightness: number;
    colorTemp: number;
  };
  created_at?: string;
}

export interface Area {
  area_id: string;
  name: string;
}

export interface LightGroup {
  entity_id: string;
  name: string;
  entity_ids: string[];
}
