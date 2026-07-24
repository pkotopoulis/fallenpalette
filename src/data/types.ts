export interface Paint {
  brand: string;
  name: string;
  hex: string;
  type: string;
}

export interface PaintGroup {
  family: string;
  paints: Paint[];
}

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type StoreHours = Record<DayKey, string>;

export interface Store {
  id: number;
  name: string;
  city: string;
  country: string;
  postal: string;
  address: string;
  lat?: number;      // optional — may be unknown for partially-sourced stores
  lng?: number;
  phone?: string;    // "" / undefined when unknown
  website?: string;
  hours: StoreHours; // individual days may be "" when unknown
  verified: boolean;
  color: string;
}
