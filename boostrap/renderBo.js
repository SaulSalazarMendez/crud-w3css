import { Campo, CampoCatalogo } from "../modelo.js";

/**
 * 
 * @param {Campo} campo 
 */
function getHelpText(campo) {
    if (campo.helptext) {
        return /*html*/`
        <div class="badge badge-info">${campo.helptext}</div>`
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
        return `<textarea rows="3" style="resize:none"  id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada class="form-control"></textarea>`;
    }
    if (campo instanceof CampoCatalogo) {
        return `
            <select class="form-control" id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada>
                ${renderOptions(campo)}
            </select>
        `;
    }
    return `<input type="${campo.tipo}" id="${campo.nombre}" name="${campo.nombre}" ${campo.getRules()} entrada class="form-control">`;
}
/**
 * 
 * @param {Campo} campo 
 */
export function renderBo(campo) {
    return /*html*/`
    <div class="col-sm-4" ${noVisible(campo)}> 
    <div class="form-group">
        <label for="${campo.nombre}" class=""><b>${campo.etiqueta}</b></label>
        ${renderInput(campo)}
        ${getHelpText(campo)}
    </div>               
    </div>
    `;
}