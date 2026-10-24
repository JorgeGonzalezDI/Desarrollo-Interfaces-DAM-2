// Regenera la sección "Registro de trabajo" del README a partir del historial de Git.
// Cada fila es un commit con su fecha y hora reales (no se inventa ni se cambia nada).
//
// Uso, desde la carpeta del repositorio:   node actualizar-registro.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const INICIO = '<!-- REGISTRO:INICIO -->';
const FIN = '<!-- REGISTRO:FIN -->';

// git log → una línea por commit: "dd-mm-aaaa hh:mm<TAB>mensaje"
const salida = execFileSync(
  'git',
  ['log', '--date=format:%d-%m-%Y %H:%M', '--pretty=format:%ad%x09%s'],
  { encoding: 'utf8' },
);

const commits = salida
  .split('\n')
  .filter((linea) => linea.trim() !== '')
  .map((linea) => {
    const [fechaHora, ...resto] = linea.split('\t');
    const [fecha, hora] = fechaHora.split(' ');
    return { fecha, hora, mensaje: resto.join('\t').replace(/\|/g, '\\|') };
  })
  // los commits que solo actualizan este registro no se cuentan como trabajo
  .filter((c) => !/^README: registro/i.test(c.mensaje));

const dias = [...new Set(commits.map((c) => c.fecha))];
const primero = commits.at(-1);
const ultimo = commits[0];

const filas = commits.map((c, i) => {
  // la fecha solo se escribe en el primer commit de cada día, para que se vean agrupados
  const fecha = i === 0 || commits[i - 1].fecha !== c.fecha ? `**${c.fecha}**` : '';
  return `| ${fecha} | ${c.hora} | ${c.mensaje} |`;
});

const seccion = [
  INICIO,
  `**${commits.length} commits** en **${dias.length} días de trabajo**, ` +
    `del ${primero.fecha} al ${ultimo.fecha} (lo más reciente arriba).`,
  '',
  '| Fecha | Hora | Trabajo realizado |',
  '|---|---|---|',
  ...filas,
  FIN,
].join('\n');

const readme = readFileSync('README.md', 'utf8').replace(/\r\n/g, '\n');
const desde = readme.indexOf(INICIO);
const hasta = readme.indexOf(FIN);
if (desde === -1 || hasta === -1) {
  throw new Error(`No encuentro las marcas ${INICIO} y ${FIN} en README.md`);
}
writeFileSync('README.md', readme.slice(0, desde) + seccion + readme.slice(hasta + FIN.length));
console.log(`Registro actualizado: ${commits.length} commits, último ${ultimo.fecha} ${ultimo.hora}.`);
