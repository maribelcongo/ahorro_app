document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const categoriaInput = document.getElementById("categoria-input");
  const btnAgregarCategoria = document.getElementById("btn-agregar-categoria");
  const categoriasContainer = document.getElementById("categorias");
  const categoriasSelectNuevaOperacion =
    document.getElementById("categories-select");
  const categoriasSelectEditarOperacion = document.getElementById(
    "edit-category-operation"
  );
  const editModal = document.getElementById("edit_modal_categoties");
  const deleteModal = document.getElementById("delete_modal_categories");
  const editCategoriaInput = document.getElementById("edit-categoria-input");

  let categoriaIdEdit = null;
  let categoriaIdToDelete = null;

  // Categorías por defecto
  const categoriasPorDefecto = [
    { id: "1", nombre: "Comida" },
    { id: "2", nombre: "Salidas" },
    { id: "3", nombre: "Trabajo" },
    { id: "4", nombre: "Transporte" },
    { id: "5", nombre: "Educación" },
    { id: "6", nombre: "Servicios" },
  ];

  // Cargar categorías desde localStorage o usar las por defecto
  let categorias =
    JSON.parse(localStorage.getItem("categorias")) || categoriasPorDefecto;

  // Guardar categorías en localStorage si no están almacenadas
  if (!localStorage.getItem("categorias")) {
    guardarCategoriasEnStorage();
  }

  // Actualizar los selects y el contenedor de categorías
  actualizarSelectsCategorias();
  actualizarListaCategorias();

  // Evento para agregar categoría
  btnAgregarCategoria.addEventListener("click", (e) => {
    e.preventDefault();
    const nombreCategoria = categoriaInput.value.trim();
    if (nombreCategoria) {
      const nuevaCategoria = {
        id: Date.now().toString(),
        nombre: nombreCategoria,
      };
      categorias.push(nuevaCategoria);
      guardarCategoriasEnStorage();
      actualizarSelectsCategorias(); // Actualizar los selects con la nueva categoría
      actualizarListaCategorias(); // Actualizar la lista de categorías visualmente
      categoriaInput.value = "";
    }
  });

  // Función para guardar las categorías en localStorage
  function guardarCategoriasEnStorage() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }

  // Función para actualizar los selects de categorías
  function actualizarSelectsCategorias() {
    // Limpiar y actualizar el select de "nueva operación"
    categoriasSelectNuevaOperacion.innerHTML =
      '<option value="" disabled selected>Selecciona una categoría</option>';
    // Limpiar y actualizar el select de "editar operación"
    categoriasSelectEditarOperacion.innerHTML =
      '<option value="" disabled selected>Selecciona una categoría</option>';

    categorias.forEach((categoria) => {
      const optionNuevaOperacion = document.createElement("option");
      optionNuevaOperacion.value = categoria.nombre.toLowerCase();
      optionNuevaOperacion.textContent = categoria.nombre;
      categoriasSelectNuevaOperacion.appendChild(optionNuevaOperacion);

      const optionEditarOperacion = document.createElement("option");
      optionEditarOperacion.value = categoria.nombre.toLowerCase();
      optionEditarOperacion.textContent = categoria.nombre;
      categoriasSelectEditarOperacion.appendChild(optionEditarOperacion);
    });
  }

  // Función para actualizar la lista de categorías visualmente
  function actualizarListaCategorias() {
    categoriasContainer.innerHTML = "";
    categorias.forEach((categoria) => {
      const div = document.createElement("div");
      div.classList.add("mb-3");
      div.innerHTML = `
        <div class="flex items-center">
          <div class="flex-grow">
            <span class="inline-block py-1 px-2 text-gray-700 border border-gray-300 rounded-lg w-1/4 text-center max-w-40 min-w-32">${categoria.nombre}</span>
          </div>
          <div class="ml-4">
            <a href="#" class="text-sm text-blue-500 hover:text-blue-700 mr-2 edit-btn" data-id="${categoria.id}">
                <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="text-sm text-red-500 hover:text-red-700 delete-btn" data-id="${categoria.id}">
                <i class="fas fa-trash"></i>
            </a>
          </div>
        </div>
      `;
      categoriasContainer.appendChild(div);
    });

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", mostrarModalEliminar);
    });

    // Agregar eventos a los botones de editar
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", mostrarModalEditar);
    });
  }

  // Mostrar modal de eliminación
  function mostrarModalEliminar(event) {
    event.preventDefault();
    const button = event.target.closest("a");
    if (button) {
      const categoriaId = button.dataset.id;
      if (categoriaId) {
        categoriaIdToDelete = categoriaId;
        deleteModal.classList.remove("hidden");
      }
    }
  }

  // Mostrar modal de edición
  function mostrarModalEditar(event) {
    event.preventDefault();
    const button = event.target.closest("a");
    if (button) {
      const categoriaId = button.dataset.id;
      if (categoriaId) {
        categoriaIdEdit = categoriaId;
        const categoria = categorias.find((c) => c.id === categoriaIdEdit);
        if (categoria) {
          editCategoriaInput.value = categoria.nombre;
          editModal.classList.remove("hidden");
        }
      }
    }
  }

  // Confirmar la edición de la categoría
  document
    .getElementById("confirm-edit-button-categories")
    .addEventListener("click", () => {
      const nuevoNombre = editCategoriaInput.value.trim();
      if (nuevoNombre && categoriaIdEdit) {
        const categoria = categorias.find((c) => c.id === categoriaIdEdit);
        if (categoria) {
          categoria.nombre = nuevoNombre;
          guardarCategoriasEnStorage();
          actualizarSelectsCategorias(); // Actualizar los selects con la nueva categoría
          actualizarListaCategorias();
          editCategoriaInput.value = "";
          editModal.classList.add("hidden");
          categoriaIdEdit = null;
        }
      }
    });

  // Cancelar edición
  document
    .getElementById("cancel-edit-button-categories")
    .addEventListener("click", () => {
      editModal.classList.add("hidden");
      editCategoriaInput.value = "";
      categoriaIdEdit = null;
    });

  // Confirmar eliminación de categoría
  document
    .getElementById("confirm-delete-button-categories")
    .addEventListener("click", () => {
      if (categoriaIdToDelete) {
        categorias = categorias.filter(
          (categoria) => categoria.id !== categoriaIdToDelete
        );
        guardarCategoriasEnStorage();
        actualizarSelectsCategorias(); // Actualizar los selects con la nueva lista de categorías
        actualizarListaCategorias();
        deleteModal.classList.add("hidden");
        categoriaIdToDelete = null;
      }
    });

  document
    .getElementById("cancel-delete-button-categories")
    .addEventListener("click", () => {
      deleteModal.classList.add("hidden");
    });
});
