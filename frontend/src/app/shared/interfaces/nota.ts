import { Cliente } from "./cliente";
import { Expediente } from "./expediente";
import { Juzgado } from "./juzgado";

export interface Nota {
  id?: number;
  contenido: string | null;
  fecha: Date | null;
  // usuario omitido (depende de tu modelo User)
  cliente?: Cliente | null;
  juzgado?: Juzgado | null;
  expediente?: Expediente | null;
}