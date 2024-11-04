const cuerpoCompras = document.getElementById('cuerpoCompras');
const cuerpoCarrito = document.getElementById('cuerpoCarrito');
const comprarButton = document.getElementById('comprarButton');
const totalCarrito = document.getElementById('totalCarrito');

let inventarioPiezas = JSON.parse(localStorage.getItem('inventario')) || [];
let carrito = [];

function actualizarDOMCompras() {
  cuerpoCompras.innerHTML = '';

  inventarioPiezas.forEach((pieza, index) => {
    if (pieza.cantidad > 0) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
  <td>${pieza.nombre}</td>
  <td>${pieza.cantidad}</td>
  <td>${pieza.marca}</td>
  <td>${pieza.modelo}</td>
  <td>${pieza.color}</td>
  <td>${pieza.serial}</td>
  <td>${pieza.imagen ? `<img src="${pieza.imagen}" alt="Imagen de la pieza" style="width: 50px;">` : ''}</td>
  <td>
    <button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
  </td>
`;
      cuerpoCompras.appendChild(fila);
    }
  });
}

function agregarAlCarrito(index) {
  const pieza = inventarioPiezas[index];
  

  const existente = carrito.find(item => item.nombre === pieza.nombre);
  
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...pieza, cantidad: 1 }); 
  }

  
  pieza.cantidad -= 1;

  localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
  actualizarDOMCompras();
  actualizarDOMCarrito();
}


function actualizarDOMCarrito() {
  cuerpoCarrito.innerHTML = '';
  
  let total = 0; 

  carrito.forEach((item, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>
        <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </td>
    `;

    cuerpoCarrito.appendChild(fila);

    total += item.cantidad * (item.precio || 0); 
  });

  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
  const item = carrito[index];

  const inventarioItem = inventarioPiezas.find(p => p.nombre === item.nombre);
  inventarioItem.cantidad += item.cantidad;
  
  carrito.splice(index, 1);
  localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
  
  actualizarDOMCompras();
  actualizarDOMCarrito();
}

comprarButton.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  alert("Compra realizada con éxito!");
  totalCarrito.textContent = 'Total: $0'; 
  actualizarDOMCarrito();
});

actualizarDOMCompras();