import { Modelo } from "../modelo.js";
import { Peticion } from "../request.js";

const template = /*html*/`
    <div contenido></div>
`;

class VerBo extends HTMLElement{
    constructor() {
        super();        
    }    

    render() {
        let shadowRoot = this.attachShadow({mode:'open'});
        let lib = 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.min.css';
        if (this.tema) {
            lib=`<link rel="stylesheet" href="https://bootswatch.com/4/${this.tema}/bootstrap.min.css">
            `
        }
        shadowRoot.innerHTML = /*html*/`
                       
            ${lib} 
            
            <div class="container">
                <h3>Ver ${this.modelo.nombre}</h3>
                ${template}
            </div>
        `;
        /**
         * @type {function}
         */        
    }
    /**
     * 
     * @param {Modelo} modelo 
     */
    carga(modelo, onVer) {
        this.modelo = modelo;
        this.tema = this.getAttribute('tema');        
        this.render();
        this.id = this.getAttribute('id');        
        onVer(this.id).then(data => {
            this.loadDato(data);
        });
    }

    getDato(data, campo) {        
        if(campo.innerHtml) {
            let text = campo.innerHtml + '';
            let reg = new RegExp(`{${campo.nombre}}`, 'g');
            return text.replace(reg, data[campo.nombre]);
        }
        return data[campo.nombre];
    }

    loadDato(data) {
        let contenido = this.shadowRoot.querySelector('[contenido]');
        let out = '';
        for(let campo of this.modelo.campos) {
            out+= /*html*/`
                <label class=""><b>${campo.etiqueta}</b></label>
                <div class="border">${this.getDato(data, campo)}</div>                
            `;
        }
        out += `            
            <button class="btn btn-secondary float-right btn-sm" style="margin-top: 8px;">Cancelar</button>
        `;
        contenido.innerHTML = /*html*/`
            ${out}
        `;
        let btn = this.shadowRoot.querySelector('button');
        btn.addEventListener('click', ev => {
            this.despachaEventoSalir();
        });
    }

    despachaEventoSalir() {
        let evento = new CustomEvent('accion', {
            detail: {
                tipo: 'tabla'
            }
        });
        this.dispatchEvent(evento);
    }
}

customElements.define('ver-dato-crud-bo', VerBo);