import { clonar } from "./json.js";
import { list } from "./pokemons.js";

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

    list(offset = 0, limit = 10, ordenar = {campo: 'none', orden: 'none'}) {
        return new Promise((resolve,reject) => {
            resolve( list(offset, limit, ordenar));
        });
    }

    get(id) {
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