const Choques = (() => {
    
    const alertaHTML = document.getElementById('incompatibilidades-alert');
    const btnGenerar = document.getElementById('btn-generar-horarios');

    const sonIncompatibles = (materiaA, materiaB) => {
        if (!materiaA.secciones || !materiaB.secciones) return false;

        for (let secA of materiaA.secciones) {
            for (let secB of materiaB.secciones) {
                
                let seccionChoca = false;

                for (let bloqueA of secA.bloques) {
                    for (let bloqueB of secB.bloques) {
                        if (Tiempo.haySolapamiento(bloqueA, bloqueB)) {
                            seccionChoca = true;
                            break; // Ya chocaron estos bloques
                        }
                    }
                    if (seccionChoca) break;
                }

                if (!seccionChoca) {
                    return false; 
                }
            }
        }
        
        return true;
    };

    const verificarTodos = () => {
        const materias = Seleccion.getMaterias();
        let incompatibles = [];

        for (let i = 0; i < materias.length; i++) {
            for (let j = i + 1; j < materias.length; j++) {
                if (sonIncompatibles(materias[i], materias[j])) {
                    incompatibles.push({ a: materias[i].nombre, b: materias[j].nombre });
                }
            }
        }

        if (incompatibles.length > 0) {
            alertaHTML.classList.remove('hidden');
            alertaHTML.innerHTML = `<strong>⚠ Incompatibilidad total detectada:</strong><br>`;
            incompatibles.forEach(inc => {
                alertaHTML.innerHTML += `- <em>${inc.a}</em> no se puede cursar con <em>${inc.b}</em> (todos sus horarios chocan).<br>`;
            });

            btnGenerar.disabled = true;
            btnGenerar.title = "Corrige los choques para generar horarios.";
        } else {
            alertaHTML.classList.add('hidden');
            alertaHTML.innerHTML = '';

            btnGenerar.disabled = false;
            btnGenerar.title = "";
        }
    };

    return {
        verificarTodos,
        sonIncompatibles
    };
})();