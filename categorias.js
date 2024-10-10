
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