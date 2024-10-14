document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const typeFilter = document.getElementById("type-filter");
  const categoryFilter = document.getElementById("filter-category");
  const dateFilter = document.getElementById("date-filter");
  const orderFilter = document.getElementById("order-filter");
  const operationsTableBody = document.getElementById("operations-table-body");
  const noOperationsDiv = document.getElementById("no-operations");
  const addOperationsDiv = document.getElementById("add-operations");

  // Cargar operaciones desde localStorage
  let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

  // Agregar listeners para los filtros
  typeFilter.addEventListener("change", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);
  dateFilter.addEventListener("change", aplicarFiltros);
  orderFilter.addEventListener("change", aplicarFiltros);

  // Función para aplicar filtros
  function aplicarFiltros() {
    let filtradas = operaciones;

    // Filtrar por tipo
    const tipoSeleccionado = typeFilter.value;
    if (tipoSeleccionado !== "todos") {
      filtradas = filtradas.filter(
        (op) => op.tipoOperacion === tipoSeleccionado
      );
    }

    // Filtrar por categoría
    const categoriaSeleccionada = categoryFilter.value;
    if (categoriaSeleccionada !== "todas") {
      filtradas = filtradas.filter(
        (op) => op.categoria === categoriaSeleccionada
      );
    }

    // Filtrar por fecha
    const fechaSeleccionada = dateFilter.value;
    if (fechaSeleccionada) {
      filtradas = filtradas.filter(
        (op) => new Date(op.fecha) >= new Date(fechaSeleccionada)
      );
    }

    // Ordenar
    const criterioOrden = orderFilter.value;
    if (criterioOrden === "mas-recientes") {
      filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (criterioOrden === "menos-recientes") {
      filtradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (criterioOrden === "mayor-monto") {
      filtradas.sort((a, b) => b.monto - a.monto);
    } else if (criterioOrden === "menor-monto") {
      filtradas.sort((a, b) => a.monto - b.monto);
    } else if (criterioOrden === "a-z") {
      filtradas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    } else if (criterioOrden === "z-a") {
      filtradas.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
    }

    // Actualizar la tabla con las operaciones filtradas
    actualizarTablaOperaciones(filtradas);
  }

  // Función para actualizar la tabla de operaciones
  function actualizarTablaOperaciones(operacionesFiltradas) {
    operationsTableBody.innerHTML = "";

    if (operacionesFiltradas.length === 0) {
      noOperationsDiv.classList.remove("hidden");
      addOperationsDiv.classList.add("hidden");
    } else {
      noOperationsDiv.classList.add("hidden");
      addOperationsDiv.classList.remove("hidden");

      operacionesFiltradas.forEach((operacion) => {
        const tr = document.createElement("tr");
        tr.classList.add(
          "flex",
          "justify-between",
          "items-center",
          "p-2",
          "border-b",
          "border-gray-300"
        );

        tr.innerHTML = `
            <td class="flex-1 text-center">${operacion.descripcion}</td>
            <td class="flex-1 text-center">${(operacion.monto || 0).toFixed(
              2
            )}</td>
            <td class="flex-1 text-center">${operacion.categoria}</td>
            <td class="flex-1 text-center">${operacion.fecha}</td>
            <td class="flex-1 text-center">
              <div class="flex justify-around">
                <button class="bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-id="${
                  operacion.id
                }">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="bg-red-500 text-white px-2 py-1 rounded delete-btn" data-id="${
                  operacion.id
                }">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          `;

        operationsTableBody.appendChild(tr);
      });

      // Agregar listeners a los botones de eliminar y editar
      agregarListenersBotones();
    }
  }

  // Función para agregar listeners a botones de editar y eliminar
  function agregarListenersBotones() {
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", mostrarModalEliminar);
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", editarOperacion);
    });
  }

  // Función para mostrar el modal de eliminar
  function mostrarModalEliminar(event) {
    const operacionId = event.target.getAttribute("data-id");
    // Lógica para mostrar el modal de eliminación
    console.log("Eliminar operación con ID:", operacionId);
  }

  // Función para editar la operación
  function editarOperacion(event) {
    const operacionId = event.target.getAttribute("data-id");

    console.log("Editar operación con ID:", operacionId);
  }
});
