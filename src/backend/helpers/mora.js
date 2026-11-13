export function calcularPenalizacionMora(cuota, prestamo, fechaReferencia = new Date()) {
    if (!prestamo) throw new Error('No se encontró el préstamo asociado a la cuota');
    if (cuota.estado === 'pagada') return 0;

    const tipoMora = prestamo.tipoMora || 'fija';
    const montoFijo = prestamo.multaMoraFija;
    const porcentaje = prestamo.multaMoraPorcentaje ?? 0;
    const tope = prestamo.multaMoraTope ?? 0;
    const diasGracia = prestamo.diasGracia;
    if (!['fija', 'porcentual'].includes(tipoMora) ||
        !Number.isFinite(montoFijo) || montoFijo < 0 ||
        !Number.isFinite(porcentaje) || porcentaje < 0 ||
        !Number.isFinite(tope) || tope < 0 ||
        !Number.isInteger(diasGracia) || diasGracia < 0) {
        throw new Error('La configuración de mora del préstamo no es válida');
    }
    if ((tipoMora === 'fija' && montoFijo === 0) ||
        (tipoMora === 'porcentual' && (porcentaje === 0 || tope === 0))) {
        return 0;
    }

    const vencimiento = new Date(cuota.fechaVencimiento);
    if (Number.isNaN(vencimiento.getTime()) || Number.isNaN(fechaReferencia.getTime())) {
        throw new Error('La fecha de vencimiento o la fecha de cálculo de mora no es válida');
    }
    const inicioMora = Date.UTC(
        vencimiento.getUTCFullYear(),
        vencimiento.getUTCMonth(),
        vencimiento.getUTCDate() + diasGracia + 1
    );
    if (fechaReferencia.getTime() < inicioMora) return 0;
    if (tipoMora === 'fija') return Math.round(montoFijo * 100) / 100;
    const recargo = Math.round(cuota.montoTotal * porcentaje) / 100;
    return Math.min(recargo, tope);
}
