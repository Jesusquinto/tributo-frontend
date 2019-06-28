import { Acto } from './acto.model';
import { EntidadTributo } from './entidad_tributo.model'
export class ActoDetalle {
    constructor(public id_tipo_acto_detalle: number,
                public fk_tipo_acto: Acto,
                public fk_entidad_tributo: EntidadTributo,
             ) { }
}