export class Campo{
    /**
     * 
     * @param {string} nombre 
     * @param {string} etiqueta 
     * @param {string} tipo 
     * @param {string} rules 
     * @param {string} helptext 
     */
    constructor(nombre, etiqueta='', tipo = 'text', rules= '', helptext = '') {        
        this.nombre = nombre;
        this.etiqueta = etiqueta
        this.tipo = tipo;
        this.rules = rules; 
        this.helptext = helptext;
        this.innerHtml = null;
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

class Catalogo{
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

    render() {
        let out = '';
        for(let campo of this.campos) {
            out += campo.render();
        }
        return out;
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