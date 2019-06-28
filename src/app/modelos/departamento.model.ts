import { Pais } from './pais.model'
export class Departamento {
    constructor(public id_departamento: number, 
                public nombre: string,
                public codigoref: string,
                public idpais: Pais
             ) { }
}