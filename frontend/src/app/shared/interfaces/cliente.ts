import { Direccion } from "./direccion";

export interface Cliente {
  id?: number;
  nombre: string | null;
  apellido1: string | null;
  apellido2: string | null;
  dni?: string | null;
  direccion?: Direccion | null;
  referencia?: string | null;
  fechaCreacion: Date;
  // notas, expedientes omitidos para simplificar (puedes añadir si quieres)
}