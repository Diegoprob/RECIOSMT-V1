let jugadores =
JSON.parse(localStorage.getItem("rakionJugadores")) || [];

let historial =
JSON.parse(localStorage.getItem("rakionHistorial")) || [];

const listaJugadores = document.getElementById("listaJugadores");
const participantesDiv = document.getElementById("participantes");

const equipoA = document.getElementById("equipoA");
const equipoB = document.getElementById("equipoB");

const ruleta = document.getElementById("ruleta");

/* ================= GUARDAR ================= */

function guardar(){
localStorage.setItem("rakionJugadores", JSON.stringify(jugadores));
localStorage.setItem("rakionHistorial", JSON.stringify(historial));
}

/* ================= JUGADORES ================= */

function renderJugadores(){
listaJugadores.innerHTML = "";

jugadores.forEach((n,i)=>{
listaJugadores.innerHTML += `
<div class="jugador-item">
<span>${n}</span>
<button onclick="eliminar(${i})">Eliminar</button>
</div>`;
});

renderParticipantes();
}

function eliminar(i){
jugadores.splice(i,1);
guardar();
renderJugadores();
}

document.getElementById("btnAgregar").onclick = () => {
const n = document.getElementById("nuevoJugador").value;
if(!n) return;

jugadores.push(n);
guardar();
renderJugadores();

document.getElementById("nuevoJugador").value = "";
};

/* ================= PARTICIPANTES ================= */

function renderParticipantes(){
participantesDiv.innerHTML = "";

jugadores.forEach(n=>{
participantesDiv.innerHTML += `
<div class="participante">
<input type="checkbox" value="${n}">
<span>${n}</span>

<select>
<option value="">Bombo</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
</select>
</div>`;
});
}

/* ================= RULETA ================= */

function animar(lista){
return new Promise(res=>{
let i = 0;

let int = setInterval(()=>{

ruleta.innerText =
lista[Math.floor(Math.random() * lista.length)];

if(i++ > 20){
clearInterval(int);
res(ruleta.innerText);
}

},100);
});
}

/* ================= SORTEO EQUIPOS ================= */

document.getElementById("btnSortear").onclick = async () => {

equipoA.innerHTML = "";
equipoB.innerHTML = "";

document.querySelectorAll(".ultimo-sorteado")
.forEach(x => x.classList.remove("ultimo-sorteado"));

let bombos = {};

document.querySelectorAll(".participante").forEach(p=>{
if(!p.querySelector("input").checked) return;

let nombre = p.querySelector("input").value;
let b = p.querySelector("select").value;

if(!b) return;

if(!bombos[b]) bombos[b] = [];

bombos[b].push(nombre);
});

let A = [];
let B = [];

const ordenBombos = Object.keys(bombos).sort();

for(let b of ordenBombos){

let jugadoresBombo = bombos[b];

if(jugadoresBombo.length !== 2){
alert("Cada bombo debe tener 2 jugadores");
return;
}

ruleta.innerText = "🎡 Sorteando Bombo " + b;
await new Promise(r => setTimeout(r, 800));

let ganador = await animar(jugadoresBombo);
let perdedor = jugadoresBombo.find(x => x !== ganador);

A.push(ganador);
B.push(perdedor);

let liA = document.createElement("li");
liA.textContent = ganador;
liA.classList.add("ultimo-sorteado");
equipoA.appendChild(liA);

let liB = document.createElement("li");
liB.textContent = perdedor;
liB.classList.add("ultimo-sorteado");
equipoB.appendChild(liB);

await new Promise(r => setTimeout(r, 1200));
}

historial.push({
fecha: new Date().toLocaleString(),
A, B
});

guardar();
};

/* ================= MAPAS ================= */

document.getElementById("btnSortearMapa").onclick = async () => {

let seleccionados =
[...document.querySelectorAll(".mapa")]
.filter(x => x.checked)
.map(x => x.value);

if(seleccionados.length < 2){
alert("Selecciona al menos 2 mapas");
return;
}

document.getElementById("resultadoMapas").innerHTML =
"🎡 Sorteando mapas...";

await new Promise(r => setTimeout(r, 2000));

let copia = [...seleccionados];
let resultados = [];

while(copia.length > 0){
let r = copia[Math.floor(Math.random() * copia.length)];
resultados.push(r);
copia = copia.filter(x => x !== r);
}

resultados = resultados.slice(0, 2);

document.getElementById("resultadoMapas").innerHTML =
resultados.map((m, i) => `
<div class="mapa-ganador">
${i === 0 ? "🥇" : "🥈"} Lugar ${i + 1}: ${m}
</div>
`).join("");

};

/* ================= INIT ================= */

renderJugadores();
