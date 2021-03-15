import { CampoCatalogo, Modelo } from "../modelo.js";
import { Peticion } from "../request.js";

const template = /*html*/`
    <div contenido class="w3-container"></div>
`;

class VerW3 extends HTMLElement{
    constructor() {
        super();        
    }    

    render() {
        let shadowRoot = this.attachShadow({mode:'open'});
        let lib = '';
        if (this.tema) {
            lib=`<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-${this.tema}.css">
            `
        }
        shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="http://localhost/saul/lib/css/w3.css">            
            ${lib}  
            <h3 class="w3-container w3-text-theme">Ver ${this.modelo.nombre}</h3>                  
            ${template}
        `;
        /**
         * @type {function}
         */        
    }
    /**
     * 
     * @param {CampoCatalogo} campo 
     */
    getValorLista(campo, val) {
        let elemento = campo.lista.find(item => item.valor == val);
        if (elemento) {
            return elemento.etiqueta;
        }
        return '';
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
        if (campo instanceof CampoCatalogo) {
            return this.getValorLista(campo, data[campo.nombre]);
        }
        return data[campo.nombre];
    }

    validaNoVisible(campo) {        
        if (campo.getReglas().indexOf('no-visible')>=0){
            return true;
        }
        return false;
    }

    loadDato(data) {
        let contenido = this.shadowRoot.querySelector('[contenido]');
        let out = '<div clasS="w3-row">';
        for(let campo of this.modelo.campos) {
            if (!this.validaNoVisible(campo)){
                out+= /*html*/`
                    <div class="w3-col m${campo.ancho}">
                    <label class=""><b>${campo.etiqueta}</b></label>
                    <div class="w3-border">${this.getDato(data, campo)}</div>                
                    </div>
                `;
            }
        }
        out += `
            <div class="w3-col m12">
                <button class="w3-btn w3-theme-action w3-margin-top w3-right">Cancelar</button>
            </div>
            </div>
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

customElements.define('ver-dato-crud', VerW3);