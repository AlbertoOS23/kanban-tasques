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

function crearTareaPrueba() {
    const novaTasca = {
        id: crypto.randomUUID(),
        titol: "Prueba",
        descripcio: "Prueba para comprobar localStorage",
        prioritat: "mitjana",
        dataVenciment: "2026-05-20",
        estat: "perFer",
        creatEl: new Date().toISOString()
    };

    tasques.push(novaTasca);
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