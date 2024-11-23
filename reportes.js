document.addEventListener("DOMContentLoaded", () => {
  let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

  // Evento para mostrar reportes
  const btnShowReports = document.getElementById("show-reports");
  btnShowReports.addEventListener("click", () => {
    const reportSection = document.getElementById("report-section");
    reportSection.classList.remove("hidden"); // Muestra la sección de reportes
    // Actualiza el resumen directamente al hacer clic en el botón
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
  });

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
                <td class="px-4 py-2 border border-gray-300 ${
                  m.ganancias >= 0 ? "text-green-500" : ""
                }">${m.ganancias.toFixed(2)}</td>
                <td class="px-4 py-2 border border-gray-300 ${
                  m.gastos >= 0 ? "text-red-500" : ""
                }">${m.gastos.toFixed(2)}</td>
                <td class="px-4 py-2 border border-gray-300 ${
                  m.balance >= 0 ? "text-green-500" : "text-red-500"
                }">${m.balance.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    document.getElementById("totales-meses").innerHTML = tablaMeses;
  }

  // Funciones para obtener el mayor valor de cada categoría y mes
  function obtenerCategoriaMayorGanancia() {
    let categoria = { nombre: "", total: 0 };
    const categorias = {};

    operaciones.forEach((op) => {
      if (op.tipoOperacion === "ganancia") {
        if (!categorias[op.categoria]) {
          categorias[op.categoria] = 0;
        }
        categorias[op.categoria] += op.monto;
      }
    });

    for (const categoriaNombre in categorias) {
      if (categorias[categoriaNombre] > categoria.total) {
        categoria = {
          nombre: categoriaNombre,
          total: categorias[categoriaNombre],
        };
      }
    }
    return categoria;
  }

  function obtenerCategoriaMayorGasto() {
    let categoria = { nombre: "", total: 0 };
    const categorias = {};

    operaciones.forEach((op) => {
      if (op.tipoOperacion === "gasto") {
        if (!categorias[op.categoria]) {
          categorias[op.categoria] = 0;
        }
        categorias[op.categoria] += op.monto;
      }
    });

    for (const categoriaNombre in categorias) {
      if (categorias[categoriaNombre] > categoria.total) {
        categoria = {
          nombre: categoriaNombre,
          total: categorias[categoriaNombre],
        };
      }
    }
    return categoria;
  }

  function obtenerCategoriaMayorBalance() {
    let categoria = { nombre: "", balance: 0 };
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

    for (const categoriaNombre in categorias) {
      const balance =
        categorias[categoriaNombre].ganancias -
        categorias[categoriaNombre].gastos;
      if (balance > categoria.balance) {
        categoria = { nombre: categoriaNombre, balance: balance };
      }
    }
    return categoria;
  }

  function obtenerMesMayorGanancia() {
    let mes = { mes: "", total: 0 };
    const meses = {};

    operaciones.forEach((op) => {
      const fecha = new Date(op.fecha);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;

      if (op.tipoOperacion === "ganancia") {
        if (!meses[mesKey]) {
          meses[mesKey] = 0;
        }
        meses[mesKey] += op.monto;
      }
    });

    for (const mesKey in meses) {
      if (meses[mesKey] > mes.total) {
        mes = { mes: mesKey, total: meses[mesKey] };
      }
    }
    return mes;
  }

  function obtenerMesMayorGasto() {
    let mes = { mes: "", total: 0 };
    const meses = {};

    operaciones.forEach((op) => {
      const fecha = new Date(op.fecha);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;

      if (op.tipoOperacion === "gasto") {
        if (!meses[mesKey]) {
          meses[mesKey] = 0;
        }
        meses[mesKey] += op.monto;
      }
    });

    for (const mesKey in meses) {
      if (meses[mesKey] > mes.total) {
        mes = { mes: mesKey, total: meses[mesKey] };
      }
    }
    return mes;
  }
});
