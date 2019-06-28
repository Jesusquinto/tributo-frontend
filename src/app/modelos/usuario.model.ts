import { Municipio } from './municipio.model'
export class Usuario {
    constructor(public id_usuario: number,
                public tipo_identificacion: string,
                public identificacion: number,
                public nombre: number,
                public apellido: string,
                public razonsocial: string,
                public sexo: string,
                public fecha_nacimiento: Date,
                public direccion: string,
                public telefono: number,
                public celular: number,
                public email: string,
                public usuario: string,
                public tipousuario: string,
                //public esadministrador: number,
                public nombre_completo: string,

             /* public ultima_conexion: string,     <---- Lo inserta el backend
                public ultima_geoposicion: string,  <---- Lo inserta el backend
                public ultima_ip: string,           <---- Lo inserta el backend    
                public ultimo_so: string,           <---- Lo inserta el backend    
                public ultimo_navegador: string,    <---- Lo inserta el backend
                public ultimasesion: string,        <---- Lo inserta el backend
                public acceso_multiple: string,     <---- Lo inserta el backend
                public codigoreinicio: string,      <---- Lo inserta el backend
                public fechahorareinicio: string,   <---- Lo inserta el backend
                public fechacreacion: string,       <---- Lo inserta el backend*/

                public fk_municipio: Municipio,
                public tipocontribuyente: string,
                public estado: string,
                public url_imagen: string,

             ) { }
}