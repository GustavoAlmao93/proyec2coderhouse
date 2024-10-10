const formAgregar = document.getElementById('formAgregar');
const nombrePiezaInput = document.getElementById('nombrePieza');
const cantidadPiezaInput = document.getElementById('cantidadPieza');
const inventarioCuerpo = document.getElementById('inventarioCuerpo');


let inventarioPiezas = JSON.parse(localStorage.getItem('inventario')) || [];

function actualizarDOM() {
  inventarioCuerpo.innerHTML = '';

  inventarioPiezas.forEach((pieza, index) => {
    const fila = document.createElement('tr');
    
    fila.innerHTML = `
      <td>${pieza.nombre}</td>
      <td>${pieza.cantidad}</td>
      <td>
        <button class="btn-añadir" onclick="añadirCantidad(${index})">Añadir</button>
        <button class="btn-quitar" onclick="quitarCantidad(${index})">Quitar</button>
        <button class="btn-eliminar" onclick="eliminarPieza(${index})">Eliminar</button>
      </td>
    `;
    
    inventarioCuerpo.appendChild(fila);
  });
}


function agregarPieza(nombre, cantidad) {
  const piezaExistente = inventarioPiezas.find(pieza => pieza.nombre === nombre);

  if (piezaExistente) {
    
    piezaExistente.cantidad += cantidad;
  } else {
    
    inventarioPiezas.push({ nombre, cantidad });
  }

  localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
  actualizarDOM(); 
}

function eliminarPieza(index) {
  inventarioPiezas = inventarioPiezas.filter((_, i) => i !== index); 
  localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
  actualizarDOM(); 
}

function añadirCantidad(index) {
  inventarioPiezas[index].cantidad += 1; 
  localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
  actualizarDOM(); 
}

function quitarCantidad(index) {
  if (inventarioPiezas[index].cantidad > 0) { 
    inventarioPiezas[index].cantidad -= 1;
    localStorage.setItem('inventario', JSON.stringify(inventarioPiezas));
    actualizarDOM(); 
  }
}

formAgregar.addEventListener('submit', (e) => {
  e.preventDefault(); 
  
  const nombre = nombrePiezaInput.value; 
  const cantidad = parseInt(cantidadPiezaInput.value);
  
  if (isNaN(cantidad) || cantidad <= 0) {
    alert('Por favor, introduce una cantidad válida.');
    return;
  }
  
  agregarPieza(nombre, cantidad); 
  
  nombrePiezaInput.value = '';
  cantidadPiezaInput.value = '';
});

actualizarDOM();
