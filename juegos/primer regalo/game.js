const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay'); // Referencia al contador de puntos

const motoWidth = 50;
const motoHeight = 50;
const moto = {
    x: canvas.width / 2 - motoWidth / 2,
    y: canvas.height - motoHeight - 10,
    width: motoWidth,
    height: motoHeight,
    speed: 5,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
let obstacleSpeed = 3;
let score = 0;
let gameOver = false;
const goalDistance = 40000; // Metros o puntos para completar el juego
const pointsPerObstacle = 25000; // Puntos que se sumarán por cada obstáculo evitado

// Cargar la imagen de la moto
const motoImg = new Image();
motoImg.src = 'img/moto.jpg'; // Asegúrate de que la ruta sea correcta

const obstacleImg = new Image();
obstacleImg.src = 'img/obstacle.png'; // Aquí debes incluir la imagen pixelart del obstáculo

// Crear obstáculos (más frecuente)
function createObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: -obstacleHeight });
}

function redirectToWin() {
    // Mostrar la pantalla de carga
    document.getElementById('loadingScreen').style.display = 'flex';

    // Después de 4 segundos, redirigir a la página de victoria
    setTimeout(() => {
        window.location.href = 'cerdanyola-del-valles.html'; // Redirige a la página de victoria
    }, 4000);  // 4 segundos de espera
}

// Función para mostrar el mensaje de derrota
function gameOverScreen() {
    // Dibujar un rectángulo semitransparente sobre el canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mostrar el mensaje "Has perdido"
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Has perdido', canvas.width / 2, canvas.height / 2 - 50);

    // Instrucción para reiniciar el juego
    ctx.font = '24px Arial';
    ctx.fillText('Redirigiendo en 2 segundos...', canvas.width / 2, canvas.height / 2 + 30);
}

// Actualizar el estado del juego
function update() {
    if (moto.moveUp && moto.y > 0) {
        moto.y -= moto.speed;
    }
    if (moto.moveDown && moto.y < canvas.height - moto.height) {
        moto.y += moto.speed;
    }
    if (moto.moveLeft && moto.x > 0) {
        moto.x -= moto.speed;
    }
    if (moto.moveRight && moto.x < canvas.width - moto.width) {
        moto.x += moto.speed;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        // Detección de colisiones
        if (
            moto.x < obstacles[i].x + obstacleWidth &&
            moto.x + moto.width > obstacles[i].x &&
            moto.y < obstacles[i].y + obstacleHeight &&
            moto.y + moto.height > obstacles[i].y
        ) {
            gameOver = true; // Marca el juego como terminado
            gameOverScreen(); // Llama a la función para mostrar el mensaje de derrota
            setTimeout(() => {
                window.location.href = 'juego_moto.html'; // Redirige a la página de juego después de 2 segundos
            }, 2000);
            return; // Detener el ciclo de actualización
        }
    }

    obstacles.forEach((obstacle, index) => {
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score += pointsPerObstacle;  // Sumar más puntos por cada obstáculo evitado
            obstacleSpeed += 0.2; // Incrementar la velocidad de los obstáculos más rápidamente
            scoreDisplay.innerHTML = `Puntos: ${score}`; // Actualizar el contador en pantalla
        }
    });

    // Verificar si el jugador ha alcanzado el objetivo
    if (score >= goalDistance) {
        gameOver = true;
        redirectToWin(); // Redirigir a la página de victoria
        return; // Detener el ciclo de actualización
    }

    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

// Dibujar los elementos del juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la moto
    ctx.drawImage(motoImg, moto.x, moto.y, moto.width, moto.height);

    // Dibujar los obstáculos
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });

    // Si el juego no ha terminado, seguir dibujando
    if (!gameOver) {
        requestAnimationFrame(draw);
    } else {
        // Si el juego ha terminado, mostrar la pantalla de "Has perdido"
        gameOverScreen();
    }
}

// Inicializar el juego
function init() {
    createObstacle();
    setInterval(createObstacle, 600); // Crear un nuevo obstáculo cada 0.6 segundos para mayor dificultad
    update();
    draw();
}

// Manejadores de eventos para el menú
document.getElementById('startButton').addEventListener('click', () => {
    document.querySelector('.menu-container').style.display = 'none';
    document.querySelector('.game-container').style.display = 'flex';
    init();
});

document.getElementById('exitButton').addEventListener('click', () => {
    window.location.href = '../../nextpage.html'; // Redirige a la página principal o cerrar el juego
});

// Controles de la moto con WASD
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            moto.moveUp = true;
            break;
        case 's':
            moto.moveDown = true;
            break;
        case 'a':
            moto.moveLeft = true;
            break;
        case 'd':
            moto.moveRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            moto.moveUp = false;
            break;
        case 's':
            moto.moveDown = false;
            break;
        case 'a':
            moto.moveLeft = false;
            break;
        case 'd':
            moto.moveRight = false;
            break;
    }
});

// Cargar las imágenes antes de iniciar el juego
motoImg.onload = () => {
    console.log("Imagen de la moto cargada, juego listo.");
};

obstacleImg.onload = () => {
    console.log("Imagen del obstáculo cargada.");
};
