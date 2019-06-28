import { Departamento } from './departamento.model'
export class Municipio {
    constructor(public id_municipio: number,
                public codigociudad: number,
                public nombre: string,
                public codigoref: string,
                public iddepartamento: Departamento,
                public idpais: string
             ) { }
}