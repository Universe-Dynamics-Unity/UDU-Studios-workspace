 // Objeto global que almacenará la estructura JSON final
        let datosNivel = {
            nivel: 0,
            nombre: "",
            mapa: []
        };

        // Variables para la cuadrícula
        let columnas = 0;
        let filas = 0;

        function iniciarNivel() {
            // 1. Capturar los valores de los inputs por su ID
            const inputNivel = document.getElementById('nivel-numero').value;
            const inputNombre = document.getElementById('nombre').value;
            const inputAncho = document.getElementById('ancho-mapa').value;
            const inputAlto = document.getElementById('alto-mapa').value;

            // Validación rápida para que no dejen campos vacíos
            if(!inputNivel || !inputNombre || !inputAncho || !inputAlto) {
                alert("Por favor, llena todos los campos para generar la estructura del nivel.");
                return;
            }

            // 2. Guardar en el objeto JSON que se exportará después
            datosNivel.nivel = parseInt(inputNivel);
            datosNivel.nombre = inputNombre;
            columnas = parseInt(inputAncho);
            filas = parseInt(inputAlto);

            // 3. Ocultar el menú y mostrar el editor
            document.getElementById('setup-modal').style.display = 'none';
            document.getElementById('editor-container').style.display = 'block';

            // 4. Mostrar la información en pantalla
            document.getElementById('info-nivel').innerText = 
                `Nivel ${datosNivel.nivel}: ${datosNivel.nombre} (${columnas}x${filas})`;

            // 5. Preparar el Canvas (El tamaño dependerá de las filas y columnas)
            prepararLienzo();
        }

        function prepararLienzo() {
    const canvas = document.getElementById('mapCanvas');
    
    // Ajustar el tamaño del canvas según las dimensiones del mapa
    canvas.width = columnas * tamañoTile;
    canvas.height = filas * tamañoTile;

    // --- CAMBIO IMPORTANTE AQUÍ ---
    // Solo creamos una matriz vacía si NO hay datos cargados previamente
    if (matrizMapa.length === 0) {
        for (let y = 0; y < filas; y++) {
            let fila = [];
            for (let x = 0; x < columnas; x++) {
                fila.push('o'); // Llenado inicial por defecto
            }
            matrizMapa.push(fila);
        }
    }

    // Dibujar lo que sea que haya en la matriz (vacío o importado)
    dibujarLienzo();
    
    // Actualizar el texto informativo con los datos cargados
    document.getElementById('info-nivel').innerText = 
        `Nivel ${datosNivel.nivel}: ${datosNivel.nombre} (${columnas}x${filas})`;
    
    console.log("Lienzo listo con datos de:", datosNivel.nombre);
}

        // --- NUEVAS VARIABLES PARA EL EDITOR ---
// Esta matriz será la "memoria" del mapa
let matrizMapa = []; 
// El elemento que tienes seleccionado para pintar (por defecto la pared '1')
let pincelActual = '1'; 
const tamañoTile = 30; // Tamaño de cada cuadrito en el canvas

// --- COLORES PARA LA PALETA ---
// Como usas Ibis Paint para tus sprites, por ahora usaremos colores de referencia.
// Luego puedes cambiarlos por imágenes reales del juego.
const coloresPincel = {
    '1': '#7a1a97', // Pared (Morado)
    '0': '#d0ff00', // Vacío con puntos (Amarillo)
    'm': '#ff7300', // Moneda (Naranja)
    'o': '#1c003d', // Vacío total (Negro)
    'P': '#e2e9ec', // Jugador (Blanco)
    'Z': '#007940', // Zombie (Verde)
    'S': '#00f7ff'  // Portal de salida (Cian)
};

function prepararLienzo() {
    const canvas = document.getElementById('mapCanvas');
    
    // Ajustar dimensiones físicas
    canvas.width = columnas * tamañoTile;
    canvas.height = filas * tamañoTile;

    // Si entramos por "Crear Lienzo" (matriz vacía), llenamos con 'o'
    if (matrizMapa.length === 0) {
        for (let y = 0; y < filas; y++) {
            let fila = Array(columnas).fill('o'); 
            matrizMapa.push(fila);
        }
    }

    // El secreto está aquí: llamar a dibujar para que interprete los códigos
    dibujarLienzo();
    
    document.getElementById('info-nivel').innerText = 
        `Nivel ${datosNivel.nivel}: ${datosNivel.nombre} (${columnas}x${filas})`;
}

// --- FUNCIÓN PARA PINTAR TODO EL CANVAS ---
function dibujarLienzo() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');

    // Recorremos nuestra "memoria" para dibujar cada cuadro
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            let elemento = matrizMapa[y][x]; // Vemos qué letra hay en esta coordenada
            
            // Pintar el fondo del cuadro
            ctx.fillStyle = coloresPincel[elemento];
            ctx.fillRect(x * tamañoTile, y * tamañoTile, tamañoTile, tamañoTile);
            
            // Dibujar el borde del cuadro (para que se vea como cuadrícula)
            ctx.strokeStyle = '#4985ad'; // Azulito para la malla
            ctx.strokeRect(x * tamañoTile, y * tamañoTile, tamañoTile, tamañoTile);
        }
    }
}

// Función para elegir qué bloque pintar
function seleccionarPincel(tipo, elemento) {
    pincelActual = tipo; // Actualiza el pincel con el ID correspondiente (1, 0, Z, etc.)

    // Quitar el brillo de todos los botones
    const botones = document.querySelectorAll('.palette-item');
    botones.forEach(btn => btn.classList.remove('selected'));

    // Ponerle el brillo al botón que tocaste
    elemento.classList.add('selected');
}

// --- SISTEMA DE PINTADO ---
const canvas = document.getElementById('mapCanvas');

// Escuchamos el clic (mouse) y el toque (dedo)
canvas.addEventListener('mousedown', iniciarPintado);
canvas.addEventListener('mousemove', pintarSiPresiona);

function iniciarPintado(e) {
    pintar(e);
}

function pintarSiPresiona(e) {
    if (e.buttons === 1) { // Solo pinta si el botón izquierdo está presionado
        pintar(e);
    }
}

function pintar(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculamos en qué fila y columna de la matriz caímos
    const col = Math.floor(x / tamañoTile);
    const fila = Math.floor(y / tamañoTile);

    // Si el clic está dentro de los límites, actualizamos la matriz y redibujamos
    if (col >= 0 && col < columnas && fila >= 0 && fila < filas) {
        matrizMapa[fila][col] = pincelActual;
        dibujarLienzo(); // Redibuja solo el lienzo para mostrar el cambio
    }
}

async function exportarNivel() {
    // 1. Preparamos los datos del mapa
    datosNivel.mapa = [];
    for (let f = 0; f < filas; f++) {
        let filaConComas = matrizMapa[f].join(","); 
        datosNivel.mapa.push(filaConComas);
    }

    const contenidoJson = JSON.stringify(datosNivel, null, 4);
    const nombreArchivo = `mapa${datosNivel.nivel}.json`;

    // 2. Intentar usar la API de Acceso al Sistema de Archivos (Función Moderna)
    if ('showSaveFilePicker' in window) {
        try {
            // Esto abrirá la ventana de "Guardar como" y te pedirá permiso
            const handle = await window.showSaveFilePicker({
                suggestedName: nombreArchivo,
                types: [{
                    description: 'Archivo JSON de Nivel',
                    accept: { 'application/json': ['.json'] },
                }],
            });

            const writable = await handle.createWritable();
            await writable.write(contenidoJson);
            await writable.close();
            
            alert(`✅ Nivel guardado directamente en la carpeta del proyecto.`);
            return; // Salimos de la función si tuvo éxito
        } catch (err) {
            // Si el usuario cancela o hay error, pasamos a la función de escape (Descargas)
            console.log("Guardado manual cancelado o no soportado, usando Descargas.");
        }
    }

    // 3. Función de Escape: Descarga predeterminada (Descargas)
    // Se activa si el navegador es antiguo o si cancelas la ventana anterior
    const blob = new Blob([contenidoJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`📂 Guardado en "Descargas" (Función de escape). Muévelo a su carpeta de niveles.`);
}

let archivoActualHandle = null; // Guarda la referencia al archivo abierto

async function importarNivel() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'Archivo de Mapa Zombie Tomb (.json)',
                accept: { 'application/json': ['.json'] },
            }],
            multiple: false
        });

        const file = await handle.getFile();
        const contenido = await file.text();
        const json = JSON.parse(contenido);

        // --- VALIDACIÓN INTELIGENTE ---
        if (json.nivel !== undefined && Array.isArray(json.mapa)) {
            archivoActualHandle = handle;
            datosNivel = json;
            
            // 1. Limpiar la matriz actual
            matrizMapa = []; 
            
            // 2. Detectar dimensiones automáticamente
            filas = json.mapa.length;
            columnas = json.mapa[0].split(',').length;

            // 3. TRADUCCIÓN: Convertimos los strings "1,0,P..." en filas de matriz
            matrizMapa = json.mapa.map(filaStr => filaStr.split(','));

            // 4. Cambiar de vista en la UI
            document.getElementById('setup-modal').style.display = 'none';
            document.getElementById('editor-container').style.display = 'block';
            
            // 5. Dibujar con los nuevos datos
            prepararLienzo(); 
            
            alert(`✅ Mapa "${json.nombre}" interpretado correctamente.`);
        } else {
            alert("❌ El archivo no tiene el formato correcto de Zombie Tomb.");
        }
    } catch (err) {
        console.log("Importación cancelada o error:", err);
    }
}