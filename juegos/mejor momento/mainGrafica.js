let dim = 4; // Solicita al usuario el tamaño del tablero
let matriz = []; // Inicializa la matriz que representará el tablero
let escribirMatriz = "Tablero \n"; // Variable para almacenar la representación del tablero en texto
let dirreciones = []; // Array para almacenar las direcciones disponibles para moverse
let dirrecion; // Variable para almacenar la dirección elegida por el usuario
let xy = [0, 0]; // Posición inicial del jugador en el tablero
let confirmar = false; // Variable para confirmar si el movimiento es válido
let monedas = 0; // Contador de monedas
let pasosSeguidos = 0; // Contador de pasos dados
let zombisCerca = false; // Indica si hay zombis cerca
let recompensaCerca = false; // Indica si hay recompensas cerca
let boton = document.getElementById("mover"); // Botón para mover al jugador
let zombis = dim; // Número de zombis en el tablero, igual al tamaño del tablero
let recompensas = parseInt(dim / 4); // Número de recompensas, un cuarto del tamaño del tablero
let monedasHtml = document.getElementById("monedasHtml"); // Elemento HTML para mostrar monedas
let zombisHtml = document.getElementById("zombis"); // Elemento HTML para mostrar zombis
let recompensasHtml = document.getElementById("recompensas"); // Elemento HTML para mostrar recompensas
let zombiTrobat = false; // Indica si se ha encontrado un zombi
let recompensaTrobat = false; // Indica si se ha encontrado una recompensa
let botonMover = document.getElementById("boton"); // Botón para mover al jugador
let zombiActual = 0; // Estado del zombi actual
let recompensaActual = 0; // Estado de la recompensa actual
let energia = 3; // Puntos de energía para usar poderes especiales
let inmunidadActiva = false; // Estado de inmunidad temporal
let turnosInmunidad = 0; // Contador de turnos de inmunidad
let radarActivo = false; // Estado del radar de zombis
let congelarZombisActiva = false; // Estado de congelación de zombis
let turnoCongelarZombis = 0; // Contador de turnos de congelación de zombis

zombisHtml.innerText = "Zombis: " + zombis; // Muestra el número de zombis en el HTML
recompensasHtml.innerText = "Recompensas: " + recompensas; // Muestra el número de recompensas en el HTML

// Validación del tamaño del tablero
while (dim < 4 || dim > 10) {
    alert("Tienes que poner un numero dentro del rango"); // Alerta si el tamaño no está en el rango
    dim = prompt("De que tamaño quieres el tablero, min 4 max 10"); // Solicita nuevamente el tamaño
}

matriz = crearMatrizCuadrada(dim); // Crea la matriz cuadrada según el tamaño

matriz[0][0] = 1; // Establece la posición inicial del jugador en la matriz

crearTablaHTML(matriz); // Crea la tabla HTML para representar el tablero
let td = document.getElementById(0 + "" + 0); // Obtiene la celda correspondiente a la posición inicial

// Coloca la imagen del jugador en la celda inicial
td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";

matriz = crearZombis(dim, matriz); // Crea los zombis en el tablero

matriz = crearMonedas(dim, matriz); // Crea las monedas en el tablero

function juego() {
    info.innerHTML = "";
    // Verifica si el jugador ha llegado a la meta
    if (!(xy[0] === matriz.length - 1 && xy[1] === matriz.length - 1)) {
        dirreciones = confirmarMover(matriz, xy); // Confirma las direcciones disponibles para moverse
        // Si no hay direcciones disponibles, termina el juego
        if (dirreciones.length == 0) {
            alert("Has acabado!!!")
            botonMover.innerHTML = "<button onclick='juego()' id='mover' name='mover' disabled>Mover</button>";
        } else {
            // Mensaje dependiendo de si hay zombis o recompensas cerca
            if (zombisCerca && recompensaCerca) {
                dirrecion = prompt(montarMensaje(dirreciones) + "\nHay zombis\nHay recompensas");
            } else if (recompensaCerca) {
                dirrecion = prompt(montarMensaje(dirreciones) + "\nHay recompensas");
            } else if (zombisCerca) {
                dirrecion = prompt(montarMensaje(dirreciones) + "\nHay zombis");
            } else {
                dirrecion = prompt(montarMensaje(dirreciones));
            }

            // Verifica si la dirección elegida es válida
            for (let i = 0; i < dirreciones.length; i++) {
                const element = dirreciones[i];

                if (element.toUpperCase() === dirrecion.toUpperCase()) {
                    confirmar = true;
                    break;
                }

            }

            console.log(dirreciones);

            // Si la dirección no es válida, muestra un mensaje de error
            if (!confirmar) {
                alert("NO puedes ir por ahi");
            } else {
                matriz = mover(dirrecion, matriz, dirreciones); // Mueve al jugador según la dirección elegida
                matriz = moverZombis(matriz); // Mueve los zombis después de que el jugador se mueve
            }

            matriz = imprimirMatriz(matriz); // Actualiza la representación del tablero

            console.log(escribirMatriz);

            console.log(monedas);

            // Reinicia las variables para la próxima iteración
            zombisCerca = false;
            recompensaCerca = false;
            confirmar = false;
            monedas = Math.floor(monedas);
            monedasHtml.innerText = "Monedas: " + monedas;
            zombisHtml.innerText = "Zombis: " + zombis;
            recompensaCerca.innerText = "Recompensas: " + recompensas;
        }
    } else {
        alert("Has ganado!!!"); // Muestra un mensaje de victoria si el jugador ha llegado a la meta
        botonMover.innerHTML = "<button onclick='juego()' id='mover' name='mover' disabled>Mover</button>";
        if (monedas >= 10) {
            window.location.href = "mejorMomento.html";
        }
    }
}


// Funciones para crear la matriz, zombis y monedas
function imprimirMatriz(matriz) {
    escribirMatriz = "Tablero \n"; // Reiniciar la variable antes de construir la nueva matriz
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            escribirMatriz += matriz[i][j] + " ";
        }
        escribirMatriz += "\n";
    }
    return matriz;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function crearMatrizCuadrada(dim) {
    let matriz = [];
    for (let i = 0; i < dim; i++) {
        let fila = [];
        for (let j = 0; j < dim; j++) {
            fila[j] = 0;
        }
        matriz[i] = fila;
    }
    return matriz;
}

function crearZombis(dim, matriz) {
    let contador = 0;
    while (contador < dim) {
        let x = getRandomInt(0, dim - 1);
        let y = getRandomInt(0, dim - 1);

        if (matriz[x][y] !== 3 && matriz[x][y] !== 2 && matriz[x][y] !== 1 && (x !== dim - 1 || y !== dim - 1)) {
            matriz[x][y] = 3;
            contador++;
        }
    }
    return matriz;
}

function crearMonedas(dim, matriz2) {
    let contador = 0;
    while (contador < Math.round(dim / 4)) {
        let x = getRandomInt(0, dim - 1);
        let y = getRandomInt(0, dim - 1);

        if (matriz2[x][y] !== 3 && matriz2[x][y] !== 2 && matriz2[x][y] !== 1 && (x !== dim - 1 || y !== dim - 1)) {
            matriz2[x][y] = 2;
            contador++;
        }
    }
    return matriz2;
}

// Funciones para mover al jugador y verificar zombis y recompensas
function confirmarMover(matriz3) {
    let dirreciones1 = [];
    if (xy[0] + 1 < matriz3.length && matriz3[xy[0] + 1][xy[1]] !== 1) {
        dirreciones1.push("Sud");
        if (matriz3[xy[0] + 1][xy[1]] === 3) {
            zombisCerca = true;
        }
        if (matriz3[xy[0] + 1][xy[1]] === 2) {
            recompensaCerca = true;
        }
    }
    if (xy[1] + 1 < matriz3.length && matriz3[xy[0]][xy[1] + 1] !== 1) {
        dirreciones1.push("Est");
        if (matriz3[xy[0]][xy[1] + 1] === 3) {
            zombisCerca = true;
        }
        if (matriz3[xy[0]][xy[1] + 1] === 2) {
            recompensaCerca = true;
        }
    }
    if (xy[0] - 1 >= 0 && matriz3[xy[0] - 1][xy[1]] !== 1) {
        dirreciones1.push("Nord");
        if (matriz3[xy[0] - 1][xy[1]] === 3) {
            zombisCerca = true;
        }
        if (matriz3[xy[0] - 1][xy[1]] === 2) {
            recompensaCerca = true;
        }
    }
    if (xy[1] - 1 >= 0 && matriz3[xy[0]][xy[1] - 1] !== 1) {
        dirreciones1.push("Oest");
        if (matriz3[xy[0]][xy[1] - 1] === 3) {
            zombisCerca = true;
        }
        if (matriz3[xy[0]][xy[1] - 1] === 2) {
            recompensaCerca = true;
        }
    }

    return dirreciones1;
}

function montarMensaje(matriz4) {
    let mensaje = "Les opcions disponibles són: \n"
    for (let i = 0; i < matriz4.length; i++) {
        mensaje += "-" + matriz4[i] + "\n";
    }
    return mensaje;
}

function encontrarZombi(tdAnterior, td) {
    if (inmunidadActiva) {
        alert("¡Eres inmune! No pierdes nada.");
        if (zombiTrobat) {
            tdAnterior.innerHTML = "<img src='img/solo queso mosca.png' style='height: 200px;width:200px;'></img>";
        } else if (recompensaTrobat) {
            tdAnterior.innerHTML = "<img src='img/solo queso tomate.png' style='height: 200px;width:200px;'></img>";
        } else {
            tdAnterior.innerHTML = "<img src='img/solo queso.jpeg' style='height: 200px;width:200px;'></img>";
        }
        td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
        zombiTrobat = true;
        recompensaActual = 2;
        zombiActual = 1;
    } else {
        alert("Zombi trobat, has perdut");
        zombis--;
        monedas = monedas / 2;
        pasosSeguidos = 0;
        if (zombiTrobat) {
            tdAnterior.innerHTML = "<img src='img/solo queso mosca.png' style='height: 200px;width:200px;'></img>";
        } else if (recompensaTrobat) {
            tdAnterior.innerHTML = "<img src='img/solo queso tomate.png' style='height: 200px;width:200px;'></img>";
        } else {
            tdAnterior.innerHTML = "<img src='img/solo queso.jpeg' style='height: 200px;width:200px;'></img>";
        }
        td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
        zombiTrobat = true;
        recompensaActual = 2;
        zombiActual = 1;
    }


}


function encontrarRecompensa(tdAnterior, td) {
    alert("Recompensa trobat");
    recompensas--;
    monedas = monedas * 5;
    pasosSeguidos = 0;
    if (recompensaTrobat) {
        tdAnterior.innerHTML = "<img src='img/solo queso tomate.png' style='height: 200px;width:200px;'></img>";
    } else if (zombiTrobat) {
        tdAnterior.innerHTML = "<img src='img/solo queso mosca.png' style='height: 200px;width:200px;'></img>";
    } else {
        tdAnterior.innerHTML = "<img src='img/solo queso.jpeg' style='height: 200px;width:200px;'></img>";
    }
    td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
    recompensaTrobat = true;
    recompensaActual = 1;
    zombiActual = 2;
}

function actualizarPosicion(tdAnterior, td) {
    if (zombiTrobat && zombiActual == 1) {
        td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
        tdAnterior.innerHTML = "<img src='img/solo queso mosca.png' style='height: 200px;width:200px;'></img>";
    } else if (recompensaTrobat && recompensaActual == 1) {
        td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
        tdAnterior.innerHTML = "<img src='img/solo queso tomate.png' style='height: 200px;width:200px;'></img>";
    } else {
        td.innerHTML = "<img src='img/persona.png' style='height: 200px;width:200px;'></img>";
        tdAnterior.innerHTML = "<img src='img/solo queso.jpeg' style='height: 200px;width:200px;'></img>";
    }
}

function mover(direccion1, matriz5) {
    let tdAnterior = document.getElementById(xy[0] + "" + xy[1]);
    pasosSeguidos++;

    // Actualizar la posición según la dirección
    if (direccion1.toUpperCase() === "EST") xy[1]++;
    else if (direccion1.toUpperCase() === "OEST") xy[1]--;
    else if (direccion1.toUpperCase() === "SUD") xy[0]++;
    else if (direccion1.toUpperCase() === "NORD") xy[0]--;
    else {
        alert("No puedes ir por ahi");
        return matriz5;
    }

    let td = document.getElementById(xy[0] + "" + xy[1]);

    // Verificar zombi o recompensa
    if (matriz5[xy[0]][xy[1]] === 3) {
        encontrarZombi(tdAnterior, td);
    } else if (matriz5[xy[0]][xy[1]] === 2) {
        encontrarRecompensa(tdAnterior, td);
    } else {
        actualizarPosicion(tdAnterior, td);
        zombiTrobat = false;
        recompensaTrobat = false;
    }

    monedas += pasosSeguidos;
    matriz5[xy[0]][xy[1]] = 1;
    turnoFin();
    return matriz5;
}

function crearTablaHTML(matrizHTML) {
    let taulaText = "<table>";
    let tauler = document.getElementById("tauler");

    for (let i = 0; i < matrizHTML.length; i++) {
        taulaText += "<tr>";
        for (let j = 0; j < matrizHTML[i].length; j++) {
            taulaText += "<td id='" + i + "" + j + "'> </td>";
        }
        taulaText += "</tr>";
    }
    taulaText += "</table>";
    tauler.innerHTML = taulaText;
}

//extras

function moverZombis(matriz) {
    // Lista de posibles movimientos (norte, sur, este, oeste)
    const movimientos = [
        { dx: -1, dy: 0 }, // Norte
        { dx: 1, dy: 0 },  // Sur
        { dx: 0, dy: -1 }, // Oeste
        { dx: 0, dy: 1 }   // Este
    ];

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 3) { // Si encontramos un zombi
                let movido = false;

                // Probar hasta 4 movimientos aleatorios
                for (let intentos = 0; intentos < 4; intentos++) {
                    const movimiento = movimientos[Math.floor(Math.random() * movimientos.length)];
                    const nuevaX = i + movimiento.dx;
                    const nuevaY = j + movimiento.dy;

                    // Verificar que el movimiento está dentro del tablero y que la celda está vacía (0)
                    if (
                        nuevaX >= 0 && nuevaX < matriz.length &&
                        nuevaY >= 0 && nuevaY < matriz[i].length &&
                        matriz[nuevaX][nuevaY] === 0
                    ) {
                        // Mover el zombi a la nueva posición
                        matriz[nuevaX][nuevaY] = 3;
                        matriz[i][j] = 0; // Vaciar la posición anterior
                        movido = true;
                        break; // Zombi ha sido movido, salir del bucle de intentos
                    }
                }

                // Si no se encontró un movimiento válido, el zombi se queda en su lugar actual
            }
        }
    }
    return matriz;
}

// Función para activar un poder especial
function activarPoder(poder) {
    if (energia > 0) {
        switch (poder) {
            case 'inmunidad':
                activarInmunidad();
                break;
            case 'radar':
                activarRadar();
                break;
        }
        energia--; // Reducir la energía después de usar un poder
        actualizarEnergiaHtml(); // Actualizar en el HTML
    } else {
        alert("No tienes suficiente energía para activar este poder");
    }
}

// 1. Función de inmunidad temporal
function activarInmunidad() {
    inmunidadActiva = true;
    turnosInmunidad = 3; // Duración de inmunidad
    alert("¡Inmunidad activada! Eres invulnerable a los zombis por 3 turnos.");
}

// 2. Función de radar para mostrar zombis
function activarRadar() {
    radarActivo = true;
    alert("¡Radar activado! Zombis revelados temporalmente.");
    mostrarZombisTemporales();
}

// Actualización del HTML de energía
function actualizarEnergiaHtml() {
    let energiaHtml = document.getElementById("energiaHtml");
    energiaHtml.innerText = "Energía: " + energia;
}

// Desactivar el radar y restaurar el color del tablero
function limpiarRadar() {
    radarActivo = false;
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 3) {
                let tdZombi = document.getElementById(i + "" + j);
                tdZombi.innerHTML = "";
            }
        }
    }
}

// Mostrar temporalmente la ubicación de los zombis cuando el radar está activo
function mostrarZombisTemporales() {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 3) {
                let tdZombi = document.getElementById(i + "" + j);
                tdZombi.innerHTML = "<img src='img/solo queso mosca.png' style='height: 200px;width:200px;'></img>";
            }
        }
    }
    setTimeout(limpiarRadar, 2000);
}

// Restar turnos del poder de inmunidad activos al final de cada turno
function turnoFin() {
    if (turnosInmunidad > 0) {
        turnosInmunidad--;
        if (turnosInmunidad === 0) {
            inmunidadActiva = false;
            alert("¡La inmunidad ha terminado!");
        }
    }
}

function recargar() {
    location.reload();
}