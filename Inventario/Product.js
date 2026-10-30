
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const tabla = document.getElementById("tablaProductos");
const sinResultados = document.getElementById("sinResultados");

function cargarCategorias() {
  const categorias = [...new Set(
    productos.map(p => p.categoria)
  )].sort();

  categorias.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    filtroCategoria.appendChild(opcion);
  });
}

function actualizarResumen() {
  document.getElementById("totalProductos").textContent =
    productos.length;

  document.getElementById("totalUnidades").textContent =
    productos.reduce((total, p) => total + p.cantidad, 0);

  document.getElementById("agotados").textContent =
    productos.filter(p => p.cantidad === 0).length;
}

function obtenerEstado(cantidad) {
  if (cantidad === 0) {
    return {
      texto: "Agotado",
      clase: "agotado"
    };
  }

  if (cantidad <= 5) {
    return {
      texto: "Stock bajo",
      clase: "bajo"
    };
  }

  return {
    texto: "Disponible",
    clase: "disponible"
  };
}

function mostrarProductos() {
  const texto = buscador.value.toLowerCase().trim();
  const categoria = filtroCategoria.value;

  const resultados = productos.filter(p => {
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto);

    const coincideCategoria =
      categoria === "" || p.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });

  tabla.innerHTML = "";

  resultados.forEach(p => {
    const estado = obtenerEstado(p.cantidad);

    const fila = document.createElement("tr");

    [
      p.codigo,
      p.nombre,
      p.categoria,
      `${p.cantidad} piezas`
    ].forEach((valor, indice) => {
      const celda = document.createElement("td");
      celda.textContent = valor;

      if (indice === 0) celda.className = "codigo";
      if (indice === 3) celda.className = "cantidad";

      fila.appendChild(celda);
    });

    const celdaEstado = document.createElement("td");
    const etiqueta = document.createElement("span");

    etiqueta.className = `estado ${estado.clase}`;
    etiqueta.textContent = estado.texto;

    celdaEstado.appendChild(etiqueta);
    fila.appendChild(celdaEstado);

    tabla.appendChild(fila);
  });

  sinResultados.hidden = resultados.length > 0;
}

buscador.addEventListener("input", mostrarProductos);
filtroCategoria.addEventListener("change", mostrarProductos);

cargarCategorias();
actualizarResumen();
mostrarProductos();
