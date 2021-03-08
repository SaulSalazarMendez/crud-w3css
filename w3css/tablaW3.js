import { Modelo } from "../modelo.js";

const template = /*html*/`
    <div contenido class="w3-container">
        <h5 class="w3-button w3-theme-action w3-hover-theme" tipo=""><i class="bi bi-plus-circle"></i> Añadir <span id="titulo-add"></span></h5>        
        <table class="w3-table-all w3-hoverable">        
        <tbody><tr class="w3-text-theme" titulo>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Points</th>
        </tr>
        </tbody>
        <tbody id="contenido-tabla">        
        </tbody>
        </table>        
    </div>
`;

const style = `
@import url('https://css.gg/chevron-down.css');
@import url('https://css.gg/chevron-up.css');
@import url('https://css.gg/bolt.css');
`;



class TablaW3 extends HTMLElement{
    constructor() {
        super();
        this.acciones = {
            ver: true,
            editar: true,
            clonar: true,
            eliminar: true,
            agregar: true
        };

        this.estado = {
            offset: 0,
            limit: 10,
            total: 0,
            ordenar: {
                campo: 'none',
                orden: 'none'
            }
        }
        /**
         * @type {function(): Promise<any>}
         */
        this.onListar = null;        
    }

    setEstado(estado) {
        this.estado = estado;
    }
    
    setAcciones(acciones = {}) {
        Object.assign(this.acciones, acciones); 
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
            <style>
            ${style}
            </style>
            ${template}
            <div class="w3-container">
                <paginador-w3 tema="${this.tema}"></paginador-w3>
            </div>     
        `;
    }

    setOnListar(onListar) {
        this.onListar = onListar;
    }
    /**
     * 
     * @param {Modelo} modelo 
     */
    carga(modelo) {
        this.modelo = modelo;
        this.tema = this.getAttribute('tema');
        this.titulo = this.getAttribute('titulo');    
        this.render();
        this.tituloAdd = this.shadowRoot.querySelector('#titulo-add');
        this.tituloAdd.innerHTML = this.titulo;  
        this.cargaTitulos();    
        this.cargarDatos();
        this.addEventoNuevo();
        this.addEventosPaginador();
    }

    addEventosPaginador() {
        let pag = this.shadowRoot.querySelector('paginador-w3');
        pag.addEventListener('siguiente', ev => {
            this.paginaDatos(1);
        });
        pag.addEventListener('anterior', ev => {
            this.paginaDatos(-1);
        });
    }

    paginaDatos(inc) {        
        let offset = this.estado.offset + inc*this.estado.limit;
        let dif = this.estado.total - offset;
        if (dif >=0) {
            this.estado.offset = offset;
        }
        if (this.estado.offset < 0 ) {
            this.estado.offset = 0;
        }
        this.despachaEventoEstado();
        this.cargarDatos();
        let pag = this.shadowRoot.querySelector('paginador-w3');
        pag.setPagina(this.estado.offset/this.estado.limit +1);
    }

    addEventoNuevo() {
        let nuevo = this.shadowRoot.querySelector('h5');
        nuevo.addEventListener('click', ev=>{
            let evento = new CustomEvent('accion', {
                detail: {
                    tipo: 'nuevo',                    
                }
            });
            this.dispatchEvent(evento);
        });
    }
    /**
     * 
     * @param {NodeListOf<HTMLElement>} titulos
     */
    removerTitulos(titulos) {
        for(let item of titulos) {
            let icono = item.querySelector('#icono');
            icono.classList.remove('gg-chevron-up');
            icono.classList.remove('gg-chevron-down');
            icono.classList.add('gg-bolt');
        }
    }    
    cargarDatos() {        
        this.onListar(this.estado).then( data => {
            this.loadDatos(data);
            this.estado.total = data.total;
        });
    }
    /**
     * 
     * @param {HTMLElement} titulo 
     */
    addEventosTitulos(titulo) {
        let titulos = titulo.querySelectorAll('[titulo]');
        for(let item of titulos) {     
            item.addEventListener('click', ev=> {
                let icono = item.querySelector('#icono');
                let campo = item.getAttribute('nombre');
                let clase = 'gg-chevron-up';
                let orden = 'desc';
                if (icono.classList.contains('gg-chevron-up')) {
                    clase = 'gg-chevron-down'
                    orden = 'asc';
                } else if (icono.classList.contains('gg-chevron-down')) {
                    clase = 'gg-bolt';
                    orden = 'none';
                    campo = 'none';
                }
                this.removerTitulos(titulos);
                icono.classList.remove('gg-bolt');
                icono.classList.add(clase);
                this.estado.ordenar = {orden: orden, campo: campo};
                this.despachaEventoEstado();
                this.cargarDatos();
            });              
        }
        //'gg-chevron-down'
    }

    cargaTitulos() {
        let titulo = this.shadowRoot.querySelector('[titulo]');
        let out = '';
        for(let campo of this.modelo.campos) {
            out += /*html*/`<th class="w3-hover-theme" titulo nombre="${campo.nombre}">${campo.etiqueta} <i id="icono" class="w3-right gg-bolt"></i> </th>`;
        }
        out += '<th class="w3-hover-theme">Acciones</th>';
        titulo.innerHTML = out;
        this.addEventosTitulos(titulo);
    }

    validaCadena(cadena) {
        if (cadena == undefined) {
            return '';
        }
        return cadena;
    }

    /**
     * 
     * @param {[string]} data 
     */
    renderDataColTabla(data) {
        let out = '';
        for(let campo of this.modelo.campos) {
            out += `<td>${ this.validaCadena(data[campo.nombre])}</td>`;
        }
        return out;
    }

    getAcciones(data) {
        let acciones = '';
        if (this.acciones.ver) {
            acciones = /*html*/`<a href="#" class="w3-bar-item w3-button w3-hover-theme" id="${data[this.modelo.id]}" tipo="ver">
            <i class="bi bi-search"></i> Ver</a>`;
        }
        if (this.acciones.editar) {
            acciones += /*html*/`<a href="#" class="w3-bar-item w3-button w3-hover-theme" id="${data[this.modelo.id]}" tipo="editar">
            <i class="bi bi-pencil"></i> Editar</a> `;
        }
        if (this.acciones.eliminar) {
            acciones += /*html*/`<a href="#" class="w3-bar-item w3-button w3-hover-theme" id="${data[this.modelo.id]}" tipo="eliminar">
            <i class="bi bi-trash"></i> Eliminar</a>`;
        }
        return acciones;
    }

    renderDataAcciones(data) {
        let out = /*html*/`<td>
        <div class="w3-dropdown-hover">
        <button class="w3-button w3-theme-action w3-hover-theme"><i class="bi bi-gear-fill"></i></button>
        <div class="w3-dropdown-content w3-bar-block w3-card-4">
        ${this.getAcciones(data)}        
        </div>
        </div>
        </td>
        `;
        
        return out;
    }

    loadDatos(datos) {
        let contenidoTabla = this.shadowRoot.querySelector('#contenido-tabla');
        let datatable = '';
        for(let data of datos.items) {    
            datatable += /*html*/`
            <tr>
                ${this.renderDataColTabla(data)}
                ${this.renderDataAcciones(data)}
            </tr>
            `;    
        }        
        contenidoTabla.innerHTML = datatable;
        let btns = this.shadowRoot.querySelectorAll('.w3-button');
        this.addEventos(btns);
    }
    /**
     * 
     * @param {[HTMLElement]} btns 
     */
    addEventos(btns) {
        for(let btn of btns) {
            btn.addEventListener('click', ev=> {
                this.despachaEvento(btn);
            });
        }
    }
    /**
     * 
     * @param {HTMLElement} item 
     */
    despachaEvento(item) {
        let evento = new CustomEvent('accion', {
            detail: {
                tipo: item.getAttribute('tipo'),
                id: item.getAttribute('id')
            }
        });
        this.dispatchEvent(evento);
    }

    /**
     * 
     * @param {HTMLElement} item 
     */
    despachaEventoEstado() {
        let evento = new CustomEvent('estado', {
            detail: {
                estado: this.estado
            }
        });
        this.dispatchEvent(evento);
    }
}

customElements.define('tabla-crud', TablaW3);