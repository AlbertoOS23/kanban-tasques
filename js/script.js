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
}

pruebaApp();