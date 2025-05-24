import { Direccion } from "./direccion";

export interface Contrario {
  id?: number;
  nombre: string | null;
  nif?: string | null;
  direccion?: Direccion | null;
  // expedientes omitidos
}