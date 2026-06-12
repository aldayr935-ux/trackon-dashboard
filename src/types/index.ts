export type ViewId = "resumen" | "flota" | "envios" | "rutas" | "alertas";

export type VehicleStatus =
  | "en-ruta"
  | "disponible"
  | "mantenimiento"
  | "cargando";
export type ShipmentStatus = "en-ruta" | "demorado" | "cargando" | "entregado";
export type RouteEfficiency = "alta" | "media" | "baja";
export type AlertSeverity = "critica" | "media" | "informativa";

export interface Vehicle {
  id: string;
  model: string;
  year: number;
  status: VehicleStatus;
  driver: string | null;
  cargo: number | null;
  kmToday: number;
  fuel: number;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  driver: string;
  vehicleId: string;
  cargo: number | null;
  status: ShipmentStatus;
  eta: string;
}

export interface Route {
  name: string;
  distance: number;
  avgTime: number;
  punctuality: number;
  efficiency: RouteEfficiency;
}

export interface Alert {
  id: string;
  message: string;
  time: string;
  severity: AlertSeverity;
  icon: string;
}

export interface KPI {
  label: string;
  value: number | string;
  sub: string;
  trend: "up" | "down" | "neutral";
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
