
export interface CostaPayload {
  id?: number;              // solo si es edición
  estado: string;           //String porque es lo que angular envia
  fechaTC?: string;         // 'YYYY-MM-DD'
  fecha15TC?: string;       // 'YYYY-MM-DD'
  fechaDecreto?: string;    // 'YYYY-MM-DD'
  fecha20Decreto?: string;  // 'YYYY-MM-DD'
  importe: number;
  estadoCobro: string;
  expediente: {
    id?: number;            // solo si es edición de expediente anidado
    autos: string;
    cliente: { id: number } | null;
    procurador: { id: number } | null;
    juzgado: string | null;
    contrario: string | null;
    tipoProcedimiento: string | null;
  };
  notas: any[];             
}
