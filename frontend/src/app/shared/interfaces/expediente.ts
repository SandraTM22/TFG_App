import { Cliente } from "./cliente";
import { Contrario } from "./contrario";
import { Costa } from "./costa";
import { Documento } from "./documento";
import { Juzgado } from "./juzgado";
import { Nota } from "./nota";
import { Procurador } from "./procurador";

export interface Expediente {
  id?: number;
  contrario?: Contrario | null;
  juzgado?: Juzgado | null;
  procurador?: Procurador | null;
  autos?: string | null;
  estado?: string | null;
  tipoProcedimiento?: string | null;
  restitucionEconomica?: string | null;
  fechaCreacion?: Date;
  descripcion?: string | null;
  cliente?: Cliente | null;
  notas?: Nota[];        // opcional, puedes definir mejor o usar any[]
  documentos?: Documento[];
  costas?: Costa[];     // si tienes la interfaz Costas importada
}