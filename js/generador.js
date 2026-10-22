const Generador = (() => {
    const generarCombinaciones = (materiasSeleccionadas) => {
        if (!materiasSeleccionadas || materiasSeleccionadas.length === 0) {
            return [];
        }

        const resultados = [];

        const backtracking = (index, combinacionActual, mapaBloquesOcupados) => {
            if (index === materiasSeleccionadas.length) {
                resultados.push([...combinacionActual]);
                return;
            }

            const materia = materiasSeleccionadas[index];
            const seccionesFiltradas = materia.secciones.filter(s => {
                if (materia.seccionFijada) {
                    return s.id === materia.seccionFijada;
                }
                if (materia.seccionesExcluidas && materia.seccionesExcluidas.includes(s.id)) {
                    return false;
                }
                return true;
            });

            for (const seccion of seccionesFiltradas) {
                let choque = false;
                const nuevosBloques = [];

                for (const sesion of seccion.horario) {
                    for (const idBloque of sesion.bloques) {
                        const infoBloque = GestorDatos.obtenerBloquePorId(idBloque);
                        if (!infoBloque) continue;

                        const clave = `${sesion.dia}_${infoBloque.inicio}_${infoBloque.fin}`;
                        if (mapaBloquesOcupados[clave]) {
                            choque = true;
                            break;
                        }
                        nuevosBloques.push(clave);
                    }
                    if (choque) break;
                }

                if (!choque) {
                    for (const clave of nuevosBloques) {
                        mapaBloquesOcupados[clave] = true;
                    }

                    combinacionActual.push({
                        materia: materia.codigo,
                        nombreMateria: materia.nombre,
                        uc: materia.uc,
                        seccion: seccion.id,
                        profesor: seccion.profesor,
                        horario: seccion.horario
                    });

                    backtracking(index + 1, combinacionActual, mapaBloquesOcupados);

                    combinacionActual.pop();
                    for (const clave of nuevosBloques) {
                        delete mapaBloquesOcupados[clave];
                    }
                }
            }
        };

        backtracking(0, [], {});
        return resultados;
    };

    return {
        generarCombinaciones
    };
})();