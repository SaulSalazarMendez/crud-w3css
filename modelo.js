class ItemLista{
    constructor() {
        /**
         * @type {any}
         */
        this.valor = '';
        this.etiqueta = '';
        this.activo = 1;
    }
}
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
        /**
        * Validaciones html 5 del campo. Todas separados por |. Esta agregada la no-visible.
        * @example
        * reglas: 'required|pattern="[a-z]{4}"'
        */
        this.reglas = ''; 
        this.helptext = '';
        this.innerHtml = null;

        this.placeholder = '';
        /**
         * ancho en el grid, por defecto 4. 
         */
        this.ancho = '';
    }
}

const valorInicial = new InitCampo();

export class Campo{
    /**
     * 
     * @param {InitCampo} init 
     */   
    constructor(init = valorInicial) {
        /**
         * nombre del campo. 
         */
        this.nombre = '';
        /**
         * Etiqueta mostrada en el crud.
         */
        this.etiqueta = '';
        /**
         * Tipo de campo
         * @type {"text"|"number"|"date"|"time"|"textarea"}
         */
        this.tipo = '';
        /**
        * Validaciones html 5 del campo. Todas separados por |. Esta agregada la no-visible.
        * @example
        * reglas: 'required|pattern="[a-z]{4}"'
        */
        this.reglas = ''; 
        this.helptext = '';
        this.innerHtml = null;
        this.placeholder = '';
        /**
         * ancho en el grid, por defecto 4. 
         */
        this.ancho = '4';
        Object.assign(this, init);
    }
    /**
     * 
     * @param {string} codigo 
     */
    setInnerHtml(codigo) {
        this.innerHtml = codigo;
    }

    getReglas() {
        return this.reglas.split('|').join(' ');
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
        <input type="${this.tipo}" id="${this.nombre}" name="${this.nombre}" ${this.getReglas()} entrada><br>        
        `;
    }
}
class InitCampoCatalogo extends InitCampo{
    constructor(){
        super();
        /**
         * @type {[ItemLista]}
         */      
        this.lista = [];
    }
}

const valorInicialCatalogo = new InitCampoCatalogo();
export class CampoCatalogo extends Campo{
    constructor(init = valorInicialCatalogo) {
        super({});
        /**
         * @type {[ItemLista]}
         */        
        this.lista = [];
        Object.assign(this, init);
        this.tipo = 'select';
    }
    /**
     * id
     */
    getValor(valor) {
        let elemento = this.lista.find(item => item.valor == valor)
        return elemento;
    }
}

class CampoRelacion extends CampoCatalogo{    
    constructor(init) {
        super({});
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