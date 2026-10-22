const GestorDatos = {
    materiasManuales: [],

    obtenerBloques() {
        return typeof BLOQUES !== 'undefined' ? BLOQUES : [];
    },

    obtenerBloquePorId(id) {
        return this.obtenerBloques().find(b => b.id === id);
    },

    obtenerCatalogoBase() {
        return typeof MATERIAS !== 'undefined' ? MATERIAS : [];
    },

    obtenerTodasLasMaterias() {
        return [...this.obtenerCatalogoBase(), ...this.materiasManuales];
    },

    agregarMateriaManual(materia) {
        this.materiasManuales.push(materia);
    },

    eliminarMateriaManual(codigo) {
        this.materiasManuales = this.materiasManuales.filter(m => m.codigo !== codigo);
    }
};