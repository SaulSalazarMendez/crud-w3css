import './w3css/crud.js';

import { Modelo } from "./modelo.js";
import { CampoW3CSS } from "./w3css/modelow3.js";
import { Peticion } from "./request.js";
import { list } from './pokemons.js';

let modelo = new Modelo('Pokemon');
modelo.campos.push(new CampoW3CSS('id', 'Id', 'NUMBER', true ));
modelo.campos.push(new CampoW3CSS('name', 'Nombre', 'TEXT', true));
let url = new CampoW3CSS('url', 'Ruta', 'TEXT', false);
url.setInnerHtml(/*html*/`<img src="{url}" class="w3-image">`);
modelo.campos.push(url);
modelo.setId('id');


let crud = document.querySelector('crud-w3css');
crud.setAcciones({editar: false, eliminar:false});
crud.setModelo(modelo);
