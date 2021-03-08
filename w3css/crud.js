import { Modelo } from "../modelo.js";


import './verW3.js';
import './tablaW3.js';
import './formularioW3.js';
//import '../materialize/FolderM.js';
import './paginadorW3.js';

const template = /*html*/`
    <div class="contenido"></div>
`;

class CrudW3 extends HTMLElement {
    constructor() {
        super();
        /**
         * @type {Modelo}
         */
        this.modelo = null;
        /**
         * Aciones que puede realizar en el formulario
         */
        this.acciones = {
            ver: true,
            editar: true,
            clonar: true,
            eliminar: true,
            agregar: true
        };
        /**
         * lista de campos visibles si no se especifica se toman todos
         */
        this.columnas = [];
        /**
         * lista de campos de formulario si no se especifica se toman todos.
         */
        this.camposFormulario = [];

        this.estadoTabla = null;

        this.onListar = null;
        this.onVer = null;
        this.onEditar = null;
        this.onAgregar = null;
        this.onEliminar = null;
    }

    setAcciones(acciones = {}) {
        Object.assign(this.acciones, acciones); 
    }
    /**
     * Setea tabla
     * @param {Modelo} modelo 
     */
    setModelo(modelo) {
        this.modelo = modelo;
        this.tema = this.getAttribute('tema');
        this.titulo = this.getAttribute('titulo');
        this.render();
        this.addTabla();
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
            <div class="w3-container">
                <h3 class="w3-theme w3-center"><b>${this.titulo}</b></h3>
            </div>
            ${template}            
        `;        
    }

    addTabla() {
        let contenido = this.shadowRoot.querySelector('.contenido');
        contenido.innerHTML = `
        <tabla-crud tema="${this.tema}" titulo="${this.titulo}"></tabla-crud>
        `;
        let tabla = contenido.querySelector('tabla-crud');
        tabla.setAcciones(this.acciones);        
        if (this.estadoTabla) {
            tabla.setEstado(this.estadoTabla);
        }
        tabla.setOnListar(this.onListar);
        tabla.carga(this.modelo);
        tabla.addEventListener('accion', ev=> {
            this.analizaEvento(ev);
        });
        tabla.addEventListener('estado', ev=> {
            this.estadoTabla = ev.detail.estado;
        });
    }
    addVer(info) {
        let contenido = this.shadowRoot.querySelector('.contenido');
        contenido.innerHTML = `
        <ver-dato-crud id="${info.id}" tema="${this.tema}"></ver-dato-crud>
        `;
        let ver = contenido.querySelector('ver-dato-crud');        
        ver.carga(this.modelo, this.onVer);
        ver.addEventListener('accion', ev=> {            
            this.analizaEvento(ev);
        });
    }
    addFormulario(info) {
        let contenido = this.shadowRoot.querySelector('.contenido');        
        let id = info.id ? `id="${info.id}"`: '';        
        contenido.innerHTML = `
        <formulario-crud tema="${this.tema}" ${id}></formulario-crud>
        `;        
        let ver = contenido.querySelector('formulario-crud');
        ver.carga(this.modelo, this.onVer, this.onEditar, this.onAgregar);
        ver.addEventListener('accion', ev=> {            
            this.analizaEvento(ev);
        });
    }
    /**
     * 
     * @param {CustomEvent} ev 
     */
    analizaEvento(ev) {
        let info = ev.detail;
        if (info.tipo == 'ver') {
            this.addVer(info);
        }
        if (info.tipo == 'tabla') {
            this.addTabla();
        }
        if (info.tipo == 'editar') {
            this.addFormulario(info);
        }
        if (info.tipo == 'nuevo') {
            this.addFormulario(info);
        }
    }

    setOnListar( onListar ){
        this.onListar = onListar;
    }

    setOnAgregar( onAgregar ){
        this.onAgregar = onAgregar;
    }

    setOnVer( onVer ){        
        this.onVer = onVer;
    }

    setOnEditar( onEditar ){
        this.onEditar = onEditar;
    }

    setOnEliminar( onEliminar ){
        this.onEliminar = onEliminar;
    }

}

customElements.define('crud-w3css', CrudW3);




