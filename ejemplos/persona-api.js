import '../boostrap/crudBo.js';
import '../w3css/crudW3.js';

import { Campo, CampoCatalogo, Modelo } from "../modelo.js";
import { peticionGet, peticionPost } from './peticiones.js';

/**
 * @type {CrudW3}
 */
let crud = document.querySelector('crud-w3css');

let modelo = new Modelo('Persona');
modelo.campos.push(new Campo({
    nombre: 'id_persona',
    etiqueta: 'Id', 
    tipo: 'number',
    reglas: 'disabled|no-visible'
}));
modelo.campos.push(new Campo({
    nombre: 'nombre', 
    etiqueta: 'Nombre', 
    tipo: 'text', 
    reglas: 'required|pattern="[a-zA-Z ]{4,}"',
    placeholder: 'Poner nombre'
}));
let campoSexo = new CampoCatalogo({
    nombre: 'sexo_id', 
    etiqueta: 'Sexo',   
    reglas: 'required',
    ancho: '12'      
});
modelo.campos.push(campoSexo);
modelo.setId('id_persona');


let url = 'http://localhost/saul/php/crud-php/index.php/';
let uri = 'persona/';
peticionGet(url+'sexo/list').then(json => {
    campoSexo.lista = [];
    for(let item of json.items) {        
        campoSexo.lista.push({valor: item.id_sexo, etiqueta: item.nombre, activo: item.activo});
    }
});
crud.setAcciones({eliminar:false});
crud.setOnListar((estado) => {     
    return new Promise( (resolve,reject) => {                
        let servicio = 'list/';
        let paginacion = `limit/${estado.limit}/offset/${estado.offset}/`;
        let orden = `campo/${estado.ordenar.campo}/orden/${estado.ordenar.orden}`;
        let api = url+uri+servicio+paginacion+orden;
        peticionGet(api).then(datos => {
            resolve({
                total:  datos.total,
                offset: datos.offset,
                limit: datos.limit,
                items: datos.items
            });
        });
        
    });
});

crud.setOnVer((id) => {    
    return new Promise( (resolve, reject) => {        
        let servicio = 'get/';
        let api = url+uri+servicio+'id/'+id;
        peticionGet(api)
        .then(json => {
            let item = json[0];
            Object.assign(item, {id_sexo: "1"});
            resolve(json[0]);
        });
    });
});

crud.setOnEditar( (id, datos) => {
    return new Promise( (resolve, reject) => {        
        let servicio = 'put/';
        let api = url+uri+servicio+'id/'+id;
        peticionPost(api,datos)
        .then(json => {            
            resolve(json);
        });
    });
});

crud.setOnAgregar( (datos) => {
    return new Promise( (resolve, reject) => {
        let servicio = 'post';
        let api = url+uri+servicio;
        peticionPost(api,datos)
        .then(json => {            
            resolve(json);
        });
    });
});

crud.setModelo(modelo);