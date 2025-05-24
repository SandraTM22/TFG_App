import { EstadoCobro } from "./enum/estado-cobro.enum";
import { EstadoCostas } from "./enum/estado-costas.enum";
import { Expediente } from "./expediente";

export interface Costa {
  id?: number;
  estado: EstadoCostas;
  fechaTC?: string;        // ISO string fecha, por ejemplo: '2023-05-24'
  fecha15TC?: string;
  fechaDecreto?: string;
  fecha20Decreto?: string;
  importe?: number;
  estadoCobro: EstadoCobro;
  expediente?: Expediente | null;
}