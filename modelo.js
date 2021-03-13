class InitCampo{
    constructor(){
        /**
         * Nombre del campo en el modelo
         */
        this.nombre = '';
        /**
         * Etiqueta mostrada
         */
        this.etiqueta = '';
        /**
         * Tipo de campo
         * @type {"text"|"number"|"date"|"time"|"textarea"}
         */
        this.tipo = '';
        this.rules = ''; 
        this.helptext = '';
        this.innerHtml = null;
    }
}

const valorInicial = new InitCampo();

export class Campo{
    /**
     * 
     * @param {InitCampo} init 
     */   
    constructor(init = valorInicial) {
        this.nombre = '';
        this.etiqueta = '';
        this.tipo = '';
        this.rules = ''; 
        this.helptext = '';
        this.innerHtml = null;        
        Object.assign(this, init);
    }
    /**
     * 
     * @param {string} codigo 
     */
    setInnerHtml(codigo) {
        this.innerHtml = codigo;
    }

    getRules() {
        return this.rules.split('|').join(' ');
    }

    getHelpText() {
        if (this.helptext) {
            return /*html*/`<div>${this.helptext}</div>`
        }
        return '';
    }

    render() {
        return /*html*/`
        <label for="${this.nombre}"><b>${this.etiqueta}</b></label><br>
        <input type="${this.tipo}" id="${this.nombre}" name="${this.nombre}" ${this.getRules()} entrada><br>        
        `;
    }
}

class CampoCatalogo extends Campo{
    constructor(catalogo, id) {
        this.id = id;
        this.catalogo = catalogo;
        this.lista = [];
    }
    /**
     * 
     */
    load() {

    }
    /**
     * id
     */
    getValor(campo) {
        let id = this.id;
        let elemento = this.lista.find(item => {
            return item[id] == campo;
        });
        return elemento;
    }
}

class Relacion {
    /**
     * 
     * @param {string} campo 
     * @param {Catalogo} catalogo
     * @param {string} campoDeModelo 
     */
    constructor(campo, catalogo, campoDeCatalogo) {
        this.campo = campo;
        this.catalogo = catalogo;
        this.campoDeCatalogo = campoDeCatalogo;
    }

    getValor() {
        return this.catalogo.getValor(campo)[this.campoDeCatalogo];
    }
}

export class Modelo {
    /**
     * 
     * @param {string} nombre 
     */
    constructor(nombre) {
        this.nombre = nombre;
        /**
         * @type {[Campo]}
         */
        this.campos = [];
        this.id = null;
        /**
         * @type {[Relacion]}
         */
        this.relaciones = [];
    }
    /**
     * 
     * @param {string} id 
     */
    setId(id) {
        this.id = id;
    }
    /**
     * 
     * @param {string} campo 
     */
    getCampo(campo, data) {

    }
}