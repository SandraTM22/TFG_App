import { Direccion } from "./direccion";

export interface Procurador {
  id?: number;
  nombre: string | null;
  apellido1: string | null;
  apellido2: string | null;
  colegio: string | null;
  numeroColegiado: number | null;
  direccion: Direccion | null;
  // expedientes omitidos
}