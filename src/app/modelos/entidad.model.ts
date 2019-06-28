import { Departamento } from './departamento.model';
import { Municipio } from './municipio.model';
import { Pais } from './pais.model'
export class Entidad {
    constructor(public id_entidad: number,
                public nombre: string,
                public direccion: string,
                public telefono: number,
                public nit: number,
                public contacto_nombre: string,
                public contacto_cargo: string,
                public contacto_telefono: number,
                public contacto_email: string,
                public licencia: string,
                public orden: number,
                public usuarios: number,
                public sesionesconcurrentes: number,
                public funciones: string,
                public estado: string,
                public fk_municipio: Municipio,
                public fk_departamento: Departamento,
                public logo: string,
                public fk_pais: Pais, 
             ) { }
}