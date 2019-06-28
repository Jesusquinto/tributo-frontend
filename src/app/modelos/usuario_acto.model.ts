import { Usuario } from './usuario.model';
import { ActoEntidad } from './acto_entidad.model';
import { EntidadContratante } from './entidad_contratante.model';
export class UsuarioActo {
    constructor(public id_usuario_acto : number,
                public fk_usuario : Usuario,
                public fk_bfecha_crea: Date,
                public fk_acto_entidad: ActoEntidad,
                public fk_entidad_contratantes: EntidadContratante,
                public estado: string,
                public fecha_borrador: Date,
                public fecha_presentacion: Date,
                public fecha_liquidacion: Date,
                public fecha_pago: Date,
                public fecha_anulado: Date,
                public valor_apagar: number,
                public tipo_periodo: string,
                public numero_acto: number,
                public valor_acto: number,
                public fecha_inicio_acto: Date,
                public pdf_ruta: string,
                public datos_esquema: string,
                public descripcion: string,
                public selected: boolean = false
    ){}
}