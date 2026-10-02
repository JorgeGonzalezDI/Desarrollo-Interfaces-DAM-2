// ============================================================
// Paradigmas de JavaScript: fetch, async/await y callback clásico
// API usada: https://jsonplaceholder.typicode.com/users
// ============================================================

// -------------------- CASO 1: fetch con .then() --------------------
// El método fetch() devuelve una Promise. Con .then() encadenamos lo
// que hay que hacer cuando la respuesta llega, sin bloquear el resto
// del script mientras se espera.
function casoFetch() {
  console.log("--- CASO 1: fetch con .then() ---");
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((respuesta) => respuesta.json())
    .then((datos) => console.log("[fetch .then] JSON recibido:", datos))
    .catch((error) => console.error("[fetch .then] Error:", error));
}

// -------------------- CASO 2: fetch con async/await --------------------
// Mismo resultado que el caso anterior, pero con una sintaxis que se
// lee como código secuencial ("espera aquí a que llegue la respuesta")
// en vez de encadenar .then().
async function casoAsyncAwait() {
  console.log("--- CASO 2: fetch con async/await ---");
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    const datos = await respuesta.json();
    console.log("[async/await] JSON recibido:", datos);
  } catch (error) {
    console.error("[async/await] Error:", error);
  }
}

// -------------------- CASO 3: callback clásico (XMLHttpRequest) --------------------
// Antes de que existiera fetch, las peticiones se hacían con
// XMLHttpRequest y una función "callback" que se ejecuta cuando el
// navegador avisa de que la petición ha cambiado de estado.
function casoCallback() {
  console.log("--- CASO 3: callback clásico (XMLHttpRequest) ---");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://jsonplaceholder.typicode.com/users", true);

  // Esta función es el callback: se llama sola cada vez que cambia el
  // estado de la petición (readyState). Cuando readyState es 4 (DONE)
  // y el status es 200 (OK), ya tenemos los datos.
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const datos = JSON.parse(xhr.responseText);
      console.log("[callback clásico] JSON recibido:", datos);
    }
  };

  xhr.send();
}

// Ejecutamos los tres casos, uno detrás de otro
casoFetch();
casoAsyncAwait();
casoCallback();
