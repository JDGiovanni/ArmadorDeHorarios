document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando aplicación Scheduler...");

    if (typeof CatalogoUI !== 'undefined') {
        CatalogoUI.init();
    }

    if (typeof FormularioManual !== 'undefined') {
        FormularioManual.init();
    }

});