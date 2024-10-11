
// mostrar y ocultar seccion

document.addEventListener('DOMContentLoaded', function() {
    const showCategoriesButton = document.getElementById('show-categories');
    const categoriesBox = document.getElementById('categiries_box');
    const mainContent = document.getElementById('main-content');
    const closeCategoriesButton = document.getElementById('close-categories');

    showCategoriesButton.addEventListener('click', function() {
        categoriesBox.classList.remove('hidden');
        mainContent.classList.add('hidden');
    });

    closeCategoriesButton.addEventListener('click', function() {
        categoriesBox.classList.add('hidden');
        mainContent.classList.remove('hidden');
    });
});
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {  
    const categoriaInput = document.getElementById('categoria-input'); // Input para agregar categoría
    const editCategoriaInput = document.getElementById('edit-categoria-input'); // Input para editar categoría
    const btnAgregarCategoria = document.querySelector('.bg-blue-500'); 
    const categoriasContainer = document.getElementById('categorias');
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    let categoriaIdEdit = null;
    let categoriaIdToDelete = null;

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [
        { id: '1', nombre: 'Transporte' },
        { id: '2', nombre: 'Servicios' },
        { id: '3', nombre: 'Educación' },
        { id: '4', nombre: 'Trabajo' },
    ];

    if (!localStorage.getItem('categorias')) {
        guardarCategoriasEnStorage();
    }

    actualizarListaCategorias();

    btnAgregarCategoria.addEventListener('click', (e) => {
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
            categoriaInput.value = ''; 
        }
    });

    function guardarCategoriasEnStorage() {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }

    function actualizarListaCategorias() {
        categoriasContainer.innerHTML = ''; 
        categorias.forEach(categoria => {
            const div = document.createElement('div');
            div.classList.add('mb-3');
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

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', mostrarModalEliminar);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', mostrarModalEditar);
        });
    }

    function mostrarModalEliminar(event) {
        categoriaIdToDelete = event.target.closest('a').dataset.id;
        deleteModal.classList.remove('hidden');
    }

    function mostrarModalEditar(event) {
        categoriaIdEdit = event.target.closest('a').dataset.id;
        const categoria = categorias.find(c => c.id === categoriaIdEdit);
        
        if (categoria) {
            editCategoriaInput.value = categoria.nombre; // Cargar nombre en el input de edición
            editModal.classList.remove('hidden'); // Mostrar modal de edición
        }
    }

    document.getElementById('confirm-edit-button').addEventListener('click', () => {
        const nuevoNombre = editCategoriaInput.value.trim(); // Usar el input correcto
        if (nuevoNombre && categoriaIdEdit) {
            const categoria = categorias.find(c => c.id === categoriaIdEdit);
            if (categoria) {
                categoria.nombre = nuevoNombre; 
                guardarCategoriasEnStorage();
                actualizarListaCategorias();
                editCategoriaInput.value = ''; // Limpiar input
                editModal.classList.add('hidden'); 
                categoriaIdEdit = null; 
            }
        }
    });

    // Este es el botón de cancelar la edición
    document.getElementById('cancel-edit-button').addEventListener('click', () => {
        editModal.classList.add('hidden'); 
        editCategoriaInput.value = ''; // Limpiar input
        categoriaIdEdit = null; 
    });

    document.getElementById('confirm-delete-button').addEventListener('click', () => {
        if (categoriaIdToDelete) {
            categorias = categorias.filter(categoria => categoria.id !== categoriaIdToDelete);
            guardarCategoriasEnStorage();
            actualizarListaCategorias();
            deleteModal.classList.add('hidden'); 
            categoriaIdToDelete = null; 
        }
    });

    document.getElementById('cancel-delete-button').addEventListener('click', () => {
        deleteModal.classList.add('hidden'); 
    });
});
