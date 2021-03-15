import { CampoCatalogo, Campo, Modelo } from "../modelo.js";

const template = /*html*/`
    <div contenido class="container">
        <h5 class="btn btn-primary btn-sm" tipo=""><i class="bi bi-plus-circle"></i> Añadir <span id="titulo-add"></span></h5>        
        <table class="table table-bordered table-striped table-sm">        
        <thead><tr titulo>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Points</th>
        </tr>
        </thead>
        <tbody id="contenido-tabla">        
        </tbody>
        </table>        
    </div>
`;

const style = `
@import url('https://css.gg/chevron-down.css');
@import url('https://css.gg/chevron-up.css');
@import url('https://css.gg/bolt.css');
.hide {
    display: none;
}
`;



class TablaBo extends HTMLElement{
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
        let lib = 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.min.css';
        if (this.tema) {
            lib=`<link rel="stylesheet" href="https://bootswatch.com/4/${this.tema}/bootstrap.min.css">
            `
        }
        shadowRoot.innerHTML = /*html*/`
        <style>
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css");            
        </style>
            ${lib}                  
            <style>
            ${style}
            </style>
            ${template}
            <div class="container">
                <paginador-crud-bo tema="${this.tema}"></paginador-crud-bo>
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
        let pag = this.shadowRoot.querySelector('paginador-crud-bo');        
        pag.addEventListener('siguiente', ev => {
            this.paginaDatos(1);
        });
        pag.addEventListener('anterior', ev => {
            this.paginaDatos(-1);
        });
    }

    imprimePagina() {
        let pag = this.shadowRoot.querySelector('paginador-crud-bo');
        pag.setPagina(''+(this.estado.offset/this.estado.limit +1) + '/' + Math.ceil(this.estado.total/this.estado.limit) );
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
        this.imprimePagina();
    }

    addEventoNuevo() {
        let nuevo = this.shadowRoot.querySelector('h5');
        if (!this.acciones.agregar) {
            nuevo.remove();
            return;
        }
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
            this.imprimePagina();        
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
            out += /*html*/`<th titulo nombre="${campo.nombre}" ${this.validaNoVisible(campo)}>
            <span class="float-left">${campo.etiqueta}</span>
            <i id="icono" class="float-right gg-bolt"></i> </th>`;
        }
        out += '<th>Acciones</th>';
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
     * @param {CampoCatalogo} campo 
     */
    getValorLista(campo, val) {
        let elemento = campo.lista.find(item => item.valor == val);
        if (elemento) {
            return elemento.etiqueta;
        }
        return '';
    }
    /**
     * 
     * @param {Campo} campo 
     */
    validaNoVisible(campo) {        
        if (campo.getReglas().indexOf('no-visible')>=0){
            return 'class="hide"';
        }
        return '';
    }
    /**
     * 
     * @param {[string]} data 
     */
    renderDataColTabla(data) {
        let out = '';
        for(let campo of this.modelo.campos) {            
            if (campo instanceof CampoCatalogo) {
                out += `<td ${this.validaNoVisible(campo)}>${ this.getValorLista(campo, data[campo.nombre])}</td>`;
            } else {
                out += `<td ${this.validaNoVisible(campo)}>${ this.validaCadena(data[campo.nombre])}</td>`;                
            }
        }
        return out;
    }

    getAcciones(data) {
        let acciones = '';
        if (this.acciones.ver) {
            acciones = /*html*/`<a href="#" class="btn btn-info btn-sm" id="${data[this.modelo.id]}" tipo="ver">
            <i class="bi bi-search"></i> Ver</a> `;
        }
        if (this.acciones.editar) {
            acciones += /*html*/`<a href="#" class="btn btn-warning btn-sm" id="${data[this.modelo.id]}" tipo="editar">
            <i class="bi bi-pencil"></i> Editar</a> `;
        }
        if (this.acciones.eliminar) {
            acciones += /*html*/`<a href="#" class="btn btn-danger btn-sm" id="${data[this.modelo.id]}" tipo="eliminar">
            <i class="bi bi-trash"></i> Eliminar</a>`;
        }
        return acciones;
    }

    renderDataAcciones(data) {
        let out = /*html*/`<td>        
        ${this.getAcciones(data)}
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
        let btns = this.shadowRoot.querySelectorAll('.btn');        
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

customElements.define('tabla-crud-bo', TablaBo);