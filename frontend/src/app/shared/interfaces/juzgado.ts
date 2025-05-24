import { Direccion } from "./direccion";

export interface Juzgado {
  id?: number;
  nombre?: string | null;
  direccion?: Direccion | null;
  // expedientes y notas omitidos
}