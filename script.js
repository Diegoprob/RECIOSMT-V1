let jugadores =
JSON.parse(localStorage.getItem("rakionJugadores")) || [];

let historial =
JSON.parse(localStorage.getItem("rakionHistorial")) || [];

const listaJugadores = document.getElementById("listaJugadores");
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

/* ================= SORTEO ================= */

document.getElementById("btnSortear").onclick = async () => {

equipoA.innerHTML = "";
equipoB.innerHTML = "";

document.querySelectorAll(".ultimo-sorteado")
.forEach(x => x.classList.remove("ultimo-sorteado"));

/* 👇 NUEVO SISTEMA SIMPLIFICADO */
let bombos = {};

document.querySelectorAll(".jugador-select").forEach(div=>{

let activo = div.querySelector("input").checked;
if(!activo) return;

let nombre = div.dataset.name;
let bombo = div.querySelector("select").value;

if(!bombo) return;

if(!bombos[bombo]) bombos[bombo] = [];

bombos[bombo].push(nombre);
});

let A = [];
let B = [];

for(let b in bombos){

let grupo = bombos[b];

if(grupo.length !== 2){
alert("Cada bombo debe tener exactamente 2 jugadores");
return;
}

ruleta.innerText = "🎡 Sorteando Bombo " + b;
await new Promise(r => setTimeout(r, 800));

let ganador = await animar(grupo);
let perdedor = grupo.find(x => x !== ganador);

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

/* ================= RENDER NUEVO ================= */

function renderJugadores(){
listaJugadores.innerHTML = "";

jugadores.forEach(n=>{
listaJugadores.innerHTML += `
<div class="jugador-select" data-name="${n}">
<input type="checkbox">
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

renderJugadores();
