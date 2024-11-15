const formAgregar = document.getElementById("formAgregar");
const nombrePiezaInput = document.getElementById("nombrePieza");
const cantidadPiezaInput = document.getElementById("cantidadPieza");
const inventarioCuerpo = document.getElementById("inventarioCuerpo");
const imagenPiezaInput = document.getElementById("imagenPieza");

let inventarioPiezas = JSON.parse(localStorage.getItem("inventario")) || [];

// Función para mostrar mensajes en el DOM
function mostrarMensaje(mensaje, tipo) {
  const mensajeContainer = document.createElement("div");
  mensajeContainer.className = `mensaje ${tipo}`;
  mensajeContainer.textContent = mensaje;
  document.body.appendChild(mensajeContainer);
  setTimeout(() => mensajeContainer.remove(), 3000);
}

function actualizarDOM() {
  inventarioCuerpo.innerHTML = "";
  inventarioPiezas.forEach((pieza, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${pieza.nombre}</td>
            <td>${pieza.cantidad}</td>
            <td>${pieza.marca}</td>
            <td>${pieza.modelo}</td>
            <td>${pieza.color}</td>
            <td>${pieza.serial}</td>
            <td>${pieza.precio || ""}</td>
            <td>${
              pieza.imagen
                ? `<img src="${pieza.imagen}" alt="Imagen de la pieza" width="150">`
                : ""
            }</td>
            <td>
                <button onclick="editarPieza(${index})">Editar</button>
                <button onclick="eliminarPieza(${index})">Eliminar</button>
            </td>
        `;
    inventarioCuerpo.appendChild(fila);
  });
}

function agregarPieza(
  nombre,
  cantidad,
  marca,
  modelo,
  color,
  serial,
  precio,
  imagen
) {
  if (!cantidad || cantidad <= 0) {
    mostrarMensaje("La cantidad debe ser mayor que 0.", "error");
    return;
  }

  const pieza = {
    nombre,
    cantidad,
    marca,
    modelo,
    color,
    serial,
    precio,
    imagen,
  };
  inventarioPiezas.push(pieza);
  localStorage.setItem("inventario", JSON.stringify(inventarioPiezas));
  actualizarDOM();
  mostrarMensaje("Pieza agregada correctamente", "success");
}

function eliminarPieza(index) {
  inventarioPiezas.splice(index, 1);
  localStorage.setItem("inventario", JSON.stringify(inventarioPiezas));
  actualizarDOM();
  mostrarMensaje("Pieza eliminada correctamente", "success");
}

function editarPieza(index) {
  const pieza = inventarioPiezas[index];
  nombrePiezaInput.value = pieza.nombre;
  cantidadPiezaInput.value = pieza.cantidad;
  document.getElementById("marcaPieza").value = pieza.marca;
  document.getElementById("modeloPieza").value = pieza.modelo;
  document.getElementById("colorPieza").value = pieza.color;
  document.getElementById("serialPieza").value = pieza.serial;
  document.getElementById("precioPieza").value = pieza.precio || "";

  eliminarPieza(index);
}

formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = nombrePiezaInput.value.trim();
  const cantidad = parseInt(cantidadPiezaInput.value);
  const marca = document.getElementById("marcaPieza").value.trim();
  const modelo = document.getElementById("modeloPieza").value.trim();
  const color = document.getElementById("colorPieza").value.trim();
  const serial = document.getElementById("serialPieza").value.trim();
  const precio = document.getElementById("precioPieza").value.trim();

  let imagen = null;
  if (imagenPiezaInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function () {
      imagen = reader.result;
      agregarPieza(
        nombre,
        cantidad,
        marca,
        modelo,
        color,
        serial,
        precio,
        imagen
      );
    };
    reader.readAsDataURL(imagenPiezaInput.files[0]);
  } else {
    agregarPieza(
      nombre,
      cantidad,
      marca,
      modelo,
      color,
      serial,
      precio,
      imagen
    );
  }

  formAgregar.reset();
});

actualizarDOM();
