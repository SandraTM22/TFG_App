import { Cliente } from "./cliente";
import { Expediente } from "./expediente";
import { Juzgado } from "./juzgado";
import { User } from "./user";

export interface Nota {
  id?: number;
  contenido: string | null;
  fecha: Date | null;
  usuario: User;
  cliente?: Cliente | null;
  juzgado?: Juzgado | null;
  expediente?: Expediente | null;
}