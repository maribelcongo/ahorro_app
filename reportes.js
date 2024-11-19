document.addEventListener("DOMContentLoaded", () => {
  let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];
  actualizarResumen(); // Actualiza el resumen al cargar la página

  // Evento para mostrar reportes
  const btnShowReports = document.getElementById("show-reports");
  btnShowReports.addEventListener("click", () => {
    actualizarResumen(); // Actualiza el resumen al hacer clic
    const reportSection = document.getElementById("report-section");
    reportSection.classList.remove("hidden"); // Muestra la sección de reportes
  });

  // Función para agregar una nueva operación
  function agregarOperacion() {
    const tipoOperacion = document.getElementById("tipo-operacion").value;
    const categoria = document.getElementById("categories-select").value;
    const monto = parseFloat(document.getElementById("monto-input").value);
    const fechaInput = document.getElementById("date-operation").value;

    const fechaSeleccionada = fechaInput ? new Date(fechaInput) : new Date();
    const hoy = new Date();

    if (fechaSeleccionada > hoy) {
      alert("La fecha seleccionada no puede ser mayor que el día actual.");
      return;
    }

    const nuevaOperacion = {
      tipoOperacion,
      categoria,
      monto,
      fecha: fechaSeleccionada.toISOString(),
    };

    operaciones.push(nuevaOperacion);
    localStorage.setItem("operaciones", JSON.stringify(operaciones)); // Guardar operaciones en localStorage

    actualizarResumen();
  }

  // Función para actualizar el resumen
  function actualizarResumen() {
    const categoriaGanancia = obtenerCategoriaMayorGanancia();
    const categoriaGasto = obtenerCategoriaMayorGasto();
    const categoriaBalance = obtenerCategoriaMayorBalance();
    const mesMayorGanancia = obtenerMesMayorGanancia();
    const mesMayorGasto = obtenerMesMayorGasto();

    const hayReportes =
      categoriaGanancia.total > 0 ||
      categoriaGasto.total > 0 ||
      mesMayorGanancia.total > 0 ||
      mesMayorGasto.total > 0;

    // Muestra u oculta las secciones según haya reportes
    const reportsImg = document.getElementById("reports_img");
    const listReports = document.getElementById("list_reports");

    if (hayReportes) {
      reportsImg.classList.add("hidden");
      listReports.classList.remove("hidden");

      document.getElementById("reporte-resumen").innerHTML = `
        <div class="bg-gray-100 p-4 rounded-md">
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
                  categoriaGanancia.nombre || "N/A"
                }</td>
                <td class="px-4 py-2 border border-gray-300">${(
                  categoriaGanancia.total || 0
                ).toFixed(2)}</td>
              </tr>
              <tr>
                <td class="px-4 py-2 border border-gray-300">Categoría con mayor gasto</td>
                <td class="px-4 py-2 border border-gray-300">${
                  categoriaGasto.nombre || "N/A"
                }</td>
                <td class="px-4 py-2 border border-gray-300">${(
                  categoriaGasto.total || 0
                ).toFixed(2)}</td>
              </tr>
              <tr>
                <td class="px-4 py-2 border border-gray-300">Categoría con mayor balance</td>
                <td class="px-4 py-2 border border-gray-300">${
                  categoriaBalance.nombre || "N/A"
                }</td>
                <td class="px-4 py-2 border border-gray-300">${(
                  categoriaBalance.balance || 0
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
      totalesPorCategorias();
      totalesPorMes();
    } else {
      reportsImg.classList.remove("hidden");
      listReports.classList.add("hidden");
      document.getElementById("reporte-resumen").innerHTML = ""; // Limpia el resumen
    }
  }

  // Totales por Categorías
  function totalesPorCategorias() {
    const categorias = {};
    operaciones.forEach((op) => {
      if (!categorias[op.categoria]) {
        categorias[op.categoria] = { ganancias: 0, gastos: 0 };
      }
      if (op.tipoOperacion === "ganancia") {
        categorias[op.categoria].ganancias += op.monto;
      } else {
        categorias[op.categoria].gastos += op.monto;
      }
    });

    const balancePorCategoria = Object.keys(categorias).map((categoria) => ({
      nombre: categoria,
      ganancias: categorias[categoria].ganancias,
      gastos: categorias[categoria].gastos,
      balance: categorias[categoria].ganancias - categorias[categoria].gastos,
    }));

    mostrarTotalesPorCategorias(balancePorCategoria);
  }

  // Mostrar Totales por Categorías
  function mostrarTotalesPorCategorias(totales) {
    const tablaCategorias = `
      <div class="bg-gray-100 p-4 rounded-md mt-4">
        <h2 class="font-semibold">Totales por Categoría</h2>
        <table class="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Categoría</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Ganancias</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Gastos</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${totales
              .map(
                (c) => `
              <tr>
                <td class="px-4 py-2 border border-gray-300">${c.nombre}</td>
                <td class="px-4 py-2 border border-gray-300 ${
                  c.ganancias >= 0 ? "text-green-500" : ""
                }">${c.ganancias.toFixed(2)}</td>
                <td class="px-4 py-2 border border-gray-300 ${
                  c.gastos >= 0 ? "text-red-500" : ""
                }">${c.gastos.toFixed(2)}</td>
                <td class="px-4 py-2 border border-gray-300 ${
                  c.balance >= 0 ? "text-green-500" : "text-red-500"
                }">${c.balance.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    document.getElementById("totales-categorias").innerHTML = tablaCategorias;
  }

  // Totales por Mes
  function totalesPorMes() {
    const meses = {};
    operaciones.forEach((op) => {
      const fecha = new Date(op.fecha);
      const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      if (!meses[mes]) {
        meses[mes] = { ganancias: 0, gastos: 0 };
      }
      if (op.tipoOperacion === "ganancia") {
        meses[mes].ganancias += op.monto;
      } else {
        meses[mes].gastos += op.monto;
      }
    });

    const totalesPorMesArray = Object.keys(meses).map((mes) => ({
      mes: mes,
      ganancias: meses[mes].ganancias,
      gastos: meses[mes].gastos,
      balance: meses[mes].ganancias - meses[mes].gastos,
    }));

    mostrarTotalesPorMes(totalesPorMesArray);
  }

  // Mostrar Totales por Mes
  function mostrarTotalesPorMes(totales) {
    const contenedor = document.getElementById("totales-meses");
    const tablaMeses = `
      <div class="bg-gray-100 p-4 rounded-md mt-4">
        <h2 class="font-semibold">Totales por Mes</h2>
        <table class="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Mes</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Ganancias</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Gastos</th>
              <th class="px-4 py-2 border border-gray-300 text-left font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${totales
              .map(
                (m) => `
              <tr>
                <td class="px-4 py-2 border border-gray-300">${m.mes}</td>
                <td class="px-4 py-2 border border-gray-300">${m.ganancias.toFixed(
                  2
                )}</td>
                <td class="px-4 py-2 border border-gray-300">${m.gastos.toFixed(
                  2
                )}</td>
                <td class="px-4 py-2 border border-gray-300">${m.balance.toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    contenedor.innerHTML = tablaMeses;
  }

  // Funciones para obtener los reportes más importantes
  function obtenerCategoriaMayorGanancia() {
    const categorias = {};
    operaciones.forEach((op) => {
      if (op.tipoOperacion === "ganancia") {
        if (!categorias[op.categoria]) {
          categorias[op.categoria] = 0;
        }
        categorias[op.categoria] += op.monto;
      }
    });

    let maxCategoria = { nombre: "", total: 0 };
    for (const categoria in categorias) {
      if (categorias[categoria] > maxCategoria.total) {
        maxCategoria = { nombre: categoria, total: categorias[categoria] };
      }
    }

    return maxCategoria;
  }

  function obtenerCategoriaMayorGasto() {
    const categorias = {};
    operaciones.forEach((op) => {
      if (op.tipoOperacion === "gasto") {
        if (!categorias[op.categoria]) {
          categorias[op.categoria] = 0;
        }
        categorias[op.categoria] += op.monto;
      }
    });

    let maxCategoria = { nombre: "", total: 0 };
    for (const categoria in categorias) {
      if (categorias[categoria] > maxCategoria.total) {
        maxCategoria = { nombre: categoria, total: categorias[categoria] };
      }
    }

    return maxCategoria;
  }

  function obtenerCategoriaMayorBalance() {
    const categorias = {};
    operaciones.forEach((op) => {
      if (!categorias[op.categoria]) {
        categorias[op.categoria] = { ganancias: 0, gastos: 0 };
      }
      if (op.tipoOperacion === "ganancia") {
        categorias[op.categoria].ganancias += op.monto;
      } else {
        categorias[op.categoria].gastos += op.monto;
      }
    });

    let maxCategoria = { nombre: "", balance: 0 };
    for (const categoria in categorias) {
      const balance =
        categorias[categoria].ganancias - categorias[categoria].gastos;
      if (balance > maxCategoria.balance) {
        maxCategoria = { nombre: categoria, balance: balance };
      }
    }

    return maxCategoria;
  }

  function obtenerMesMayorGanancia() {
    const meses = {};
    operaciones.forEach((op) => {
      const fecha = new Date(op.fecha);
      const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      if (!meses[mes]) {
        meses[mes] = 0;
      }
      if (op.tipoOperacion === "ganancia") {
        meses[mes] += op.monto;
      }
    });

    let mesMayor = { mes: "", total: 0 };
    for (const mes in meses) {
      if (meses[mes] > mesMayor.total) {
        mesMayor = { mes: mes, total: meses[mes] };
      }
    }

    return mesMayor;
  }

  function obtenerMesMayorGasto() {
    const meses = {};
    operaciones.forEach((op) => {
      const fecha = new Date(op.fecha);
      const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      if (!meses[mes]) {
        meses[mes] = 0;
      }
      if (op.tipoOperacion === "gasto") {
        meses[mes] += op.monto;
      }
    });

    let mesMayor = { mes: "", total: 0 };
    for (const mes in meses) {
      if (meses[mes] > mesMayor.total) {
        mesMayor = { mes: mes, total: meses[mes] };
      }
    }

    return mesMayor;
  }
});
