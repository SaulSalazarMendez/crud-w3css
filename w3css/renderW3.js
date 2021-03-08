import { Campo } from "../modelo.js";

/**
 * 
 * @param {Campo} campo 
 */
function getHelpText(campo) {
    if (campo.helptext) {
        return /*html*/`
        <div class="w3-tag w3-theme-dark">${campo.helptext}</div>`
    }
    return '';
}
/**
 * 
 * @param {Campo} campo 
 */
export function renderW3(campo) {
    return /*html*/`
    <div class="w3-col m4"> 
    <div class="w3-padding">
        <label for="${campo.nombre}" class=""><b>${campo.etiqueta}</b></label>
        <input type="${campo.tipo}" id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada class="w3-input w3-border w3-theme-l5">
        ${getHelpText(campo)}
    </div>               
    </div>
    `;
}