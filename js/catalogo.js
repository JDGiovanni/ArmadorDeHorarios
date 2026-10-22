const CatalogoUI = {
    init() {
        this.renderizar();
        this.configurarEventos();
    },

    renderizar(materiasFiltradas = null) {
        const contenedor = document.getElementById('lista-catalogo');
        if (!contenedor) return;

        const materias = materiasFiltradas || GestorDatos.obtenerTodasLasMaterias();
        contenedor.innerHTML = '';

        if (materias.length === 0) {
            contenedor.innerHTML = '<p class="empty-text">No se encontraron materias que coincidan con la búsqueda.</p>';
            return;
        }

        materias.forEach(materia => {
            const card = document.createElement('div');
            card.className = `materia-card ${materia.esManual ? 'manual-materia' : ''}`;
            
            card.innerHTML = `
                <div class="materia-info">
                    <strong>${materia.codigo}</strong> - ${materia.nombre}
                    <div class="materia-meta">
                        <span>Trimestre: ${materia.trimestre}</span> | 
                        <span>UC: ${materia.uc}</span> | 
                        <span>Secciones: ${materia.secciones.length}</span>
                    </div>
                </div>
                <div class="materia-acciones">
                    <button class="btn primary small" onclick="SeleccionUI.toggleSeleccionarMateria('${materia.codigo}')">
                        Seleccionar
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    },

    configurarEventos() {
        const inputBuscar = document.getElementById('input-buscar');
        const selectTrimestre = document.getElementById('select-filtro-trimestre');

        const aplicarFiltros = () => {
            const texto = inputBuscar.value.toLowerCase().trim();
            const trimestre = selectTrimestre.value;

            const todas = GestorDatos.obtenerTodasLasMaterias();
            const filtradas = todas.filter(m => {
                const coincideTexto = m.nombre.toLowerCase().includes(texto) || m.codigo.toLowerCase().includes(texto);
                const coincideTrimestre = trimestre === "" || m.trimestre.toString() === trimestre;
                return coincideTexto && coincideTrimestre;
            });

            this.renderizar(filtradas);
        };

        if (inputBuscar) inputBuscar.addEventListener('input', aplicarFiltros);
        if (selectTrimestre) selectTrimestre.addEventListener('change', aplicarFilsros = () => aplicarFiltros()); // Seguro ante cambios en el select
        if (selectTrimestre) selectTrimestre.addEventListener('change', aplicarFiltros);
    }
};