import { Entidad } from './entidad.model';
import { Contratante } from './contratante.model'
export class EntidadContratante {
    constructor(public id_entidad_contratantes: number,
                public fk_entidad: Entidad,
                public fk_contratante: Contratante,
             ) { }
}