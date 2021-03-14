import { Campo, CampoCatalogo } from "../modelo.js";

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
function noVisible(campo) {
    if (campo.getRules().indexOf('no-visible')>=0) {
        return 'no-visible';
    }
    return '';
}
/**
 * 
 * @param {CampoCatalogo} campo 
 */
function renderOptions(campo) {
    let options = '';    
    for(let opt of campo.lista) {
        let activo = '';
        if (opt.activo == 0) {
            activo = 'disabled';
        }
        options += `<option value="${opt.valor}" ${activo}>${opt.etiqueta}</option>`;        
    }
    return options;
}
/**
 * 
 * @param {Campo} campo 
 */
function renderInput(campo) {
    if (campo.tipo == 'textarea') {
        return `<textarea class="w3-input w3-border" style="resize:none"  id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada></textarea>`;
    }
    if (campo instanceof CampoCatalogo) {
        return `
            <select class="w3-select w3-border" id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada>
                ${renderOptions(campo)}
            </select>
        `;
    }
    return `<input type="${campo.tipo}" id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada class="w3-input w3-border w3-theme-l5">`;
}
/**
 * 
 * @param {Campo} campo 
 */
export function renderW3(campo) {
    return /*html*/`
    <div class="w3-col m4" ${noVisible(campo)}> 
    <div class="w3-padding">
        <label for="${campo.nombre}" class=""><b>${campo.etiqueta}</b></label>
        ${renderInput(campo)}        
        ${getHelpText(campo)}
    </div>               
    </div>
    `;
}