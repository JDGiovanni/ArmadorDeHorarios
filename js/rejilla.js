const RejillaUI = (() => {
    let combinaciones = [];
    let indiceActual = 0;

    const init = () => {
        document.getElementById('btn-prev-horario')?.addEventListener('click', () => cambiarIndice(-1));
        document.getElementById('btn-next-horario')?.addEventListener('click', () => cambiarIndice(1));
        document.getElementById('btn-fijar-definitivo')?.addEventListener('click', () => {
            if (combinaciones.length > 0) {
                ResumenUI.mostrar(combinaciones[indiceActual]);
            }
        });
    };

    const mostrar = (nuevasCombinaciones) => {
        combinaciones = nuevasCombinaciones;
        indiceActual = 0;
        
        const nav = document.getElementById('navegacion-resultados');
        const metricas = document.getElementById('metricas-resultado');
        
        if (combinaciones.length === 0) {
            nav.classList.add('hidden');
            metricas.classList.add('hidden');
            document.getElementById('rejilla-semanal').innerHTML = '<p class="placeholder-text">No se encontraron horarios que cumplan los filtros.</p>';
            return;
        }

        nav.classList.remove('hidden');
        metricas.classList.remove('hidden');
        renderizarActual();
    };

    const cambiarIndice = (delta) => {
        if (combinaciones.length === 0) return;
        indiceActual += delta;
        if (indiceActual < 0) indiceActual = combinaciones.length - 1;
        if (indiceActual >= combinaciones.length) indiceActual = 0;
        renderizarActual();
    };

    const renderizarActual = () => {
        const combinacion = combinaciones[indiceActual];
        
        document.getElementById('info-paginacion-horarios').textContent = `Opción ${indiceActual + 1} de ${combinaciones.length}`;
        
        const metricas = Preferencias.calcularMetricas(combinacion);
        document.getElementById('metricas-resultado').innerHTML = `
            <div><strong>${metricas.diasAsistencia}</strong> Días de asistencia</div>
            <div><strong>${(metricas.horasMuertasMinutos / 60).toFixed(1)}h</strong> Horas muertas</div>
            <div><strong>${Tiempo.aHoraStr(Math.round(metricas.promedioSalidaMinutos))}</strong> Salida promedio</div>
        `;

        const contenedor = document.getElementById('rejilla-semanal');
        contenedor.innerHTML = '';

        const dias = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
        const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        

        let minHora = 7 * 60; // 07:00 por defecto
        let maxHora = 21 * 60; // 21:00 por defecto

        const bloquesHorarios = [];
        combinacion.forEach(item => {
            item.horario.forEach(sesion => {
                sesion.bloques.forEach(idB => {
                    const b = GestorDatos.obtenerBloquePorId(idB);
                    if (b) {
                        minHora = Math.min(minHora, Tiempo.aMinutos(b.inicio));
                        maxHora = Math.max(maxHora, Tiempo.aMinutos(b.fin));
                        bloquesHorarios.push({ ...b, dia: sesion.dia, materia: item });
                    }
                });
            });
        });

        minHora = Math.floor(minHora / 60) * 60;
        maxHora = Math.ceil(maxHora / 60) * 60;
        
        const totalHoras = (maxHora - minHora) / 60;

        contenedor.style.display = 'grid';
        contenedor.style.gridTemplateColumns = '80px repeat(6, 1fr)';
        contenedor.style.gap = '2px';
        contenedor.style.background = '#e2e8f0';
        contenedor.style.border = '1px solid #e2e8f0';
        contenedor.style.position = 'relative';

        contenedor.innerHTML += `<div style="background:#0f172a; color:white; padding:10px; text-align:center; font-weight:bold;">Hora</div>`;
        diasNombres.forEach(dia => {
            contenedor.innerHTML += `<div style="background:#0f172a; color:white; padding:10px; text-align:center; font-weight:bold;">${dia}</div>`;
        });

        for (let i = 0; i < totalHoras; i++) {
            const horaStr = Tiempo.aHoraStr(minHora + (i * 60));
            contenedor.innerHTML += `<div style="background:white; padding:10px; text-align:right; font-size:0.75rem; color:#64748b;">${horaStr}</div>`;
            for (let d = 0; d < 6; d++) {
                contenedor.innerHTML += `<div style="background:white; height: 50px;"></div>`;
            }
        }

        const colores = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        
        bloquesHorarios.forEach((bloque, index) => {
            const colIndex = dias.indexOf(bloque.dia) + 2; // +2 porque la col 1 es la de horas
            const startRow = Math.floor((Tiempo.aMinutos(bloque.inicio) - minHora) / 60) + 2; // +2 por la cabecera
            const rowSpan = Math.ceil(Tiempo.duracion(bloque.inicio, bloque.fin) / 60);
            
            const colorIndex = combinacion.findIndex(c => c.materia === bloque.materia.materia) % colores.length;
            const color = colores[colorIndex];

            const div = document.createElement('div');
            div.style.cssText = `
                grid-column: ${colIndex};
                grid-row: ${startRow} / span ${rowSpan};
                background: ${color};
                color: white;
                padding: 4px;
                border-radius: 4px;
                font-size: 0.75rem;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                z-index: 10;
                margin: 1px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            div.innerHTML = `
                <strong>${bloque.materia.materia}</strong>
                <span>${bloque.materia.seccion}</span>
                <span style="font-size:0.65rem; opacity:0.9">${bloque.inicio}-${bloque.fin}</span>
            `;
            contenedor.appendChild(div);
        });
    };

    return { init, mostrar };
})();