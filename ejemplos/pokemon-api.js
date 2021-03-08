import '../w3css/crudW3.js';

import { Campo, Modelo } from "../modelo.js";
import { Peticion } from "../request.js";

let modelo = new Modelo('Pokemon');
modelo.campos.push(new Campo('id', 'Id', 'NUMBER' ));
modelo.campos.push(new Campo('name', 'Nombre', 'TEXT'));
let url = new Campo('url', 'Ruta', 'TEXT');
url.setInnerHtml(/*html*/`<img src="{url}" class="w3-image">`);
modelo.campos.push(url);
modelo.setId('id');


let crud = document.querySelector('crud-w3css');
crud.setAcciones({editar: false, eliminar:false});
crud.setOnListar((estado) => {    
    return new Promise( (resolve,reject) => {
        let p = new Peticion();
        p.list(
            estado.offset,
            estado.limit, 
            estado.ordenar).then(datos => {            
            resolve(datos);
        });
        
    });
});

crud.setOnVer((id) => {    
    return new Promise( (resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(data => {return data.json()})
            .then(json => {
            let url = json.sprites.other.dream_world.front_default
            if (url == null){
                url = json.sprites.other["official-artwork"].front_default;
            }
            resolve({
                id: json.id,
                name: json.name,
                url: url
            })
        });
    });
});

crud.setModelo(modelo);