import { EstadoCobro } from "./enum/estado-cobro.enum";
import { EstadoCostas } from "./enum/estado-costas.enum";
import { Expediente } from "./expediente";
import { Nota } from "./nota";

export interface Costa {
  id?: number;
  estado: EstadoCostas;
  fechaTC?: string;  
  fecha15TC?: string;
  fechaDecreto?: string;
  fecha20Decreto?: string;
  importe?: number;
  estadoCobro: EstadoCobro;
  expediente?: Expediente | null;
  notas : Nota[]
}