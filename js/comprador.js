const cuerpoCompras = document.getElementById("cuerpoCompras");
const cuerpoCarrito = document.getElementById("cuerpoCarrito");
const comprarButton = document.getElementById("comprarButton");
const totalCarrito = document.getElementById("totalCarrito");
const modalPago = document.getElementById("modalPago");
const closeModal = document.getElementById("closeModal");
const formPago = document.getElementById("formPago");

let inventarioPiezas = JSON.parse(localStorage.getItem("inventario")) || [];
let carrito = [];

function actualizarDOMCompras() {
  cuerpoCompras.innerHTML = "";

  inventarioPiezas.forEach((pieza, index) => {
    if (pieza.cantidad > 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${pieza.nombre}</td>
                <td>${pieza.marca}</td>
                <td>${pieza.modelo}</td>
                <td>${pieza.color}</td>
                <td>${pieza.serial}</td>
                <td>$${pieza.precio || "N/A"}</td>
                <td>${
                  pieza.imagen
                    ? `<img src="${pieza.imagen}" alt="Imagen de la pieza" style="width: 100px;">`
                    : ""
                }</td>
                <td><button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button></td>
            `;
      cuerpoCompras.appendChild(fila);
    }
  });
}

function agregarAlCarrito(index) {
  const pieza = inventarioPiezas[index];
  if (pieza.cantidad <= 0) {
    mostrarMensaje("No hay suficiente stock disponible.", "error");
    return;
  }

  const existente = carrito.find((item) => item.nombre === pieza.nombre);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...pieza, cantidad: 1 });
  }

  pieza.cantidad -= 1;
  localStorage.setItem("inventario", JSON.stringify(inventarioPiezas));
  actualizarDOMCompras();
  actualizarDOMCarrito();
}

function actualizarDOMCarrito() {
  cuerpoCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
        `;
    cuerpoCarrito.appendChild(fila);
    total += item.cantidad * (item.precio || 0);
  });

  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
  const item = carrito[index];
  const inventarioItem = inventarioPiezas.find((p) => p.nombre === item.nombre);

  if (inventarioItem) {
    inventarioItem.cantidad += item.cantidad;
  }

  carrito.splice(index, 1);
  localStorage.setItem("inventario", JSON.stringify(inventarioPiezas));
  actualizarDOMCompras();
  actualizarDOMCarrito();
}

comprarButton.addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarMensaje(
      "El carrito está vacío. Agrega productos antes de comprar.",
      "error"
    );
    return;
  }

  modalPago.style.display = "block"; // Muestra el modal
});

// Cierra el modal al hacer clic en la "x"
closeModal.addEventListener("click", () => {
  modalPago.style.display = "none";
});

// Procesa el formulario de pago
formPago.addEventListener("submit", (e) => {
  e.preventDefault();

  // Oculta el modal
  modalPago.style.display = "none";

  // Vacía el carrito
  carrito = [];
  actualizarDOMCarrito();

  // Muestra el mensaje de compra realizada
  mostrarMensaje("¡Compra realizada con éxito!", "success");
});

// Cierra el modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target === modalPago) {
    modalPago.style.display = "none";
  }
});

function mostrarMensaje(mensaje, tipo) {
  const mensajeContainer = document.createElement("div");
  mensajeContainer.className = `mensaje ${tipo}`;
  mensajeContainer.textContent = mensaje;
  document.body.appendChild(mensajeContainer);
  setTimeout(() => mensajeContainer.remove(), 3000);
}

window.addEventListener("storage", (event) => {
  if (event.key === "inventario") {
    inventarioPiezas = JSON.parse(event.newValue) || [];
    actualizarDOMCompras();
  }
});

actualizarDOMCompras();
actualizarDOMCarrito();
