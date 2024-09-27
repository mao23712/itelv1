// Total preguntas del juego
const TOTAL_PREGUNTAS = 10;
// Tiempo del juego
const TIEMPO_DEL_JUEGO = 60;
// Estructura para almacenar las preguntas
const bd_juego = [
    { id: 'A', pregunta: "¿Qué término se refiere a una expresión que tiene un significado opuesto?", respuesta: "antonimo" },
    { id: 'B', pregunta: "¿Cómo se llama la acción de dar a entender algo sin usar palabras?", respuesta: "gesto" },
    { id: 'C', pregunta: "¿Qué palabra describe una forma de hablar que utiliza un estilo elegante y decorado?", respuesta: "rítorico" },
    { id: 'D', pregunta: "¿Cómo se llama el conjunto de palabras y expresiones que se utilizan en un contexto específico?", respuesta: "vocabulario" },
    { id: 'E', pregunta: "¿Qué término se utiliza para referirse al significado literal de una palabra?", respuesta: "denotación" },
    { id: 'F', pregunta: "¿Qué término se refiere a una historia o relato corto que transmite una enseñanza?", respuesta: "fábula" },
    { id: 'G', pregunta: "¿Cómo se llama el tipo de texto que describe un proceso o conjunto de instrucciones?", respuesta: "instructivo" },
    { id: 'H', pregunta: "¿Qué término se utiliza para describir la forma en que se combinan y organizan las palabras en una oración?", respuesta: "sintaxis" },
    { id: 'I', pregunta: "¿Qué término se refiere a la forma de una palabra que muestra su género y número?", respuesta: "flexión" },
    { id: 'J', pregunta: "¿Cómo se llama el recurso literario que consiste en dar a los objetos cualidades humanas?", respuesta: "personificación" },
];

// Preguntas que ya han sido contestadas. Si están en 0 no han sido contestadas
var estadoPreguntas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var cantidadAcertadas = 0;

// Variable que mantiene el num de pregunta actual
var numPreguntaActual = -1;

// Obtener el elemento del cronómetro
const timer = document.getElementById("tiempo");
// Establecer el tiempo inicial en 60 segundos
let timeLeft = TIEMPO_DEL_JUEGO;
var countdown;

// Cargar los sonidos
const inicioSonido = new Audio('Sonido/PacmanGo.mp3');
const gameoverSonido = new Audio('Sonido/GameOver.mp3');

// Botón comenzar
var comenzar = document.getElementById("comenzar");
comenzar.addEventListener("click", function (event) {
  document.getElementById("pantalla-inicial").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";
  inicioSonido.play(); // Reproduce la canción al iniciar el juego
  largarTiempo();
  cargarPregunta();
});

// Creamos el círculo con las letras de la A a la Z
const container = document.querySelector(".container");
for (let i = 1; i <= TOTAL_PREGUNTAS; i++) {
  const circle = document.createElement("div");
  circle.classList.add("circle");
  circle.textContent = String.fromCharCode(i + 96);
  circle.id = String.fromCharCode(i + 96).toUpperCase();
  container.appendChild(circle);

  const angle = ((i - 1) / TOTAL_PREGUNTAS) * Math.PI * 2 - (Math.PI / 2);
  const x = Math.round(95 + 120 * Math.cos(angle));
  const y = Math.round(95 + 120 * Math.sin(angle));
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
}

// Función que carga la pregunta
function cargarPregunta() {
  numPreguntaActual++;
  // Controlo si he llegado al final de las preguntas, para comenzar de nuevo
  if (numPreguntaActual >= TOTAL_PREGUNTAS) {
    numPreguntaActual = 0;
  }

  if (estadoPreguntas.indexOf(0) >= 0) { // Controlo que todavía haya preguntas por contestar
    while (estadoPreguntas[numPreguntaActual] == 1) {
      numPreguntaActual++;
      if (numPreguntaActual >= TOTAL_PREGUNTAS) {
        numPreguntaActual = 0;
      }
    }

    document.getElementById("letra-pregunta").textContent = bd_juego[numPreguntaActual].id;
    document.getElementById("pregunta").textContent = bd_juego[numPreguntaActual].pregunta;
    var letra = bd_juego[numPreguntaActual].id;
    document.getElementById(letra).classList.add("pregunta-actual");
  } else {
    clearInterval(countdown);
    mostrarPantallaFinal();
  }
}

// Detecto cada vez que hay un cambio de tecla en el input
var respuesta = document.getElementById("respuesta");
respuesta.addEventListener("keyup", function (event) {
  // Detecto si la tecla presionada es ENTER
  if (event.keyCode === 13) {
    if (respuesta.value == "") {
      alert("Debe ingresar un valor!!");
      return;
    }
    // Obtengo la respuesta ingresada
    var txtRespuesta = respuesta.value;
    controlarRespuesta(txtRespuesta.toLowerCase());
  }
});

// Función que controla la respuesta
function controlarRespuesta(txtRespuesta) {
  // Controlo si la respuesta es correcta
  if (txtRespuesta == bd_juego[numPreguntaActual].respuesta) {
    cantidadAcertadas++;
    // Actualizo el estado de la pregunta actual a 1, indicando que ya está respondida
    estadoPreguntas[numPreguntaActual] = 1;
    var letra = bd_juego[numPreguntaActual].id;
    document.getElementById(letra).classList.remove("pregunta-actual");
    document.getElementById(letra).classList.add("bien-respondida");

  } else {
    // Actualizo el estado de la pregunta actual a 1, indicando que ya está respondida
    estadoPreguntas[numPreguntaActual] = 1;
    var letra = bd_juego[numPreguntaActual].id;
    // Quito la clase del estilo de pregunta actual
    document.getElementById(letra).classList.remove("pregunta-actual");
    // Agrego la clase del estilo de pregunta mal respondida
    document.getElementById(letra).classList.add("mal-respondida");
  }
  respuesta.value = "";
  cargarPregunta();
}

// Botón para pasar de pregunta sin contestar
var pasar = document.getElementById("pasar");
pasar.addEventListener("click", function (event) {
  var letra = bd_juego[numPreguntaActual].id;
  document.getElementById(letra).classList.remove("pregunta-actual");
  cargarPregunta();
});

// Crear la función que se encargará de actualizar el cronómetro cada segundo
function largarTiempo() {
  countdown = setInterval(() => {
    // Restar un segundo al tiempo restante
    timeLeft--;

    // Actualizar el texto del cronómetro con el tiempo restante
    timer.innerText = timeLeft;

    // Si el tiempo llega a 0, detener el cronómetro
    if (timeLeft < 0) {
      clearInterval(countdown);
      gameoverSonido.play(); // Reproduce la canción de game over al finalizar el juego
      mostrarPantallaFinal();
    }
  }, 1000);
}

// Muestro la pantalla final
function mostrarPantallaFinal() {
  inicioSonido.pause(); // Detener la música al finalizar
  inicioSonido.currentTime = 0; // Reiniciar la música al inicio
  document.getElementById("acertadas").textContent = cantidadAcertadas;
  document.getElementById("score").textContent = (cantidadAcertadas * 100) / 10 + "% de acierto";
  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("pantalla-final").style.display = "block";
}

// Botón para recomenzar el juego
var recomenzar = document.getElementById("recomenzar");
recomenzar.addEventListener("click", function (event) {
  numPreguntaActual = -1;
  timeLeft = TIEMPO_DEL_JUEGO;
  timer.innerText = timeLeft;
  cantidadAcertadas = 0;
  estadoPreguntas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Quito las clases de los círculos
  var circulos = document.getElementsByClassName("circle");
  for (i = 0; i < circulos.length; i++) {
    circulos[i].classList.remove("bien-respondida");
    circulos[i].classList.remove("mal-respondida");
  }

  document.getElementById("pantalla-final").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";
  largarTiempo();
  cargarPregunta();
});
