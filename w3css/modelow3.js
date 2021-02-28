import { Campo } from "../modelo.js";

export class CampoW3CSS extends Campo {
    constructor(nombre, etiqueta='', tipo = 'text', rules= '', helptext = '') {
        super(nombre, etiqueta, tipo, rules, helptext);
    }

    getHelpText() {
        if (this.helptext) {
            return /*html*/`
            <div class="w3-tag w3-theme-dark">${this.helptext}</div>`
        }
        return '';
    }

    render() {
        return /*html*/`
        <div class="w3-col m4"> 
        <div class="w3-padding">
            <label for="${this.nombre}" class=""><b>${this.etiqueta}</b></label>
            <input type="${this.tipo}" id="${this.nombre}" name="${this.nombre}" ${this.getRules()} entrada class="w3-input w3-border w3-theme-l5">
            ${this.getHelpText()}
        </div>               
        </div>
        `;
    }
}