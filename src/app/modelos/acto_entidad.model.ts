import { Acto } from './acto.model';
import { Entidad } from './entidad.model';
export class ActoEntidad {
    constructor(public id_acto_entidad : number,
                public fk_bc_acto : Acto,
                public fk_bc_entidad: Entidad,
                public codigo: number,
                public esquema: string,
                public tipoperiodo: string
    ){}
}