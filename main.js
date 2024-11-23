document.addEventListener("DOMContentLoaded", function () {
  const showCategoriesButton = document.getElementById("show-categories");
  const showBalanceButton = document.getElementById("show-balance");
  const reportsButton = document.getElementById("show-reports");

  const categoriesBox = document.getElementById("categories_box");
  const sectionBalance = document.getElementById("section_box_contenedor");
  const reportsSection = document.getElementById("reports_img");
  const listReportsSection = document.getElementById("list_reports");
  const mainContent = document.getElementById("main-content");
  const sectionOperation = document.getElementById("section-operation");
  const editOperationSection = document.getElementById("edit-operation");

  // Función para ocultar todas las secciones
  function hideAllSections() {
    categoriesBox.classList.add("hidden");
    sectionBalance.classList.add("hidden");
    reportsSection.classList.add("hidden");
    listReportsSection.classList.add("hidden");
    mainContent.classList.remove("hidden");
    sectionOperation.classList.add("hidden"); // Ocultar formulario de nueva operación
    editOperationSection.classList.add("hidden"); // Asegurarse de ocultar el formulario de edición
  }

  // Evento para mostrar secciones
  function showSection(sectionToShow) {
    hideAllSections(); // Asegura que se oculten todas las secciones antes de mostrar la nueva
    sectionToShow.classList.remove("hidden"); // Mostrar la sección seleccionada
  }

  // Eventos para los botones del navbar
  showCategoriesButton.addEventListener("click", function () {
    showSection(categoriesBox); // Mostrar categorías
  });

  showBalanceButton.addEventListener("click", function () {
    showSection(sectionBalance); // Mostrar resumen de balance
  });

  reportsButton.addEventListener("click", function () {
    showSection(reportsSection); // Mostrar reportes
    listReportsSection.classList.remove("hidden"); // Mostrar listado de reportes
  });

  // Lógica para el menú hamburguesa
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  menuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  // Eventos para los botones del menú móvil
  document
    .getElementById("show-balance-mobile")
    .addEventListener("click", function () {
      showSection(sectionBalance);
      mobileMenu.classList.add("hidden"); // Ocultar menú después de hacer clic
    });

  document
    .getElementById("show-categories-mobile")
    .addEventListener("click", function () {
      showSection(categoriesBox);
      mobileMenu.classList.add("hidden");
    });

  document
    .getElementById("show-reports-mobile")
    .addEventListener("click", function () {
      showSection(reportsSection);
      listReportsSection.classList.remove("hidden");
      mobileMenu.classList.add("hidden");
    });
});
// --------------------------------------------------------------------------------------

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

  const categoriasSelectNuevaOperacion =
    document.getElementById("categories-select");
  const categoriasSelectEditarOperacion = document.getElementById(
    "edit-category-operation"
  );

  let operacionIdToDelete;
  let operacionIdEdit;
  let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

  // Cargar categorías desde localStorage o usar las por defecto
  const categoriasPorDefecto = [
    { id: "1", nombre: "Comida" },
    { id: "2", nombre: "Salidas" },
    { id: "3", nombre: "Trabajo" },
    { id: "4", nombre: "Transporte" },
    { id: "5", nombre: "Educación" },
    { id: "6", nombre: "Servicios" },
  ];

  let categorias =
    JSON.parse(localStorage.getItem("categorias")) || categoriasPorDefecto;

  // Guardar categorías en localStorage si no están almacenadas
  if (!localStorage.getItem("categorias")) {
    guardarCategoriasEnStorage();
  }

  // Guardar las operaciones corregidas en localStorage
  guardarOperacionesEnStorage();

  // Cargar las categorías en los selects
  cargarCategorias(categoriasSelectNuevaOperacion);
  cargarCategorias(categoriasSelectEditarOperacion);

  // Inicializar tabla y balance al cargar
  actualizarTablaOperaciones();
  actualizarBalance();

  // --------------------------------------------------------------------------------------------

  function actualizarResumen() {
    // Calcular el total de ganancias y gastos por categoría
    const categoriasResumen = categorias.map((categoria) => ({
      nombre: categoria.nombre,
      totalGanancias: 0,
      totalGastos: 0,
      balance: 0,
    }));

    operaciones.forEach((operacion) => {
      const categoria = categoriasResumen.find(
        (cat) => cat.nombre === operacion.categoria
      );
      if (categoria) {
        if (operacion.tipoOperacion === "ganancia") {
          categoria.totalGanancias += operacion.monto;
        } else {
          categoria.totalGastos += operacion.monto;
        }
        categoria.balance = categoria.totalGanancias - categoria.totalGastos;
      }
    });

    // Calcular el mes con mayor ganancia y el mes con mayor gasto
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    let mesMayorGanancia = { mes: "", total: 0 };
    let mesMayorGasto = { mes: "", total: 0 };

    operaciones.forEach((operacion) => {
      const fechaOperacion = new Date(operacion.fecha);
      const mes = meses[fechaOperacion.getMonth()];

      if (operacion.tipoOperacion === "ganancia") {
        if (!mesMayorGanancia[mes] || mesMayorGanancia[mes] < operacion.monto) {
          mesMayorGanancia[mes] = operacion.monto;
        }
      } else {
        if (!mesMayorGasto[mes] || mesMayorGasto[mes] < operacion.monto) {
          mesMayorGasto[mes] = operacion.monto;
        }
      }
    });

    // Buscar la categoría con la mayor ganancia y el mayor gasto
    const categoriaMayorGanancia = categoriasResumen.reduce(
      (max, categoria) =>
        categoria.totalGanancias > max.totalGanancias ? categoria : max,
      { totalGanancias: 0 }
    );

    const categoriaMayorGasto = categoriasResumen.reduce(
      (max, categoria) =>
        categoria.totalGastos > max.totalGastos ? categoria : max,
      { totalGastos: 0 }
    );

    // Mostrar el resumen en la UI
    const resumenElement = document.getElementById("reporte-resumen");
    resumenElement.innerHTML = `
      <div class="bg-gray-100 p-4 rounded-md">
        <h3 class="text-xl font-semibold mb-4">Resumen de Operaciones</h3>
        <table class="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Reporte</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Categoría / Mes</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Categoría con mayor ganancia</td>
              <td class="px-4 py-2 border border-gray-300">${
                categoriaMayorGanancia.nombre || "N/A"
              }</td>
              <td class="px-4 py-2 border border-gray-300">${(
                categoriaMayorGanancia.totalGanancias || 0
              ).toFixed(2)}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Categoría con mayor gasto</td>
              <td class="px-4 py-2 border border-gray-300">${
                categoriaMayorGasto.nombre || "N/A"
              }</td>
              <td class="px-4 py-2 border border-gray-300">${(
                categoriaMayorGasto.totalGastos || 0
              ).toFixed(2)}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Mes con mayor ganancia</td>
              <td class="px-4 py-2 border border-gray-300">${
                mesMayorGanancia.mes || "N/A"
              }</td>
              <td class="px-4 py-2 border border-gray-300">${(
                mesMayorGanancia.total || 0
              ).toFixed(2)}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Mes con mayor gasto</td>
              <td class="px-4 py-2 border border-gray-300">${
                mesMayorGasto.mes || "N/A"
              }</td>
              <td class="px-4 py-2 border border-gray-300">${(
                mesMayorGasto.total || 0
              ).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
  // -----------------------------------------------------------------------------------------------------------------------
  btnNuevaOperacion.addEventListener("click", () => {
    sectionOperation.classList.remove("hidden");
    mainContent.classList.add("hidden");
    editOperationSection.classList.add("hidden"); // Asegurarse de que el formulario de edición está oculto
  });

  btnCancelarAgregarOperacion.addEventListener("click", () => {
    sectionOperation.classList.add("hidden");
    mainContent.classList.remove("hidden");
  });

  // Botón de cancelar en el formulario de edición de operación
  document
    .getElementById("cancel-edit-operation")
    .addEventListener("click", () => {
      editOperationSection.classList.add("hidden");
      mainContent.classList.remove("hidden"); // Mostrar la sección principal
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
    actualizarResumen();
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

  function actualizarTablaOperaciones() {
    operationsTableBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

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
          "border-gray-300",
          "gap-8"
        );

        const montoClass =
          operacion.tipoOperacion === "ganancia"
            ? "text-green-500"
            : "text-red-500";

        // Crear la fila con los datos de la operación
        tr.innerHTML = `
          <td class="flex-1 text-center">${operacion.descripcion}</td>
          <td class="flex-1 text-center ${montoClass}">${(
          operacion.monto || 0
        ).toFixed(2)}</td>
          <td class="flex-1 text-center">${operacion.categoria}</td>
          <td class="flex-1 text-center">${operacion.fecha}</td>
          <td class="flex-1 text-center">
            <div class="flex justify-around">
              <button class=" px-1  rounded edit-btn" data-id="${operacion.id}">
                <i class="fas fa-edit text-yellow-600"></i>
              </button>
              <button class=" px-1 rounded delete-btn" data-id="${
                operacion.id
              }">
                <i class="fas fa-trash text-red-600"></i>
              </button>
            </div>
          </td>
        `;

        // Agregar la fila a la tabla
        operationsTableBody.appendChild(tr);
      });

      // Agregar los eventos para los botones de edición y eliminación
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
    actualizarResumen();
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

      const operacionEditada = operaciones.find(
        (op) => op.id === operacionIdEdit
      );

      if (operacionEditada) {
        operacionEditada.descripcion = descripcion;
        operacionEditada.monto = monto;
        operacionEditada.tipoOperacion = tipoOperacion;
        operacionEditada.categoria = categoria;
        operacionEditada.fecha = fecha;
      }

      guardarOperacionesEnStorage();
      actualizarTablaOperaciones();
      actualizarBalance();
      limpiarFormulario();
      actualizarResumen();
      editOperationSection.classList.add("hidden");
      mainContent.classList.remove("hidden");
    });

  // Función para cargar categorías en un <select> dado
  function cargarCategorias(selectElement) {
    if (categorias && Array.isArray(categorias)) {
      selectElement.innerHTML =
        '<option value="" disabled selected>Selecciona una categoría</option>';

      categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.nombre.toLowerCase();
        option.textContent = categoria.nombre;
        selectElement.appendChild(option);
      });
    } else {
      console.error("No se encontraron categorías en localStorage.");
    }
  }

  function guardarCategoriasEnStorage() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }
});
