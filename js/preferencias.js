const Preferencias = (() => {
    const aplicarFiltros = (combinaciones, configFiltros) => {
        if (!combinaciones) return [];

        return combinaciones.filter(combinacion => {
            for (const item of combinacion) {
                for (const sesion of item.horario) {
                    if (configFiltros.diasLibres && configFiltros.diasLibres.includes(sesion.dia)) {
                        return false;
                    }

                    for (const idBloque of sesion.bloques) {
                        const b = GestorDatos.obtenerBloquePorId(idBloque);
                        if (!b) continue;

                        if (configFiltros.horaMin) {
                            if (Tiempo.aMinutos(b.inicio) < Tiempo.aMinutos(configFiltros.horaMin)) {
                                return false;
                            }
                        }

                        if (configFiltros.horaMax) {
                            if (Tiempo.aMinutos(b.fin) > Tiempo.aMinutos(configFiltros.horaMax)) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        });
    };

    const calcularMetricas = (combinacion) => {
        const diasConClase = new Set();
        const sesionesPorDia = {};

        for (const item of combinacion) {
            for (const sesion of item.horario) {
                diasConClase.add(sesion.dia);
                if (!sesionesPorDia[sesion.dia]) {
                    sesionesPorDia[sesion.dia] = [];
                }

                for (const idBloque of sesion.bloques) {
                    const b = GestorDatos.obtenerBloquePorId(idBloque);
                    if (b) {
                        sesionesPorDia[sesion.dia].push({
                            inicio: Tiempo.aMinutos(b.inicio),
                            fin: Tiempo.aMinutos(b.fin)
                        });
                    }
                }
            }
        }

        let totalHorasMuertasMinutos = 0;
        let sumaSalidasMinutos = 0;

        for (const dia in sesionesPorDia) {
            const bloquesDia = sesionesPorDia[dia].sort((a, b) => a.inicio - b.inicio);
            if (bloquesDia.length === 0) continue;

            let horaFinAnterior = bloquesDia[0].fin;
            for (let i = 1; i < bloquesDia.length; i++) {
                if (bloquesDia[i].inicio > horaFinAnterior) {
                    totalHorasMuertasMinutos += (bloquesDia[i].inicio - horaFinAnterior);
                }
                if (bloquesDia[i].fin > horaFinAnterior) {
                    horaFinAnterior = bloquesDia[i].fin;
                }
            }
            sumaSalidasMinutos += bloquesDia[bloquesDia.length - 1].fin;
        }

        const diasAsistencia = diasConClase.size;
        const promedioSalida = diasAsistencia > 0 ? sumaSalidasMinutos / diasAsistencia : 0;

        return {
            diasAsistencia,
            horasMuertasMinutos: totalHorasMuertasMinutos,
            promedioSalidaMinutos: promedioSalida
        };
    };

    const ordenar = (combinaciones, criterio) => {
        return [...combinaciones].sort((a, b) => {
            const metricasA = calcularMetricas(a);
            const metricasB = calcularMetricas(b);

            if (criterio === 'asistencia') {
                return metricasA.diasAsistencia - metricasB.diasAsistencia;
            } else if (criterio === 'muertas') {
                return metricasA.horasMuertasMinutos - metricasB.horasMuertasMinutos;
            } else if (criterio === 'salida') {
                return metricasA.promedioSalidaMinutos - metricasB.promedioSalidaMinutos;
            }
            return 0;
        });
    };

    return {
        aplicarFiltros,
        calcularMetricas,
        ordenar
    };
})();