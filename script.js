/* ================= DATOS ================= */

const STORAGE_JUGADORES = "rakionJugadores";
const STORAGE_HISTORIAL = "rakionHistorial";

let jugadores = JSON.parse(localStorage.getItem(STORAGE_JUGADORES)) || [];
let historial = JSON.parse(localStorage.getItem(STORAGE_HISTORIAL)) || [];

/* Convierte jugadores antiguos tipo texto a objeto */
jugadores = jugadores.map(j => {
  if (typeof j === "string") {
    return {
      nombre: j,
      activo: false,
      bombo: ""
    };
  }

  return {
    nombre: j.nombre || "",
    activo: Boolean(j.activo),
    bombo: j.bombo || ""
  };
}).filter(j => j.nombre.trim() !== "");

/* ================= ELEMENTOS ================= */

const listaJugadores = document.getElementById("listaJugadores");
const equipoA = document.getElementById("equipoA");
const equipoB = document.getElementById("equipoB");
const ruleta = document.getElementById("ruleta");
const nuevoJugador = document.getElementById("nuevoJugador");
const btnAgregar = document.getElementById("btnAgregar");
const resultadoMapas = document.getElementById("resultadoMapas");
const historialDiv = document.getElementById("historial");

/* ================= GUARDAR ================= */

function guardar() {
  localStorage.setItem(STORAGE_JUGADORES, JSON.stringify(jugadores));
  localStorage.setItem(STORAGE_HISTORIAL, JSON.stringify(historial));
}

/* ================= UTILIDADES ================= */

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function activarRuleta() {
  ruleta.classList.add("ruleta-activa");
}

function detenerRuleta() {
  ruleta.classList.remove("ruleta-activa");
}

function mezclar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

/* ================= RENDER JUGADORES ================= */

function renderJugadores() {
  listaJugadores.innerHTML = "";

  if (jugadores.length === 0) {
    listaJugadores.innerHTML = `
      <p class="ayuda">Todavía no agregaste jugadores.</p>
    `;
    return;
  }

  jugadores.forEach((jugador, index) => {
    const div = document.createElement("div");
    div.className = "jugador-card";
    div.dataset.index = index;

    div.innerHTML = `
      <input type="checkbox" class="activo" ${jugador.activo ? "checked" : ""}>
      <span>${jugador.nombre}</span>

      <select class="bombo">
        <option value="">Bombo</option>
        <option value="1" ${jugador.bombo === "1" ? "selected" : ""}>Bombo 1</option>
        <option value="2" ${jugador.bombo === "2" ? "selected" : ""}>Bombo 2</option>
        <option value="3" ${jugador.bombo === "3" ? "selected" : ""}>Bombo 3</option>
        <option value="4" ${jugador.bombo === "4" ? "selected" : ""}>Bombo 4</option>
        <option value="5" ${jugador.bombo === "5" ? "selected" : ""}>Bombo 5</option>
        <option value="6" ${jugador.bombo === "6" ? "selected" : ""}>Bombo 6</option>
        <option value="7" ${jugador.bombo === "7" ? "selected" : ""}>Bombo 7</option>
        <option value="8" ${jugador.bombo === "8" ? "selected" : ""}>Bombo 8</option>
      </select>

      <button class="btnEliminar">❌</button>
    `;

    listaJugadores.appendChild(div);
  });

  document.querySelectorAll(".jugador-card").forEach(card => {
    const index = Number(card.dataset.index);

    card.querySelector(".activo").addEventListener("change", e => {
      jugadores[index].activo = e.target.checked;
      guardar();
    });

    card.querySelector(".bombo").addEventListener("change", e => {
      jugadores[index].bombo = e.target.value;
      guardar();
    });

    card.querySelector(".btnEliminar").addEventListener("click", () => {
      const confirmar = confirm(`¿Eliminar a ${jugadores[index].nombre}?`);

      if (!confirmar) return;

      jugadores.splice(index, 1);
      guardar();
      renderJugadores();
    });
  });
}

/* ================= AGREGAR JUGADOR ================= */

function agregarJugador() {
  const nombre = nuevoJugador.value.trim();

  if (nombre === "") {
    alert("Escribe el nombre del jugador");
    return;
  }

  const existe = jugadores.some(j =>
    j.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (existe) {
    alert("Ese jugador ya existe");
    return;
  }

  jugadores.push({
    nombre,
    activo: true,
    bombo: ""
  });

  nuevoJugador.value = "";
  guardar();
  renderJugadores();
}

btnAgregar.addEventListener("click", agregarJugador);

nuevoJugador.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    agregarJugador();
  }
});

/* ================= ACCIONES JUGADORES ================= */

document.getElementById("btnSeleccionarTodos").addEventListener("click", () => {
  jugadores.forEach(j => j.activo = true);
  guardar();
  renderJugadores();
});

document.getElementById("btnLimpiarSeleccion").addEventListener("click", () => {
  jugadores.forEach(j => j.activo = false);
  guardar();
  renderJugadores();
});

document.getElementById("btnBorrarJugadores").addEventListener("click", () => {
  if (jugadores.length === 0) return;

  const confirmar = confirm("¿Seguro que deseas borrar todos los jugadores?");

  if (!confirmar) return;

  jugadores = [];
  guardar();
  renderJugadores();
});

/* ================= RULETA ================= */

function ruletaPro(lista, duracion = 2200) {
  return new Promise(resolve => {
    activarRuleta();

    let ganador = "";
    const inicio = Date.now();

    const intervalo = setInterval(() => {
      ganador = lista[Math.floor(Math.random() * lista.length)];
      ruleta.innerText = ganador;

      if (Date.now() - inicio >= duracion) {
        clearInterval(intervalo);
        detenerRuleta();
        resolve(ganador);
      }
    }, 80);
  });
}

/* ================= SORTEO EQUIPOS ================= */

document.getElementById("btnSortear").addEventListener("click", async () => {
  equipoA.innerHTML = "";
  equipoB.innerHTML = "";
  resultadoMapas.innerHTML = "";

  const seleccionados = jugadores.filter(j => j.activo);

  if (seleccionados.length < 2) {
    alert("Selecciona al menos 2 jugadores");
    return;
  }

  const sinBombo = seleccionados.filter(j => !j.bombo);

  if (sinBombo.length > 0) {
    alert("Todos los jugadores seleccionados deben tener un bombo");
    return;
  }

  const bombos = {};

  seleccionados.forEach(j => {
    if (!bombos[j.bombo]) bombos[j.bombo] = [];
    bombos[j.bombo].push(j.nombre);
  });

  const numerosBombos = Object.keys(bombos).sort((a, b) => Number(a) - Number(b));

  for (const b of numerosBombos) {
    if (bombos[b].length !== 2) {
      alert(`El bombo ${b} tiene ${bombos[b].length} jugador(es). Cada bombo debe tener EXACTAMENTE 2 jugadores.`);
      return;
    }
  }

  const rojo = [];
  const azul = [];

  ruleta.innerText = "🎡 Iniciando sorteo...";
  await esperar(700);

  for (const b of numerosBombos) {
    ruleta.innerText = `🎡 Bombo ${b}`;
    await esperar(800);

    const grupo = mezclar(bombos[b]);
    const ganador = await ruletaPro(grupo);
    const perdedor = grupo.find(nombre => nombre !== ganador);

    const liRojo = document.createElement("li");
    liRojo.textContent = ganador;
    equipoA.appendChild(liRojo);

    const liAzul = document.createElement("li");
    liAzul.textContent = perdedor;
    equipoB.appendChild(liAzul);

    rojo.push(ganador);
    azul.push(perdedor);

    await esperar(650);
  }

  historial.unshift({
    fecha: new Date().toLocaleString("es-PE"),
    rojo,
    azul
  });

  historial = historial.slice(0, 10);

  guardar();
  renderHistorial();

  ruleta.innerText = "✅ Sorteo terminado";
});

/* ================= LIMPIAR EQUIPOS ================= */

document.getElementById("btnLimpiarEquipos").addEventListener("click", () => {
  equipoA.innerHTML = "";
  equipoB.innerHTML = "";
  ruleta.innerText = "Listo";
});

/* ================= SORTEO DE MAPAS ================= */

document.getElementById("btnSortearMapa").addEventListener("click", async () => {
  const mapas = [...document.querySelectorAll(".mapa")]
    .filter(x => x.checked)
    .map(x => x.value);

  if (mapas.length < 2) {
    alert("Selecciona al menos 2 mapas");
    return;
  }

  resultadoMapas.innerHTML = "";
  let copia = mezclar(mapas);

  ruleta.innerText = "🎲 Sorteando 1er mapa...";
  await esperar(600);

  const ganador1 = await ruletaPro(copia, 3000);
  copia = copia.filter(mapa => mapa !== ganador1);

  resultadoMapas.innerHTML = `
    <div class="mapa-ganador">🥇 1ER LUGAR: <strong>${ganador1}</strong></div>
  `;

  ruleta.innerText = "🎲 Sorteando 2do mapa...";
  await esperar(800);

  const ganador2 = await ruletaPro(copia, 3000);

  resultadoMapas.innerHTML += `
    <div class="mapa-ganador">🥈 2DO LUGAR: <strong>${ganador2}</strong></div>
  `;

  ruleta.innerText = "✅ Mapas sorteados";
});

/* ================= HISTORIAL ================= */

function renderHistorial() {
  historialDiv.innerHTML = "";

  if (historial.length === 0) {
    historialDiv.innerHTML = `<p class="ayuda">Todavía no hay sorteos guardados.</p>`;
    return;
  }

  historial.forEach(item => {
    const div = document.createElement("div");
    div.className = "historial-item";

    div.innerHTML = `
      <small>${item.fecha}</small><br>
      🟥 <strong>Rojo:</strong> ${item.rojo.join(", ")}<br>
      🟦 <strong>Azul:</strong> ${item.azul.join(", ")}
    `;

    historialDiv.appendChild(div);
  });
}

document.getElementById("btnBorrarHistorial").addEventListener("click", () => {
  if (historial.length === 0) return;

  const confirmar = confirm("¿Seguro que deseas borrar el historial?");

  if (!confirmar) return;

  historial = [];
  guardar();
  renderHistorial();
});

/* ================= INIT ================= */

guardar();
renderJugadores();
renderHistorial();
