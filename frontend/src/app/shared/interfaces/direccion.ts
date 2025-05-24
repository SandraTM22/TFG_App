export interface Direccion {
  id?: number;
  calle?: string | null;
  numero?: number | null;
  cp?: number | null;
  localidad?: string | null;
  provincia: string | null;
  pais: string | null;
}