import { Entidad } from './entidad.model';
import { Tributo } from './tributo.model';
import { Usuario } from './usuario.model'

export class EntidadTributo {
    constructor(public id_ent_tributo : number,
                public identidad : Entidad,
                public idtributo: Tributo,
                public fechacreacion: Date,
                public idusuario: Usuario,
                public estado: string,
                public parametro_tributo: Float32Array,
                public fecha_inicio: Date,
                public fecha_final: Date
    ){}
}