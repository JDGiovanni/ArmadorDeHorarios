const ResumenUI = (() => {
    const init = () => {
        document.getElementById('btn-imprimir')?.addEventListener('click', () => {
            window.print();
        });

        document.getElementById('btn-cambiar-horario')?.addEventListener('click', () => {
            document.getElementById('seccion-resumen').classList.add('hidden');
            document.getElementById('rejilla-semanal').classList.remove('hidden');
            // Opcional: Hacer scroll hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const mostrar = (combinacion) => {
        const contenedorTabla = document.getElementById('detalle-resumen-tabla');
        contenedorTabla.innerHTML = '';

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Materia</th>
                    <th>Sec.</th>
                    <th>Profesor</th>
                    <th>Día</th>
                    <th>Horario</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');

        const combinacionOrdenada = [...combinacion].sort((a, b) => a.nombreMateria.localeCompare(b.nombreMateria));

        combinacionOrdenada.forEach(item => {
            item.horario.forEach(sesion => {
                sesion.bloques.forEach(idB => {
                    const b = GestorDatos.obtenerBloquePorId(idB);
                    if (b) {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${item.materia}</strong></td>
                            <td>${item.nombreMateria}</td>
                            <td>${item.seccion}</td>
                            <td>${item.profesor}</td>
                            <td>${sesion.dia}</td>
                            <td>${b.inicio} - ${b.fin}</td>
                        `;
                        tbody.appendChild(tr);
                    }
                });
            });
        });

        contenedorTabla.appendChild(table);

        document.getElementById('rejilla-semanal').classList.add('hidden');
        document.getElementById('seccion-resumen').classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return { init, mostrar };
})();