import { clonar } from "./json.js";

let id = 2;

let arrDatos = [{
    id: 1,
    nombre: 'Juan',
    paterno: 'Perez',
    materno: 'Morales',
    folio: '1234'
}];

export class Peticion{
    post(data) {
        return new Promise((resolve,reject) => {
            let respuesta = clonar(data);
            respuesta.id = id++;
            arrDatos.push(respuesta);
            resolve( clonar(respuesta) );
        });
    }

    list() {
        return new Promise((resolve,reject) => {
            resolve( clonar(arrDatos));
        });
    }

    get(id) {
        return new Promise((resolve,reject) => {
            for(let d of arrDatos) {
                if (d.id == id) {
                    resolve(clonar(d));                    
                }
            }
            resolve(d);
        });
    }

    edit(id, data) {
        return new Promise((resolve,reject) => {
            for(let d of arrDatos) {
                if (d.id == id) {
                    Object.assign(d, data);
                    resolve( clonar(d))               
                }
            }
            resolve(null);
        });
    }

    delete(id) {
        return new Promise((resolve,reject) => {
            let i=0;
            for(let d of arrDatos) {
                if (d.id == id) {
                    arrDatos.splice(i,1);
                    resolve(true);
                }
                i++;
            }
            resolve(false);
        });
    }
}