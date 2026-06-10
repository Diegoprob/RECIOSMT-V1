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

/* ================= ANIMACIÓN RULETA PRO ================= */

function ruletaPro(opciones){
return new Promise(res=>{

let velocidad = 50;
let tiempo = 0;
let max = 30;

let intervalo = setInterval(()=>{

ruleta.innerText =
opciones[Math.floor(Math.random()*opciones.length)];

tiempo++;

if(tiempo > 10) velocidad += 20;

if(tiempo > max){
clearInterval(intervalo);
res(ruleta.innerText);
}

}, velocidad);

});
}

/* ================= SORTEO EQUIPOS ================= */

document.getElementById("btnSortear").onclick = async () => {

equipoA.innerHTML = "";
equipoB.innerHTML = "";

let bombos = {};

/* recoger jugadores activos */
document.querySelectorAll(".jugador-card").forEach(p=>{

let activo = p.querySelector(".activo").checked;
if(!activo) return;

let nombre = p.dataset.name;
let bombo = p.querySelector(".bombo").value;

if(!bombo) return;

if(!bombos[bombo]) bombos[bombo] = [];

bombos[bombo].push(nombre);
});

/* validar */
for(let b in bombos){
if(bombos[b].length !== 2){
alert("Cada bombo debe tener EXACTAMENTE 2 jugadores");
return;
}
}

let A = [];
let B = [];

/* sorteo animado por bombo */
for(let b of Object.keys(bombos)){

ruleta.innerText = "🎡 Bombo " + b;
await new Promise(r => setTimeout(r, 800));

let grupo = bombos[b];

let ganador = await ruletaPro(grupo);
let perdedor = grupo.find(x => x !== ganador);

/* animación salida */
await mostrarResultado(ganador, perdedor);

A.push(ganador);
B.push(perdedor);
}

/* guardar historial */
historial.push({
fecha: new Date().toLocaleString(),
A, B
});

guardar();

};

/* ================= RESULTADO EN VIVO ================= */

function mostrarResultado(ganador, perdedor){
return new Promise(res=>{

let liA = document.createElement("li");
liA.textContent = "🏆 " + ganador;
liA.style.color = "#00ffcc";
equipoA.appendChild(liA);

let liB = document.createElement("li");
liB.textContent = "❌ " + perdedor;
liB.style.color = "#ff4d4d";
equipoB.appendChild(liB);

/* efecto de pausa emocional */
setTimeout(res, 900);

});
}

/* ================= MAPAS PRO ================= */

document.getElementById("btnSortearMapa").onclick = async () => {

let mapas =
[...document.querySelectorAll(".mapa")]
.filter(x=>x.checked)
.map(x=>x.value);

if(mapas.length < 2){
alert("Selecciona al menos 2 mapas");
return;
}

document.getElementById("resultadoMapas").innerHTML =
"🎡 Iniciando sorteo de mapas...";

await new Promise(r => setTimeout(r, 1500));

let copia = [...mapas];
let resultados = [];

/* animación eliminación */
while(copia.length){

let r = copia[Math.floor(Math.random()*copia.length)];
resultados.push(r);
copia = copia.filter(x=>x!==r);

await new Promise(r=>setTimeout(r, 600));
}

/* mostrar solo top 3 */
resultados = resultados.slice(0,3);

document.getElementById("resultadoMapas").innerHTML =
resultados.map((m,i)=>`
<div class="mapa-ganador">
${i===0?"🥇":i===1?"🥈":"🥉"} ${m}
</div>
`).join("");

};

/* ================= INIT ================= */

renderJugadores();
