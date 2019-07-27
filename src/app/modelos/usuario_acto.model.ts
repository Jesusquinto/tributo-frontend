import { Usuario } from './usuario.model';
import { ActoEntidad } from './acto_entidad.model';
import { EntidadContratante } from './entidad_contratante.model';
export class UsuarioActo {
    constructor(public idUsuarioActo : number,
                public fkUsuario : Usuario,
                public fkFechaCrea: Date,
                public fkActoEntidad: ActoEntidad,
                public fkEntidadContratantes: EntidadContratante,
                public estado: string,
                public fechaBorrador: Date,
                public fechaPresentacion: Date,
                public fechaLiquidacion: Date,
                public fechaPago: Date,
                public fechaAnulado: Date,
                public valorApagar: number,
                public tipoPeriodo: string,
                public numeroActo: number,
                public valorActo: number,
                public fechaInicioActo: Date,
                public pdfRuta: string,
                public datosEsquema: string,
                public descripcion: string,
                public selected: boolean = false
    ){}
}