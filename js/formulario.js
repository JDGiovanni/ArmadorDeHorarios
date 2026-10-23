const FormularioManual = (() => {
    let contadorSecciones = 0;

    const init = () => {
        const modal = document.getElementById('modal-manual');
        const btnAbrir = document.getElementById('btn-abrir-modal-manual');
        const btnCerrar = document.getElementById('cerrar-modal-manual');
        const btnCancelar = document.getElementById('btn-cancelar-manual');
        const form = document.getElementById('form-materia-manual');
        const btnAgregarSeccion = document.getElementById('btn-agregar-seccion-form');
        const listaSecciones = document.getElementById('lista-secciones-form');

        if (!modal) return;


        btnAbrir.addEventListener('click', () => {
            modal.classList.remove('hidden');
            form.reset();
            listaSecciones.innerHTML = '';
            contadorSecciones = 0;
            agregarFilaSeccion();
        });

        const cerrarModal = () => modal.classList.add('hidden');
        btnCerrar.addEventListener('click', cerrarModal);
        btnCancelar.addEventListener('click', cerrarModal);

        btnAgregarSeccion.addEventListener('click', agregarFilaSeccion);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            procesarFormulario();
        });
    };

    const agregarFilaSeccion = () => {
        const listaSecciones = document.getElementById('lista-secciones-form');
        const idSeccion = `sec-${contadorSecciones++}`;
        
        const div = document.createElement('div');
        div.className = 'seccion-form-row';
        div.style.cssText = 'border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 6px;';
        div.id = idSeccion;

        div.innerHTML = `
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="text" class="sec-id" placeholder="ID Sección (Ej: A)" required style="width: 100px;">
                <input type="text" class="sec-prof" placeholder="Profesor (Opcional)">
                <button type="button" class="btn danger" onclick="document.getElementById('${idSeccion}').remove()" style="padding: 5px;">X</button>
            </div>
            <div class="bloques-container" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="bloque-row" style="display: flex; gap: 10px; align-items: center;">
                    <select class="bloque-dia" required>
                        <option value="LUN">Lunes</option>
                        <option value="MAR">Martes</option>
                        <option value="MIE">Miércoles</option>
                        <option value="JUE">Jueves</option>
                        <option value="VIE">Viernes</option>
                        <option value="SAB">Sábado</option>
                    </select>
                    <input type="time" class="bloque-inicio" required value="07:00">
                    <input type="time" class="bloque-fin" required value="08:30">
                </div>
            </div>
            <button type="button" class="btn secondary" style="margin-top: 8px; padding: 4px 8px; font-size: 0.8rem;" onclick="FormularioManual.agregarBloque('${idSeccion}')">+ Agregar Bloque</button>
        `;
        listaSecciones.appendChild(div);
    };

    const agregarBloque = (idSeccion) => {
        const contenedor = document.querySelector(`#${idSeccion} .bloques-container`);
        const div = document.createElement('div');
        div.className = 'bloque-row';
        div.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        div.innerHTML = `
            <select class="bloque-dia" required>
                <option value="LUN">Lunes</option>
                <option value="MAR">Martes</option>
                <option value="MIE">Miércoles</option>
                <option value="JUE">Jueves</option>
                <option value="VIE">Viernes</option>
                <option value="SAB">Sábado</option>
            </select>
            <input type="time" class="bloque-inicio" required value="07:00">
            <input type="time" class="bloque-fin" required value="08:30">
            <button type="button" class="btn danger" onclick="this.parentElement.remove()" style="padding: 2px 6px;">X</button>
        `;
        contenedor.appendChild(div);
    };

    const procesarFormulario = () => {
        const codigo = document.getElementById('manual-codigo').value.trim().toUpperCase();
        const nombre = document.getElementById('manual-nombre').value.trim();
        const trimestre = parseInt(document.getElementById('manual-trimestre').value);
        const uc = parseInt(document.getElementById('manual-uc').value);
        const erroresBox = document.getElementById('form-errores');
        
        erroresBox.textContent = '';

        const existe = GestorDatos.obtenerTodasLasMaterias().find(m => m.codigo === codigo);
        if (existe) {
            erroresBox.textContent = "El código de materia ya existe.";
            return;
        }

        const seccionesDOM = document.querySelectorAll('#lista-secciones-form .seccion-form-row');
        const secciones = [];
        
        let bloquesGlobales = GestorDatos.obtenerBloques();

        seccionesDOM.forEach(secDOM => {
            const id = secDOM.querySelector('.sec-id').value.trim().toUpperCase() || "A";
            const profesor = secDOM.querySelector('.sec-prof').value.trim() || "Por asignar";
            
            const bloquesDOM = secDOM.querySelectorAll('.bloque-row');
            const horario = [];
            
            bloquesDOM.forEach(bDOM => {
                const dia = bDOM.querySelector('.bloque-dia').value;
                const inicio = bDOM.querySelector('.bloque-inicio').value;
                const fin = bDOM.querySelector('.bloque-fin').value;
                
                const nuevoIdBloque = `B_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                const nuevoBloque = { id: nuevoIdBloque, inicio, fin };
                
                if (typeof BLOQUES !== 'undefined') {
                    BLOQUES.push(nuevoBloque);
                } else {
                    bloquesGlobales.push(nuevoBloque);
                }

                let sesionDia = horario.find(h => h.dia === dia);
                if (!sesionDia) {
                    sesionDia = { dia: dia, bloques: [] };
                    horario.push(sesionDia);
                }
                sesionDia.bloques.push(nuevoIdBloque);
            });

            secciones.push({ id, profesor, horario });
        });

        if (secciones.length === 0) {
            erroresBox.textContent = "Debes agregar al menos una sección.";
            return;
        }

        const nuevaMateria = {
            codigo, nombre, trimestre, uc, secciones, esManual: true
        };

        GestorDatos.agregarMateriaManual(nuevaMateria);
        CatalogoUI.renderizar(); // Actualizar la vista del catálogo
        document.getElementById('modal-manual').classList.add('hidden');
    };

    return { init, agregarBloque };
})();