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
  games: string[];
  tables: number;
  paintBrands: string[];
  hours: string;
  verified: boolean;
  color: string;
  emoji: string;
}
