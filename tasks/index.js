// --- MIS VARIABLES ---
// Aquí me traigo todo lo del HTML para poder manipularlo con JS
const formulario = document.getElementById('formulario');
const input = document.getElementById('input-tarea');
const lista = document.getElementById('lista-tareas');
const errorMsg = document.getElementById('error');

// 1. CARGA INICIAL (¡Lo primero que pasa!)
// Esto se ejecuta apenas la página termina de cargar.
document.addEventListener('DOMContentLoaded', () => {
    // Intento sacar las tareas del "disco duro" del navegador.
    // OJO: Si no hay nada (null), uso un array vacío [] para que no explote.
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    
    // Por cada texto que encontré guardado, "pinto" la tarea en la pantalla
    tareasGuardadas.forEach(tareaTexto => {
        crearTareaDOM(tareaTexto);
    });
});

// 2. LA FÁBRICA DE HTML
// Esta función solo se encarga de "dibujar". La separé para usarla 
// tanto al cargar la página como al agregar una tarea nueva.
function crearTareaDOM(texto) {
    const li = document.createElement('li');
    
    // Uso Backticks (``) porque es más fácil meter variables y escribir HTML limpio
    li.innerHTML = `
        <button class="eliminar">
            <ion-icon name="trash-outline"></ion-icon>
        </button>
        <p>${texto}</p>
        <button class="editar">
            <ion-icon name="create-outline"></ion-icon>
        </button>
    `;
    
    // Finalmente, meto el <li> nuevo dentro de la lista <ul>
    lista.appendChild(li);
}

// 3. GUARDAR DATOS (La magia del LocalStorage)
// Esta función escanea lo que hay en pantalla y lo guarda en el navegador
function guardarEnStorage() {
    const tareas = [];
    
    // Recorro todos los párrafos <p> que están dentro de la lista
    document.querySelectorAll('#lista-tareas li p').forEach(parrafo => {
        tareas.push(parrafo.textContent); // Guardo solo el texto
    });
    
    // IMPORTANTE: LocalStorage solo entiende TEXTO. 
    // Por eso uso JSON.stringify para convertir mi array en un string.
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// 4. AGREGAR TAREA (El evento del formulario)
function agregarTarea(e) {
    e.preventDefault(); // ¡FRENAR! Evito que el formulario recargue la página por defecto
    
    const tarea = input.value.trim(); // .trim() borra los espacios vacíos al inicio y final

    // Validación simple: si no escribió nada, muestro el error y me salgo
    if (tarea === "") {
        errorMsg.style.display = "block";
        return; 
    }

    // Si todo está bien, oculto el error
    errorMsg.style.display = "none";
    
    // Paso 1: La dibujo en pantalla
    crearTareaDOM(tarea);
    
    // Paso 2: La guardo en la memoria persistente
    guardarEnStorage();

    // Limpio el input para que pueda escribir otra de una vez
    input.value = "";
}

// 5. MANEJAR CLICKS (Event Delegation / Delegación de Eventos)
// Trucazo: En vez de ponerle un listener a CADA botón, se lo pongo a la lista completa.
function manejarClick(e) {
    const item = e.target; // ¿A qué elemento le di click?

    // CASO BORRAR
    // Uso .closest() porque a veces le doy click al ícono y no al botón.
    // Esto busca al "padre" más cercano que tenga la clase .eliminar
    if (item.closest('.eliminar')) {
        const li = item.closest('.eliminar').parentElement; // Busco el <li> completo
        li.remove(); // Lo borro del HTML
        guardarEnStorage(); // ACTUALIZO la base de datos (si no, al recargar vuelve a salir)
    }

    // CASO EDITAR
    if (item.closest('.editar')) {
        const li = item.closest('.editar').parentElement;
        const parrafo = li.querySelector('p'); // Selecciono el texto actual
        
        // Uso un prompt sencillito para pedir el cambio
        const nuevoTexto = prompt("Editar tarea:", parrafo.textContent);
        
        // Si no le dio a cancelar (null) y no lo dejó vacío...
        if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
            parrafo.textContent = nuevoTexto; // Cambio el texto en pantalla
            guardarEnStorage(); // Guardo el cambio en memoria
        }
    }
}

// --- LISTENERS ---
// Aquí conecto los cables para que todo reaccione
formulario.addEventListener('submit', agregarTarea);
lista.addEventListener('click', manejarClick);