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
  lat: number;
  lng: number;
  phone: string;
  website?: string;
  hours: StoreHours;
  verified: boolean;
  color: string;
}
