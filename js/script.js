/* Clave del LocalStorage */
const STORAGE_KEY = "tasquesKanban";

/* Array donde estarán las tareas */

let tasques = [];

/* Función para cargar las tareas */
function carregarTasques() {
    const tasquesGuardades = localStorage.getItem(STORAGE_KEY);

    if (tasquesGuardades) {
        tasques = JSON.parse(tasquesGuardades);
        if (tasques.length > 0) {
            return true
        }
    } else {
        tasques = []
        return false
    }
}

/* Función para guardar tareas */

function guardarTasques() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasques))
}

/* Función para crear una tarea */
function crearTasca(titol, descripcio, prioritat, dataVenciment,estat = "perFer") {
    return {
        id: crypto.randomUUID(),
        titol: titol,
        descripcio: descripcio,
        prioritat: prioritat,
        dataVenciment: dataVenciment,
        estat: estat,
        creatEl: new Date().toISOString()
    }
}
/* Función que crea una Tarea si no hay ninguna creada */
function crearTareaPrueba() {
    const tascaProva = crearTasca("Prueba", "Prueba para comprobar localStorage", "mitjana", "2026-05-20");

    tasques.push(tascaProva);
    guardarTasques();
}



/* elementos del DOM con los que trabajaremos para el formulario */

const formulariTasca = document.getElementById("formulari-tasca");
const idTasca = document.getElementById("tasca-id")
const tascaTitol = document.getElementById("titol")
const tascaDescripcio = document.getElementById("descripcio")
const tascaPrioritat = document.getElementById("prioritat")
const tascaDataVenciment = document.getElementById("data-venciment")
const botonGuardar = document.getElementById("btn-guardar")
const columnaPerfer = document.getElementById("tasques-perFer");
const columnaEncurs = document.getElementById("tasques-enCurs");
const columnaFet = document.getElementById("tasques-fet");

/* Elementos del DOM que utilizaremos para el filtro, búsqueda y estadísticas */

const filtreEstat = document.getElementById("filtre-estat");
const filtrePrioritat = document.getElementById("filtre-prioritat");
const inputCerca = document.getElementById("cerca");

const totalTasques = document.getElementById("total-tasques");
const totalPerFer = document.getElementById("total-per-fer");
const totalEnCurs = document.getElementById("total-en-curs");
const totalFet = document.getElementById("total-fet");
const percentatgeFet = document.getElementById("percentatge-fet");

/* Función para Filtrar */

function getTasquesFiltrades(tasques, filtres) {
    return tasques.filter(tasca => {
        const coincideixEstat = filtres.estat === "tots" || tasca.estat === filtres.estat;
        const coincideixPrioritat = filtres.prioritat === "totes" || tasca.prioritat === filtres.prioritat;
        const coincideixCerca = tasca.titol.toLowerCase().includes(filtres.cerca) || tasca.descripcio.toLowerCase().includes(filtres.cerca);
        
        return coincideixEstat && coincideixPrioritat && coincideixCerca;
    });
};

/* Función que gestiona el Formulario para añadir o editar una tarea */

function gestionarFormulari(event) {
    event.preventDefault();

    const titol = tascaTitol.value.trim();
    const descripcio = tascaDescripcio.value.trim();
    const prioritat = tascaPrioritat.value;
    const dataVenciment = tascaDataVenciment.value;

    if (titol === "") {
        alert("El titol és obligatori");
        return
    } 
    if (idTasca.value) {
        const tasca = tasques.find( tasca => tasca.id === idTasca.value);
        tasca.titol = titol;
        tasca.descripcio = descripcio;
        tasca.prioritat = prioritat;
        tasca.dataVenciment = dataVenciment;
        botonGuardar.textContent = "Afegir Tasca";
    } else {
        const novaTasca = crearTasca(titol, descripcio, prioritat, dataVenciment);
        tasques.push(novaTasca);
    }
    guardarTasques();
    idTasca.value = "";
    formulariTasca.reset();
    renderTauler();
}
formulariTasca.addEventListener("submit", gestionarFormulari);
/* Función que elimina una tarea */
function eliminarTasca(tasca){
    const confirmar = confirm("Segur que vol eliminar aquesta tasca?")
    if (!confirmar) {
        return
    } else {
        tasques = tasques.filter(tascaActual => tascaActual.id !== tasca.id);
        formulariTasca.reset();
        idTasca.value = "";
        botonGuardar.textContent = "Afegir tasca";
        guardarTasques();
        renderTauler();
    }
}
/* Función que crea una targeta para añadirla al HTML */

function crearTargetaTasca(tasca) {
    const targeta = document.createElement("article");
    targeta.classList.add("targeta-tasca");

    const tascaTitol = document.createElement("h4");
    tascaTitol.classList.add("titol-tasca");
    tascaTitol.textContent = tasca.titol;
    
    const tascaDescripcio = document.createElement("p");
    tascaDescripcio.textContent = tasca.descripcio;
    
    const dataTasca = document.createElement("p");
    dataTasca.textContent = tasca.dataVenciment;
    /* Botón editar y su función al clicar */
    const botoEditar = document.createElement("button");
    botoEditar.textContent = "Editar tasca";
    botoEditar.classList.add("boto-editar");
    botoEditar.addEventListener("click", function() {
        botonGuardar.textContent = "Guardar canvis";
        omplirFormulari(tasca);
    })
    /* Botón eliminar y su función al clicar */
    const botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar tasca";
    botoEliminar.classList.add("boto-eliminar");
    botoEliminar.addEventListener("click", function() {
            eliminarTasca(tasca)
    })
    
    /* Select para cambiar el estado de la tasca */
    const labelEstat = document.createElement("label");
    labelEstat.textContent ="Estat"
    
    const tascaEstat = document.createElement("select");
    const estatPerFer = document.createElement("option");
    estatPerFer.value = "perFer";
    estatPerFer.textContent = "Per fer"
    
    const estatEnCurs = document.createElement("option");
    estatEnCurs.value= "enCurs";
    estatEnCurs.textContent = "En curs";
    
    const estatFet = document.createElement("option");
    estatFet.value = "fet";
    estatFet.textContent ="Fet";
    
    tascaEstat.addEventListener("change", function() {
    tasca.estat = tascaEstat.value;
    guardarTasques();
    renderTauler();
    });

    const tascaPrioritat = document.createElement("p");
    tascaPrioritat.textContent = "Prioritat: " + tasca.prioritat;
    if (tasca.prioritat === "alta") {
        targeta.classList.add("prioritat-alta");
    } else if ( tasca.prioritat === "mitjana") {
        targeta.classList.add("prioritat-mitjana");
    } else {
        targeta.classList.add("prioritat-baixa");
    }
    /* agregar los elementos a la targeta */
    targeta.appendChild(tascaTitol);
    targeta.appendChild(tascaDescripcio);
    targeta.appendChild(dataTasca);
    targeta.appendChild(tascaPrioritat);
    targeta.appendChild(labelEstat)
    tascaEstat.appendChild(estatPerFer)
    tascaEstat.appendChild(estatEnCurs)
    tascaEstat.appendChild(estatFet)
    tascaEstat.value = tasca.estat;
    targeta.appendChild(tascaEstat)
    targeta.appendChild(botoEditar)
    targeta.appendChild(botoEliminar)
    return targeta;

}
/* Función que rellana el formulario para editarlo */ 

function omplirFormulari(tasca) {
    idTasca.value = tasca.id;
    tascaTitol.value = tasca.titol;
    tascaDescripcio.value = tasca.descripcio;
    tascaDataVenciment.value = tasca.dataVenciment;
    tascaPrioritat.value = tasca.prioritat;
 
}
/* Función que escribe en las columnas las tareas que coinciden */

function renderTauler(){
    columnaEncurs.innerHTML = "";
    columnaPerfer.innerHTML = "";
    columnaFet.innerHTML= "";
    const filtres = {
        estat: filtreEstat.value,
        prioritat: filtrePrioritat.value,
        cerca: inputCerca.value.toLowerCase().trim()
    };
    const tasquesFiltrades =getTasquesFiltrades(tasques, filtres);
    tasquesFiltrades.forEach(tasca => {
        let targetaTasca = crearTargetaTasca(tasca)
        if (tasca.estat === "perFer") {
            columnaPerfer.appendChild(targetaTasca)
        } else if (tasca.estat === "enCurs") {
            columnaEncurs.appendChild(targetaTasca)
        } else {
            columnaFet.appendChild(targetaTasca);
        }
    })

}
function pruebaApp() {
    const hayTareas = carregarTasques();
    if (!hayTareas){
        crearTareaPrueba();
    }
    renderTauler();
}
formulariTasca.addEventListener("submit", gestionarFormulari);
filtreEstat.addEventListener("change", renderTauler)
filtrePrioritat.addEventListener("change", renderTauler)
inputCerca.addEventListener("change", renderTauler)
pruebaApp();