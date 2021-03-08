import '../w3css/crud.js';

import { Modelo } from "../modelo.js";
import { CampoW3CSS } from "../w3css/modelow3.js";

function peticionGet(url) {
    return fetch(url).then(data => {return data.json()});
}

function peticionPost(url, dato) {
    return fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "es-419,es;q=0.9",
            "content-type": "text/plain;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site"
        },
        "body": JSON.stringify(dato),
        "method": "POST",
        "mode": "cors",
    }).then(data => data.json());
}

let modelo = new Modelo('Test');
modelo.campos.push(new CampoW3CSS('tabla_id', 'Id', 'NUMBER', 'disabled'));
modelo.campos.push(new CampoW3CSS('log', 'Log', 'TEXT'));
modelo.setId('tabla_id');

/**
 * @type {CrudW3}
 */
let crud = document.querySelector('crud-w3css');
crud.setAcciones({eliminar:false});
crud.setOnListar((estado) => {     
    return new Promise( (resolve,reject) => {
        let url = 'http://localhost/saul/php/crud-php/index.php/';
        let uri = 'test/';
        let servicio = 'list/';
        let paginacion = `limit/${estado.limit}/offset/${estado.offset}/`;
        let orden = `campo/${estado.ordenar.campo}/orden/${estado.ordenar.orden}`;
        let api = url+uri+servicio+paginacion+orden;
        console.log(api);
        peticionGet(api).then(datos => {            
            resolve({
                count:  datos.total,
                offset: datos.offset,
                limit: datos.limit,
                items: datos.items
            });
        });
        
    });
});

crud.setOnVer((id) => {    
    return new Promise( (resolve, reject) => {
        peticionGet(`http://localhost/saul/php/crud-php/index.php/test/get/id/${id}`)            
        .then(json => {
            resolve(json[0]);
        });
    });
});

crud.setOnEditar( (id, datos) => {
    return new Promise( (resolve, reject) => {        
        peticionPost(`http://localhost/saul/php/crud-php/index.php/test/put/id/${id}`,datos)
        .then(json => {            
            resolve(json);
        });
    });
});

crud.setOnAgregar( (datos) => {
    return new Promise( (resolve, reject) => {        
        peticionPost(`http://localhost/saul/php/crud-php/index.php/test/post`,datos)
        .then(json => {            
            resolve(json);
        });
    });
});

crud.setOn

crud.setModelo(modelo);