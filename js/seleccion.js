let materiasSeleccionadas = [];
let topeUC = 28;

const Seleccion = (() => {

    const listaHTML = document.getElementById('lista-seleccionadas');
    const headerMaterias = document.getElementById('header-total-materias');
    const headerUC = document.getElementById('header-total-uc');
    const btnGenerar = document.getElementById('btn-generar-horarios');

    const actualizarMetricas = () => {
        let totalUC = 0;
        materiasSeleccionadas.forEach(mat => totalUC += mat.uc);

        headerMaterias.textContent = `Materias: ${materiasSeleccionadas.length}`;
        headerUC.textContent = `UC Seleccionadas: ${totalUC} / ${topeUC}`;

        if (totalUC > topeUC) {
            headerUC.style.color = '#ef4444'; // Rojo si se pasa
            btnGenerar.disabled = true;
        } else {
            headerUC.style.color = '';
            btnGenerar.disabled = false;
        }
    };

    const renderizarLista = () => {
        listaHTML.innerHTML = '';
        
        if (materiasSeleccionadas.length === 0) {
            listaHTML.innerHTML = '<p class="placeholder-text">No hay materias seleccionadas.</p>';
            return;
        }

        materiasSeleccionadas.forEach((materia, index) => {
            const card = document.createElement('div');
            card.className = 'materia-card-seleccionada';
            card.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:8px; background:#fff; border:1px solid #e2e8f0; border-radius:6px;';
            
            card.innerHTML = `
                <div>
                    <strong>${materia.codigo}</strong> - ${materia.nombre}
                    <div style="font-size: 0.8rem; color: #64748b;">UC: ${materia.uc} | Trimestre: ${materia.trimestre}</div>
                </div>
                <button class="btn danger" onclick="Seleccion.eliminar('${materia.codigo}')" style="padding: 4px 8px; font-size: 0.8rem;">X</button>
            `;
            listaHTML.appendChild(card);
        });
    };

    const agregar = (materia) => {

        if (materiasSeleccionadas.find(m => m.codigo === materia.codigo)) {
            alert("Esta materia ya está seleccionada.");
            return;
        }

        let totalUC = materiasSeleccionadas.reduce((sum, m) => sum + m.uc, 0);
        if (totalUC + materia.uc > topeUC) {
            alert(`No puedes agregar esta materia. Superarías el tope de ${topeUC} UC.`);
            return;
        }

        materiasSeleccionadas.push(materia);
        renderizarLista();
        actualizarMetricas();
        
        if (typeof Choques !== 'undefined') Choques.verificarTodos();
    };

    const eliminar = (codigo) => {
        materiasSeleccionadas = materiasSeleccionadas.filter(m => m.codigo !== codigo);
        renderizarLista();
        actualizarMetricas();
        
        if (typeof Choques !== 'undefined') Choques.verificarTodos();
    };

    const setTopeUC = (nuevoTope) => {
        topeUC = nuevoTope;
        actualizarMetricas();
    };

    return {
        agregar,
        eliminar,
        setTopeUC,
        getMaterias: () => materiasSeleccionadas,
        actualizarVista: () => { renderizarLista(); actualizarMetricas(); }
    };
})();