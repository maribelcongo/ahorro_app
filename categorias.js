document.addEventListener("DOMContentLoaded", () => {
  const categoriaInput = document.getElementById("categoria-input");
  const btnAgregarCategoria = document.getElementById("btn-agregar-categoria");
  const categoriasContainer = document.getElementById("categorias");
  const editModal = document.getElementById("edit-modal");
  const deleteModal = document.getElementById("delete-modal");
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

  // Actualizar la lista de categorías
  actualizarListaCategorias();

  // Evento de click para agregar categoría
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
      actualizarListaCategorias();
      categoriaInput.value = "";
    }
  });

  // Guardar categorías en localStorage
  function guardarCategoriasEnStorage() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }

  // Actualizar la lista de categorías en el DOM
  function actualizarListaCategorias() {
    categoriasContainer.innerHTML = "";
    categorias.forEach((categoria) => {
      const div = document.createElement("div");
      div.classList.add("mb-3");
      div.innerHTML = `
          <div class="flex items-center">
              <div class="flex-grow">
                  <span class="inline-block py-1 px-2 text-gray-700 border border-gray-300 rounded-lg w-1/4 text-center">${categoria.nombre}</span>
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
    .getElementById("confirm-edit-button")
    .addEventListener("click", () => {
      const nuevoNombre = editCategoriaInput.value.trim();
      if (nuevoNombre && categoriaIdEdit) {
        const categoria = categorias.find((c) => c.id === categoriaIdEdit);
        if (categoria) {
          categoria.nombre = nuevoNombre;
          guardarCategoriasEnStorage();
          actualizarListaCategorias();
          editCategoriaInput.value = "";
          editModal.classList.add("hidden");
          categoriaIdEdit = null;
        }
      }
    });

  // Cancelar edición
  document
    .getElementById("cancel-edit-button")
    .addEventListener("click", () => {
      editModal.classList.add("hidden");
      editCategoriaInput.value = "";
      categoriaIdEdit = null;
    });

  // Confirmar eliminación de categoría
  document
    .getElementById("confirm-delete-button")
    .addEventListener("click", () => {
      if (categoriaIdToDelete) {
        categorias = categorias.filter(
          (categoria) => categoria.id !== categoriaIdToDelete
        );
        guardarCategoriasEnStorage();
        actualizarListaCategorias();
        deleteModal.classList.add("hidden");
        categoriaIdToDelete = null;
      }
    });

  // Cancelar eliminación
  document
    .getElementById("cancel-delete-button")
    .addEventListener("click", () => {
      deleteModal.classList.add("hidden");
    });
});
