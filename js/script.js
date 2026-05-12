/* Clave del LocalStorage */
const STORAGE_KEY = "tasquesKanban";

/* Array donde estarán las tareas */

let tasques = [];

/* Función para cargar las tareas */
function carregarTasques() {
    const tasquesGuardades = localStorage.getItem(STORAGE_KEY);

    if (tasquesGuardades) {
        tasques = JSON.parse(tasquesGuardades);
        return true
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

function pruebaApp() {
    const hayTareas = carregarTasques();
    if (!hayTareas){
        crearTareaPrueba();
        console.log("Tarea de prueba", tasques)
    } else {
        console.log("Tareas", tasques)
    }

    renderTauler();
}

/* elementos del DOM con los que trabajaremos */

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

/* Función que gestiona el Formulario */

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

    const novaTasca = crearTasca(titol, descripcio, prioritat, dataVenciment);

    tasques.push(novaTasca);
    guardarTasques();
    formulariTasca.reset();
    renderTauler();
}
formulariTasca.addEventListener("submit", gestionarFormulari);

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
    const tascaPrioritat = document.createElement("p");
    tascaPrioritat.textContent = "Prioritat: " + tasca.prioritat;
    if (tasca.prioritat === "alta") {
        targeta.classList.add("prioritat-alta");
    } else if ( tasca.prioritat === "mitjana") {
        targeta.classList.add("prioritat-mitjana");
    } else {
        targeta.classList.add("prioritat-baixa");
    }
    targeta.appendChild(tascaTitol);
    targeta.appendChild(tascaDescripcio);
    targeta.appendChild(dataTasca);
    targeta.appendChild(tascaPrioritat);
    return targeta;

}
/* Función que escribe en las columnas las tareas que coinciden */

function renderTauler(){
    columnaEncurs.innerHTML = "";
    columnaPerfer.innerHTML = "";
    columnaFet.innerHTML= "";
    tasques.forEach(tasca => {
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

pruebaApp();