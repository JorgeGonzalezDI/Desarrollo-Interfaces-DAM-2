import { ColumnaInforme } from './exportar';

export interface OpcionesInformePdf<T> {
  titulo: string;
  subtitulo: string;
  resumen: readonly { etiqueta: string; valor: string }[];
  columnas: readonly ColumnaInforme<T>[];
  filas: readonly T[];
  nombreArchivo: string;
}

/**
 * Informe PDF tabulado con cabecera corporativa, bloque de resumen, tabla paginada
 * y pie con número de página.
 * jsPDF se importa de forma DINÁMICA: su código (~300 kB) solo se descarga
 * la primera vez que alguien exporta, no al abrir la aplicación.
 */
export async function generarInformePdf<T>(opciones: OpcionesInformePdf<T>): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const ancho = doc.internal.pageSize.getWidth();
  const azul: [number, number, number] = [27, 58, 92];

  // Cabecera
  doc.setFillColor(...azul);
  doc.rect(0, 0, ancho, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('GastoFlow', 14, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(opciones.titulo, ancho - 14, 14, { align: 'right' });

  // Subtítulo (filtros aplicados y fecha de generación)
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(opciones.subtitulo, 14, 30);

  // Resumen en una fila de "tarjetas"
  const anchoTarjeta = (ancho - 28 - (opciones.resumen.length - 1) * 4) / opciones.resumen.length;
  opciones.resumen.forEach((dato, i) => {
    const x = 14 + i * (anchoTarjeta + 4);
    doc.setDrawColor(200, 208, 216);
    doc.setFillColor(243, 246, 249);
    doc.roundedRect(x, 34, anchoTarjeta, 16, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(dato.etiqueta, x + 4, 40);
    doc.setFontSize(12);
    doc.setTextColor(...azul);
    doc.setFont('helvetica', 'bold');
    doc.text(dato.valor, x + 4, 47);
    doc.setFont('helvetica', 'normal');
  });

  // Tabla de datos (autoTable pagina sola y repite la cabecera)
  autoTable(doc, {
    startY: 56,
    head: [opciones.columnas.map((c) => c.titulo)],
    body: opciones.filas.map((fila) => opciones.columnas.map((c) => String(c.valor(fila)))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: azul, textColor: 255 },
    alternateRowStyles: { fillColor: [243, 246, 249] },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      const pagina = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(`Página ${pagina}`, ancho - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
      doc.text('Datos sintéticos de demostración', 14, doc.internal.pageSize.getHeight() - 8);
    },
  });

  doc.save(opciones.nombreArchivo);
}
