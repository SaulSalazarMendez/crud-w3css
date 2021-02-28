import './w3css/crud.js';

import { Modelo } from "./modelo.js";
import { CampoW3CSS } from "./w3css/modelow3.js";
import { Peticion } from "./request.js";

let modelo = new Modelo();
modelo.campos.push(new CampoW3CSS('id', 'Id', 'NUMBER', 'disabled'));
modelo.campos.push(new CampoW3CSS('nombre', 'Nombre', 'TEXT', 'required|pattern="[a-zA-Z ñÑ]{3,}"|title="Se requiere 3 o más caracteres[a-z] "'));
modelo.campos.push(new CampoW3CSS('paterno', 'Apellido paterno', 'TEXT', 'required|minlength="5"'));
modelo.campos.push(new CampoW3CSS('materno', 'Apellido materno', 'TEXT', 'required|minlength="5"'));
modelo.campos.push(new CampoW3CSS('folio', 'Folio', 'TEXT', 'required|pattern="[0-9]{5}"|title="Da 5 números"'));
modelo.setId('id');


let p = new Peticion();

p.post({
    nombre: 'Perro',
    paterno: 'Yolo',
    materno: 'lolo',
    folio: '14256'
});

let crud = document.querySelector('crud-w3css');
crud.setModelo(modelo);
