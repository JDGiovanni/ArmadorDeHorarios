document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando aplicación Scheduler...");

    if (typeof CatalogoUI !== 'undefined') CatalogoUI.init();
    if (typeof FormularioManual !== 'undefined') FormularioManual.init();
    if (typeof RejillaUI !== 'undefined') RejillaUI.init();
    if (typeof ResumenUI !== 'undefined') ResumenUI.init();
    
    if (typeof Seleccion !== 'undefined') {
        Seleccion.actualizarVista();
    }

    const btnConfigTope = document.getElementById('btn-config-tope');
    const modalTope = document.getElementById('modal-tope');
    const btnGuardarTope = document.getElementById('btn-guardar-tope');
    const btnCancelarTope = document.getElementById('btn-cancelar-tope');
    const inputNuevoTope = document.getElementById('input-nuevo-tope');
    const errorTope = document.getElementById('error-tope');

    if (btnConfigTope) {
        btnConfigTope.addEventListener('click', () => {
            modalTope.classList.remove('hidden');
            inputNuevoTope.value = topeUC;
            if (errorTope) errorTope.textContent = '';
        });
    }

    if (btnCancelarTope) {
        btnCancelarTope.addEventListener('click', () => modalTope.classList.add('hidden'));
    }

    if (btnGuardarTope) {
        btnGuardarTope.addEventListener('click', () => {
            const nuevoTope = parseInt(inputNuevoTope.value);
            if (nuevoTope > 0) {
                Seleccion.setTopeUC(nuevoTope);
                modalTope.classList.add('hidden');
            } else {
                if (errorTope) errorTope.textContent = "Ingresa un número válido mayor a 0.";
            }
        });
    }

    const btnGenerar = document.getElementById('btn-generar-horarios');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', () => {
            const materias = Seleccion.getMaterias();
            
            if (materias.length === 0) {
                alert("Selecciona al menos una materia para generar horarios.");
                return;
            }

            let combinaciones = Generador.generarCombinaciones(materias);

            if (combinaciones.length === 0) {
                alert("No existe ninguna combinación posible sin choques para estas materias.");
                return;
            }

            const diasLibres = Array.from(document.querySelectorAll('input[name="dia-libre"]:checked')).map(cb => cb.value);
            const horaMin = document.getElementById('input-hora-min').value;
            const horaMax = document.getElementById('input-hora-max').value;

            const configFiltros = { diasLibres, horaMin, horaMax };
            combinaciones = Preferencias.aplicarFiltros(combinaciones, configFiltros);

            if (combinaciones.length === 0) {
                alert("Ningún horario cumple con los filtros de preferencias (días libres u horas límite).");
                return;
            }

            const criterio = document.getElementById('select-ordenar').value;
            combinaciones = Preferencias.ordenar(combinaciones, criterio);

            RejillaUI.mostrar(combinaciones);
        });
    }
});