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

jugadores.forEach(n=>{
listaJugadores.innerHTML += `
<div class="jugador-card" data-name="${n}">
<input type="checkbox" class="activo">
<span>${n}</span>

<select class="bombo">
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

/* ================= RULETA EQUIPOS ================= */

function ruletaPro(lista){
return new Promise(res=>{
let i = 0;
let intervalo = setInterval(()=>{

ruleta.innerText =
lista[Math.floor(Math.random()*lista.length)];

i++;
if(i > 25){
clearInterval(intervalo);
res(ruleta.innerText);
}

}, 80);
});
}

/* ================= SORTEO EQUIPOS ================= */

document.getElementById("btnSortear").onclick = async () => {

equipoA.innerHTML = "";
equipoB.innerHTML = "";

let bombos = {};

document.querySelectorAll(".jugador-card").forEach(p=>{

let activo = p.querySelector(".activo").checked;
if(!activo) return;

let nombre = p.dataset.name;
let bombo = p.querySelector(".bombo").value;

if(!bombo) return;

if(!bombos[bombo]) bombos[bombo] = [];

bombos[bombo].push(nombre);
});

for(let b in bombos){

if(bombos[b].length !== 2){
alert("Cada bombo debe tener EXACTAMENTE 2 jugadores");
return;
}

ruleta.innerText = "🎡 Bombo " + b;
await new Promise(r => setTimeout(r, 800));

let grupo = bombos[b];

let ganador = await ruletaPro(grupo);
let perdedor = grupo.find(x => x !== ganador);

/* SOLO efecto simple (sin texto en cada jugador) */
let liA = document.createElement("li");
liA.textContent = ganador;
equipoA.appendChild(liA);

let liB = document.createElement("li");
liB.textContent = perdedor;
equipoB.appendChild(liB);

await new Promise(r => setTimeout(r, 900));
}

historial.push({
fecha: new Date().toLocaleString(),
A: [],
B: []
});

guardar();
};

/* ================= MAPAS PRO (ARREGLADO VISUAL) ================= */

document.getElementById("btnSortearMapa").onclick = async () => {

let mapas =
[...document.querySelectorAll(".mapa")]
.filter(x => x.checked)
.map(x => x.value);

if(mapas.length < 2){
alert("Selecciona al menos 2 mapas");
return;
}

let copia = [...mapas];

/* ================= 1ER LUGAR (3s visual) ================= */

let ganador1 = "";

let t1 = setInterval(()=>{
ruleta.innerText =
copia[Math.floor(Math.random()*copia.length)];
}, 100);

await new Promise(r => setTimeout(r, 3000));
clearInterval(t1);

ganador1 = ruleta.innerText;

/* eliminar ganador */
copia = copia.filter(x => x !== ganador1);

document.getElementById("resultadoMapas").innerHTML =
`🥇 1ER LUGAR: ${ganador1}`;

/* ================= 2DO LUGAR (3s visual) ================= */

let t2 = setInterval(()=>{
ruleta.innerText =
copia[Math.floor(Math.random()*copia.length)];
}, 100);

await new Promise(r => setTimeout(r, 3000));
clearInterval(t2);

let ganador2 = ruleta.innerText;

document.getElementById("resultadoMapas").innerHTML +=
`<br>🥈 2DO LUGAR: ${ganador2}`;

};

/* ================= INIT ================= */

renderJugadores();
renderJugadores();
