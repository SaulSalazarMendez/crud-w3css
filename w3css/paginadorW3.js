import { Modelo } from "../modelo.js";
import { Peticion } from "../request.js";

const template = /*html*/`
<div class="w3-bar w3-border">
    <a href="#" class="w3-button w3-text-theme w3-hover-theme" id="anterior">&#10094; Anterior</a>
    <a href="#" class="w3-button w3-right w3-text-theme w3-hover-theme" id="siguiente">Siguiente &#10095;</a>
</div>
`;

class PaginadorW3 extends HTMLElement{
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
            ${template}
        `;
        this.addEventos();
    }

    addEventos() {
        let sig = this.shadowRoot.querySelector('#siguiente');
        let ant = this.shadowRoot.querySelector('#anterior');
        sig.addEventListener('click', ev => {
            this.despachaEvento('siguiente');
        });
        ant.addEventListener('click', ev => {
            this.despachaEvento('anterior');
        })
    }

    despachaEvento(tipo) {
        let evento = new CustomEvent(tipo, {
            detail: {
                tipo: tipo
            }
        });
        this.dispatchEvent(evento);
    }

    connectedCallback(){
        this.tema = this.getAttribute('tema');
        this.render();
    }
}

customElements.define('paginador-w3', PaginadorW3);