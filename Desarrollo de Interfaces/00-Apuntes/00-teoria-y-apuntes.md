# Desarrollo de Interfaces — resumen simple de qué estoy haciendo

Esto no es documentación técnica a fondo (esa ya la tenías, si la necesitas
la recupero). Es la versión "para enterarme de qué va la asignatura sin
comerme la cabeza con el front", centrada sobre todo en Git/GitHub, que es
lo que me interesa de verdad.

---

## 1. La idea general de la asignatura

Desarrollo de Interfaces va de hacer la parte visual de una app: las
pantallas, los botones, las listas... lo que ve el usuario. Se usan tres
herramientas que van encajadas una dentro de otra:

- **TypeScript**: es JavaScript, pero más ordenado (avisa si te
  equivocas de tipo de dato antes de que explote).
- **Angular**: el framework que organiza el código en "componentes"
  (cada pantalla es un trocito independiente).
- **Ionic**: se pone encima de Angular y te da botones, listas y
  cabeceras que ya parecen de móvil, para no tener que diseñarlos tú.

En la práctica: escribes lógica en TypeScript, la metes en un componente
de Angular, y usas las piezas visuales de Ionic para que se vea bien.
Con `ionic serve` lo ves funcionando en el navegador, tal cual se vería
en el móvil.

No hace falta que te aprendas el porqué de cada pieza. Con saber que hay
tres capas (lógica → componente → estética) vale.

## 2. Qué hemos hecho, en cristiano

1. Creamos una carpeta ordenada en tu PC para la asignatura
   (`C:\DAM 2\Desarrollo de Interfaces`), siguiendo el mismo esquema que
   ya usabas en otras asignaturas.
2. Metimos esa carpeta bajo control de Git (el programa que guarda un
   historial de cambios — lo explico abajo).
3. Creamos un proyecto de Ionic/Angular vacío llamado `usersApp`.
4. Le hicimos una pantalla sencilla: una lista de usuarios, donde solo
   se muestran los que están activos.
5. Nos encontramos un bug (la pantalla se quedaba en "Cargando" para
   siempre) y lo arreglamos.
6. Subimos todo a GitHub, en varios commits.
7. Aparte, hicimos la tarea de Ionic con el componente `galeria` (esa
   la tienes en su propio informe, con capturas).
8. Creamos la rama `develop` y subimos ahí el trabajo, por separado de
   la rama principal.

Eso es literalmente todo. El resto de este documento es la chuleta de
GitHub, que es la parte que de verdad quieres tener clara.

---

## 3. Git y GitHub, explicado sin tecnicismos

Piensa en ello como el **historial de versiones de un documento**, pero
para código, y con copia de seguridad en internet.

- **Git**: un programa instalado en tu PC que vigila una carpeta y va
  guardando "fotos" del estado de los archivos cada vez que tú se lo
  pides. Si la lías, puedes volver a una foto anterior.
- **Commit**: una de esas fotos. Lleva una fecha, un mensaje ("qué he
  cambiado") y queda guardada para siempre en el historial.
- **Repositorio (repo)**: la carpeta entera, junto con todo su
  historial de fotos (commits).
- **GitHub**: una página web que guarda una copia de ese repositorio en
  internet. Sirve para tres cosas: tener una copia de seguridad fuera
  de tu PC, que otra persona (el profesor) pueda verlo, y poder
  trabajar desde varios ordenadores.
- **`git push`**: el botón de "subir mis fotos nuevas a GitHub".
- **`git pull`**: el contrario, "bajarme las fotos que hay en GitHub y
  no tengo en este PC".
- **Rama (branch)**: una copia paralela del proyecto, para tocar cosas
  sin liar la versión "buena". La rama principal se suele llamar
  `main`. Nosotros creamos una rama aparte, `develop`, para ir
  trabajando ahí, y algún día fusionarla (merge) con `main` cuando
  esté terminada.
- **Vercel**: una web que coge tu proyecto (el código) y lo "publica" en
  internet con una URL real, para que cualquiera lo pueda abrir sin
  tener que instalar nada. Normalmente se conecta directamente a tu
  repositorio de GitHub: cada vez que haces `push`, Vercel se entera
  sola y vuelve a publicar la versión nueva automáticamente. No lo
  hemos usado todavía en esta asignatura (aquí solo enseñamos el
  proyecto en local, con `ionic serve`), pero es la herramienta típica
  para cuando quieres que un proyecto web se vea "en real", no solo en
  tu PC.
- **Token de acceso**: como una contraseña temporal y limitada que le
  diste a GitHub para que, desde tu PC, pudiera subir cambios sin usar
  tu contraseña real. Se puede revocar cuando quieras, sin que afecte a
  tu cuenta.

### Lo que usas casi siempre, en 4 pasos

Cuando cambias algo en el código y lo quieres guardar en GitHub, es
siempre la misma secuencia:

1. **`git add -A`** — "marca todos los archivos que he tocado, los
   quiero guardar".
2. **`git commit -m "qué he hecho"`** — "haz la foto, con esta nota".
3. **`git push`** — "sube esa foto a GitHub".
4. (Opcional) **`git status`** — "¿qué tengo pendiente de guardar
   ahora mismo?", para comprobar antes de hacer los pasos de arriba.

Con VS Code no hace falta ni escribir los comandos: hay un icono a la
izquierda con forma de rama (Source Control) donde ves los cambios,
escribes el mensaje, y pulsas el botón de confirmar y luego el de
subir.

### Tu repositorio

`https://github.com/JorgeGonzalezDI/Desarrollo-Interfaces-DAM-2`

Rama de trabajo: **develop**. Rama principal (la "oficial"): **main**.

---

## 4. Si un día quieres el detalle técnico

Si más adelante necesitas entender el código a fondo (para un examen,
por ejemplo), pídemelo y te lo recupero — lo tenía todo explicado línea
a línea (services, signals, interfaces, rutas...). De momento me quedo
con esta versión, que es la que querías: saber qué estás haciendo, sin
meterte en el barro del front.
