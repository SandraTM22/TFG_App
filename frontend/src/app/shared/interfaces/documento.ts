export interface Documento {
  id?: number;
  nombre: string;
  tipo: string;
  ruta: string;
  fechaSubida: Date | null;
  // expediente omitido para evitar recursividad
}