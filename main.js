// botones del navbar

document.addEventListener("DOMContentLoaded", function () {
  const showCategoriesButton = document.getElementById("show-categories");
  const showBalanceButton = document.getElementById("show-balance");
  const reportsButton = document.getElementById("show-reports");

  const categoriesBox = document.getElementById("categiries_box");
  const sectionBalance = document.getElementById("section-balance");
  const reportsSection = document.getElementById("reports_img");
  const listReportsSection = document.getElementById("list_reports");
  const mainContent = document.getElementById("main-content");

  // Función para ocultar todas las secciones
  function hideAllSections() {
    categoriesBox.classList.add("hidden");
    sectionBalance.classList.add("hidden");
    reportsSection.classList.add("hidden");
    listReportsSection.classList.add("hidden");
    mainContent.classList.remove("hidden");
  }

  // Evento para mostrar secciones
  function showSection(sectionToShow) {
    hideAllSections();
    sectionToShow.classList.remove("hidden");
  }

  // Evento para mostrar categorías
  showCategoriesButton.addEventListener("click", function () {
    showSection(categoriesBox);
  });

  // Evento para mostrar balance
  showBalanceButton.addEventListener("click", function () {
    showSection(sectionBalance);
  });

  // Evento para mostrar reportes
  reportsButton.addEventListener("click", function () {
    showSection(reportsSection);
    listReportsSection.classList.remove("hidden"); // Mostrar listado de reportes
  });
});
// ------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnNuevaOperacion = document.getElementById("show-operation");
  const sectionOperation = document.getElementById("section-operation");
  const btnCancelarAgregarOperacion = document.getElementById(
    "cancelar-agregar-operaciones-boton"
  );
  const btnAgregarOperacion = document.getElementById(
    "agregar-operaciones-boton"
  );
  const operationsTableBody = document.getElementById("operations-table-body");
  const noOperationsDiv = document.getElementById("no-operations");
  const addOperationsDiv = document.getElementById("add-operations");
  const editOperationSection = document.getElementById("edit-operation");
  const mainContent = document.getElementById("main-content");

  // Elementos para el balance
  const gananciasElement = document.getElementById("ganancias");
  const gastosElement = document.getElementById("gastos");
  const balanceTotalElement = document.getElementById("balance-total");

  let operacionIdToDelete;
  let operacionIdEdit;
  let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

  // Asegurarse de que todas las operaciones tengan un campo id
  operaciones = operaciones.map((op) => {
    if (!op.id) {
      return {
        ...op,
        id: Date.now().toString() + Math.random().toString(36).substring(2),
      };
    }
    return op;
  });

  // Guardar las operaciones corregidas en localStorage
  guardarOperacionesEnStorage();

  // Inicializar tabla y balance al cargar
  actualizarTablaOperaciones();
  actualizarBalance();

  btnNuevaOperacion.addEventListener("click", () => {
    sectionOperation.classList.remove("hidden");
    mainContent.classList.add("hidden");
    editOperationSection.classList.add("hidden");
  });

  btnCancelarAgregarOperacion.addEventListener("click", () => {
    sectionOperation.classList.add("hidden");
    mainContent.classList.remove("hidden");
  });

  btnAgregarOperacion.addEventListener("click", (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("description-input").value;
    const monto = parseFloat(document.getElementById("monto-input").value);
    const tipoOperacion = document.getElementById("tipo-operacion").value;
    const categoria = document.getElementById("categories-select").value;
    const fecha = document.getElementById("date-operation").value;

    // Validar que la fecha no sea futura
    const fechaOperacion = new Date(fecha);
    const fechaActual = new Date();

    if (fechaOperacion > fechaActual) {
      alert("La fecha no puede ser superior a la fecha actual.");
      return; // Salir de la función si la fecha es futura
    }

    const nuevaOperacion = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      descripcion,
      monto,
      tipoOperacion,
      categoria,
      fecha,
    };

    operaciones.push(nuevaOperacion);
    guardarOperacionesEnStorage();
    actualizarTablaOperaciones();
    limpiarFormulario();
    sectionOperation.classList.add("hidden");
    mainContent.classList.remove("hidden");
    actualizarBalance();
  });

  function guardarOperacionesEnStorage() {
    localStorage.setItem("operaciones", JSON.stringify(operaciones));
  }

  function actualizarBalance() {
    let totalGanancias = 0;
    let totalGastos = 0;

    operaciones.forEach((op) => {
      if (op.tipoOperacion === "ganancia") {
        totalGanancias += op.monto;
      } else {
        totalGastos += op.monto;
      }
    });

    const totalBalance = totalGanancias - totalGastos;

    gananciasElement.textContent = totalGanancias.toFixed(2);
    gastosElement.textContent = totalGastos.toFixed(2);
    balanceTotalElement.textContent = totalBalance.toFixed(2);
  }

  function limpiarFormulario() {
    document.getElementById("description-input").value = "";
    document.getElementById("monto-input").value = "";
    document.getElementById("tipo-operacion").value = "";
    document.getElementById("categories-select").value = "";
    document.getElementById("date-operation").value = "";
  }
  function actualizarBalance() {
    let totalGanancias = 0;
    let totalGastos = 0;

    operaciones.forEach((op) => {
      if (op.tipoOperacion === "ganancia") {
        totalGanancias += op.monto || 0; // Asigna 0 si monto es null
      } else {
        totalGastos += op.monto || 0; // Asigna 0 si monto es null
      }
    });

    const totalBalance = totalGanancias - totalGastos;

    gananciasElement.textContent = totalGanancias.toFixed(2);
    gastosElement.textContent = totalGastos.toFixed(2);
    balanceTotalElement.textContent = totalBalance.toFixed(2);
  }

  function actualizarTablaOperaciones() {
    operationsTableBody.innerHTML = "";

    if (operaciones.length === 0) {
      noOperationsDiv.classList.remove("hidden");
      addOperationsDiv.classList.add("hidden");
    } else {
      noOperationsDiv.classList.add("hidden");
      addOperationsDiv.classList.remove("hidden");

      operaciones.forEach((operacion) => {
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

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", mostrarModalEliminar);
      });

      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", editarOperacion);
      });
    }
  }

  function mostrarModalEliminar(event) {
    operacionIdToDelete = event.target.closest("button").dataset.id;
    document.getElementById("delete-modal").classList.remove("hidden");
  }

  document
    .getElementById("cancel-delete-button")
    .addEventListener("click", () => {
      document.getElementById("delete-modal").classList.add("hidden");
    });

  document
    .getElementById("confirm-delete-button")
    .addEventListener("click", () => {
      if (operacionIdToDelete) {
        borrarOperacion(operacionIdToDelete);
        document.getElementById("delete-modal").classList.add("hidden");
      }
    });

  function borrarOperacion(id) {
    operaciones = operaciones.filter((operacion) => operacion.id !== id);
    guardarOperacionesEnStorage(); // Guardar cambios en localStorage
    actualizarTablaOperaciones();
    actualizarBalance();
  }

  function editarOperacion(event) {
    operacionIdEdit = event.target.closest("button").dataset.id; // Obtener el ID del botón
    const operacion = operaciones.find((op) => op.id === operacionIdEdit);

    if (!operacion) {
      console.error(`Operación con ID ${operacionIdEdit} no encontrada`);
      return;
    }

    document.getElementById("edit-description-operation").value =
      operacion.descripcion;
    document.getElementById("edit-operation-amount").value = operacion.monto;
    document.getElementById("edit-type-operation").value =
      operacion.tipoOperacion;
    document.getElementById("edit-category-operation").value =
      operacion.categoria;
    document.getElementById("edit-date-operation").value = operacion.fecha;

    editOperationSection.classList.remove("hidden");
    mainContent.classList.add("hidden");
  }

  document
    .querySelector(".save-edit-operation")
    .addEventListener("click", (e) => {
      e.preventDefault();

      const descripcion = document.getElementById(
        "edit-description-operation"
      ).value;
      const monto = parseFloat(
        document.getElementById("edit-operation-amount").value
      );
      const tipoOperacion = document.getElementById(
        "edit-type-operation"
      ).value;
      const categoria = document.getElementById(
        "edit-category-operation"
      ).value;
      const fecha = document.getElementById("edit-date-operation").value;

      const operacionEditada = {
        id: operacionIdEdit,
        descripcion,
        monto,
        tipoOperacion,
        categoria,
        fecha,
      };

      operaciones = operaciones.map((op) =>
        op.id === operacionIdEdit ? operacionEditada : op
      );
      guardarOperacionesEnStorage(); // Guardar cambios en el localStorage
      actualizarTablaOperaciones();
      editOperationSection.classList.add("hidden");
      mainContent.classList.remove("hidden");
      actualizarBalance();
    });

  document
    .getElementById("cancel-edit-button")
    .addEventListener("click", () => {
      editOperationSection.classList.add("hidden");
      mainContent.classList.remove("hidden");
      limpiarFormularioEdicion();
    });

  function limpiarFormularioEdicion() {
    document.getElementById("edit-description-operation").value = "";
    document.getElementById("edit-operation-amount").value = "";
    document.getElementById("edit-type-operation").value = "";
    document.getElementById("edit-category-operation").value = "";
    document.getElementById("edit-date-operation").value = "";
  }
});
