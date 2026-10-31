import { generarCsv } from './exportar';

interface Fila {
  texto: string;
  importe: number;
}

describe('generarCsv', () => {
  const columnas = [
    { titulo: 'Texto', valor: (f: Fila) => f.texto },
    { titulo: 'Importe', valor: (f: Fila) => f.importe },
  ];

  it('empieza con BOM UTF-8 y usa ; como separador', () => {
    const csv = generarCsv([{ texto: 'Hotel', importe: 10 }], columnas);
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain('Texto;Importe');
  });

  it('usa coma decimal y entrecomilla los campos con ; o comillas', () => {
    const csv = generarCsv([{ texto: 'Comida; "cliente"', importe: 12.5 }], columnas);
    expect(csv).toContain('"Comida; ""cliente"""');
    expect(csv).toContain('12,5');
  });
});
