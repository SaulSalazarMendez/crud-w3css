import { Modelo } from "../modelo.js";
import { Peticion } from "../request.js";

const template = /*html*/`
    <form class="w3-container">
        <div id="contenido"></div>
        <div help class="w3-row w3-padding"></div>
        <div class="w3-row w3-padding">
            <div class="w3-right">
                <a class="w3-btn w3-theme-l4" id="btn-cancelar">Cancelar</a>
                <button type="submit" class="w3-btn w3-theme-action w3-hover-theme">Guardar</button>
            </div>
        </div>        
    </form> 
`;

const style = /*css*/`
[entrada]:disabled {
    cursor: not-allowed;
    filter: invert(0.5);
}
[entrada]:invalid {
    background: rgba(255,0,0,0.5) !important;
}
`;


class FormularioW3 extends HTMLElement{
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
        <style>
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"); 
        </style>
            <link rel="stylesheet" href="http://localhost/saul/lib/css/w3.css">
            ${lib}
            <style>${style}</style>
            ${template}
        `;
        this.addListenerCancelar();
    }
    despachaEvento() {
        let evento = new CustomEvent('accion', {
            detail: {
                tipo: 'tabla',                
            }
        });
        this.dispatchEvent(evento);
    }

    addListenerCancelar() {
        let btn = this.shadowRoot.querySelector('#btn-cancelar');
        btn.addEventListener('click', ev => {
            this.despachaEvento();
        });
    }
    generaHelpCampos() {
        let help = this.shadowRoot.querySelector('[help]');
        for(let campo of this.modelo.campos) {
            help.innerHTML += `<label class="w3-tag w3-theme-dark w3-margin-top w3-round" id="error-${campo.nombre}" for="${campo.nombre}"></label><br>`;
        }
    }
    /**
     * 
     * @param {Modelo} modelo 
     */
    carga(modelo) {
        this.modelo = modelo;
        this.tema = this.getAttribute('tema');        
        this.render();
        this.generaHelpCampos();        
        /**
         * @type {HTMLFormElement}
         */
        let form = this.shadowRoot.querySelector('form');
        let contenido = form.querySelector('div');
        contenido.innerHTML = modelo.render();
        let entradas = contenido.querySelectorAll('[entrada]');   
        this.addEventsInputs(contenido, entradas);
        if (this.hasAttribute('id')) {            
            this.cargaDatos();
        }
        form.addEventListener('submit', ev => {
            ev.preventDefault();            
            this.guardaDatos(form);
            
        });
    }

    getData(form) {
        let campos = form.querySelectorAll('[entrada]');
        let data = {};
        for(let campo of campos) {
            data[campo.name] = campo.value;
        }
        return data;
    }
    /**
     * 
     * @param {HTMLFormElement} form 
     */
    guardaDatos(form) {
        let data = this.getData(form);
        let p = new Peticion();
        if (this.hasAttribute('id')) {
            p.edit(this.getAttribute('id'), data).then(re => {
                this.despachaEvento();
            });
        } else {
            p.post(data).then(re => {
                this.despachaEvento();
            });
        }
        
    }

    cargaDatos() {
        let p = new Peticion();
        p.get(this.getAttribute('id')).then(data => {
            this.setDatos(data);
        });
    }

    setDatos(data) {
        let entradas = this.shadowRoot.querySelectorAll('[entrada]');  
        for(let campo of entradas) {
            campo.value = data[campo.name];
            this.validaInput(campo);
        }
    }
    /**
     * 
     * @param {HTMLInputElement} input 
     */
    validaInput(input) {
        let help = this.shadowRoot.querySelector('#error-'+input.name);
        if (input.validity.valid) {
            help.innerHTML = ``
        } else {
            let label = this.shadowRoot.querySelector(`[for="${input.name}"]`).innerHTML;
            if (input.validity.patternMismatch) {
                if (input.hasAttribute('title')) {
                    help.innerHTML = `<i class="bi bi-x-circle"></i> ${label}: ${input.getAttribute('title')}<br>`;
                    return;
                }                
            }
            help.innerHTML = `<i class="bi bi-x-circle"></i>  ${label}: ${input.validationMessage}<br>`
        }
    }
    
    addEventsInputs(contenido, entradas) {
        for(let input of entradas) {
            input.addEventListener('invalid', ev => {         
                ev.preventDefault();
            });            
            input.addEventListener('input', ev => {        
                this.validaInput(input);
            });
            this.validaInput(input, contenido);   
        }        
    }
}

customElements.define('formulario-crud', FormularioW3);