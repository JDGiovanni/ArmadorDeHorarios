const Tiempo = (() => {
    
    const aMinutos = (horaStr) => {
        if (!horaStr) return 0;
        const [horas, minutos] = horaStr.split(':').map(Number);
        return (horas * 60) + minutos;
    };

    const aHoraStr = (minutosTotales) => {
        const horas = Math.floor(minutosTotales / 60);
        const minutos = minutosTotales % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    };

    const duracion = (inicioStr, finStr) => {
        return aMinutos(finStr) - aMinutos(inicioStr);
    };

    const haySolapamiento = (bloqueA, bloqueB) => {

        if (bloqueA.dia !== bloqueB.dia) return false;

        const inicioA = aMinutos(bloqueA.inicio);
        const finA = aMinutos(bloqueA.fin);
        const inicioB = aMinutos(bloqueB.inicio);
        const finB = aMinutos(bloqueB.fin);

        return (inicioA < finB) && (inicioB < finA);
    };

    return {
        aMinutos,
        aHoraStr,
        duracion,
        haySolapamiento
    };
})();