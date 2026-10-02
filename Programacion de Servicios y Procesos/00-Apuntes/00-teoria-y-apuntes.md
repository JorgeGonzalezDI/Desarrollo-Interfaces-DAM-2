# Hilos, ejecución secuencial, concurrencia y paralelismo

---

## Antes de la Parte 0 · Por qué hacen falta los hilos, explicado con la tienda

Imagina que llevas tú solo una tienda. Todo lo que pasa, pasa en fila, uno detrás de otro: atiendes a un cliente, cuando terminas con él pasas al siguiente, nunca dos cosas a la vez. Eso es un programa **secuencial**: una instrucción detrás de otra, sin saltarse el orden, y si una tarda mucho (esperar a que un cliente decida qué quiere), todo lo demás se queda parado esperando, aunque no tenga nada que ver.

Ahora imagina que contratas a más gente. Cada persona nueva puede atender a su propio cliente **al mismo tiempo** que tú, sin esperarte ni que tú la esperes a ella. Eso, en un programa, es un **hilo** (*thread*): otro "trabajador" que hace lo suyo en paralelo, dentro del mismo programa.

### Contratar no es lo mismo que empezar a trabajar

En Java hay que separar dos cosas que parecen la misma pero no lo son: **qué tiene que hacer** el trabajador, y **el trabajador que lo hace**.

- Lo primero — las instrucciones del puesto — es lo que escribes dentro de `run()`. Es como una ficha de trabajo en papel: describe la tarea, pero mientras nadie la coja, no se ejecuta nada.
- Lo segundo es el objeto `Thread`. Cuando haces `new Thread(esasInstrucciones)`, es como fichar a alguien para ese puesto. Pero tampoco ha empezado a trabajar todavía, solo está contratado.
- El momento en que de verdad empieza a trabajar en paralelo es `.start()`. Antes de `.start()` no hay nada simultáneo; después, sí.

Por eso en el ejercicio hay tres pasos distintos: escribir el trabajo (`Dependiente`), contratar a alguien para ese trabajo (`new Thread(...)`), y decirle que empiece (`.start()`).

### El peligro de compartir cosas

Si tienes varios trabajadores que necesitan mirar la misma lista de clientes pendientes, hay un riesgo: si dos cogen el mismo papelito a la vez, se pisan — uno puede coger un papelito que el otro está dejando a medias, o los dos pueden creer que han cogido el mismo. A esto se le llama **condición de carrera**, y pasa porque una lista normal (`ArrayList`, `LinkedList`...) no está pensada para que dos personas metan la mano dentro a la vez.

La solución es usar una bandeja especial, ya diseñada para que varios trabajadores metan y saquen papelitos al mismo tiempo sin pisarse nunca: eso es exactamente `ConcurrentLinkedQueue`. No es una lista cualquiera — es una lista "a prueba de que varios hilos la toquen a la vez".

### El trabajo en bucle: mirar, coger o esperar

Cada dependiente hace, una y otra vez, lo mismo: mira la bandeja (`poll()`). Si hay un papelito, lo coge y atiende a ese cliente. Si no hay nada, no se queda plantado para siempre — dice "nada por ahora" y vuelve a mirar un poco después. Por eso hay un bucle que no para: es, literalmente, su jornada laboral repetida sin fin, hasta que alguien le diga que se acabó.

### Decirle a alguien que pare

Un hilo no se puede "apagar" de golpe desde fuera — sería peligroso, podrías cortarlo a mitad de algo. Lo que se hace es avisarle: `interrupt()` es como tocarle el hombro y decir "cerramos". Él, por su cuenta, se da cuenta del aviso (lo comprueba cada vuelta de su bucle, o le despierta de golpe si estaba echando una cabezadita) y decide parar. Nadie lo obliga desde fuera, se le pide y él para cuando le toca.

Y como pedir que pare no es lo mismo que confirmar que ya ha parado, el jefe (`main`) se queda esperando en la puerta a que cada uno confirme que se ha ido de verdad — eso es `join()`.

### Cómo se traduce esto al código de 02-Tienda-Dependientes-Clientes

| La idea | En `Main.java` |
|---|---|
| La ficha de trabajo (qué hay que hacer) | la clase `Dependiente implements Runnable`, con su `run()` |
| Contratar a alguien para esa ficha | `new Thread(new Dependiente(...), "nombre")` |
| Decirle que empiece a trabajar en paralelo | `.start()` |
| La bandeja especial compartida | `ConcurrentLinkedQueue<String> colaConsumibles` / `colaRopa` |
| Mirar la bandeja sin quedarse esperando | `cola.poll()` — si no hay nada, devuelve `null` al instante |
| Su jornada laboral repetida | `while (!Thread.currentThread().isInterrupted()) { ... }` |
| Avisarle de que cierre | `hilo.interrupt()` |
| Confirmar que ya se ha ido de verdad | `hilo.join()` |

Si te quedas con esto — **contratar no es empezar a trabajar, una bandeja compartida tiene que ser especial, cada trabajador mira-coge-o-espera en bucle, pedir que pare no es lo mismo que confirmar que ha parado** — tienes el esqueleto entero del ejercicio en la cabeza, no solo memorizado línea a línea.

---

## Parte 0 · Proceso vs. hilo

- **Proceso**: programa en ejecución con su propio espacio de memoria, gestionado por el sistema operativo.
- **Hilo (thread)**: unidad de ejecución dentro de un proceso. Todos los hilos de un mismo proceso comparten memoria (variables, objetos), pero cada uno tiene su propia pila de llamadas y su propio contador de programa.
- Todo proceso tiene al menos un hilo (el principal). Crear hilos adicionales permite que ese mismo proceso haga varias cosas "a la vez" sin necesidad de lanzar procesos nuevos, que son mucho más caros.

## Parte 1 · Ejecución secuencial

Las instrucciones se ejecutan una detrás de otra, en un único flujo: no empieza la siguiente tarea hasta que termina la anterior por completo. Es el modelo por defecto de cualquier programa sin hilos — todo ocurre en el hilo principal, en el orden exacto en que está escrito el código.

## Parte 2 · Concurrencia

Varias tareas **avanzan durante el mismo intervalo de tiempo**, aunque no necesariamente en el mismo instante exacto. En una máquina con un solo núcleo, el sistema operativo reparte el tiempo de CPU entre los hilos (*time-slicing*, cambio de contexto), dando sensación de simultaneidad aunque en realidad se van turnando muy rápido.

- Es un concepto de **diseño**: cómo estructuro el programa para que varias tareas puedan progresar sin bloquearse unas a otras.
- El orden exacto de ejecución **no está garantizado**: depende del planificador (*scheduler*) de la JVM y del sistema operativo. Por eso la salida de un programa concurrente puede cambiar entre ejecuciones.

## Parte 3 · Paralelismo

Varias tareas se ejecutan **realmente al mismo tiempo**, en núcleos o procesadores físicos distintos. Es un concepto de **ejecución física**: hace falta hardware con más de un núcleo para que exista paralelismo real.

- Concurrencia sin paralelismo: dos hilos en una CPU de un solo núcleo, turnándose.
- Paralelismo real: cuatro hilos repartidos entre cuatro núcleos, avanzando literalmente a la vez.
- En la práctica, un programa concurrente en una máquina multinúcleo se beneficia de paralelismo real sin que el programador tenga que hacer nada especial: la JVM reparte los hilos entre los núcleos disponibles.

## Parte 4 · Concurrencia vs. paralelismo — tabla resumen

| | Concurrencia | Paralelismo |
|---|---|---|
| Qué es | Gestionar varias tareas a la vez (diseño) | Ejecutar varias tareas a la vez (hardware) |
| ¿Requiere varios núcleos? | No | Sí |
| Orden de ejecución | No determinista | Simultáneo real |
| Ejemplo | Un núcleo alternando entre 2 hilos | 4 núcleos ejecutando 4 hilos a la vez |

## Parte 5 · Hilos en Java: Thread, Runnable, start() vs. run()

Dos formas habituales de definir el código que ejecutará un hilo:

- **Extender `Thread`** y sobrescribir `run()` — la que se usa en el ejercicio `01-Hilos-Numeros-Letras`.
- **Implementar `Runnable`** y pasar esa instancia a `new Thread(runnable, nombre)` — más flexible, porque la clase queda libre para heredar de otra cosa (Java no permite herencia múltiple). Es la que usa `CoffeeShop.java` y `02-Tienda-Dependientes-Clientes`.

Puntos clave:

- **`start()`** crea de verdad un hilo nuevo del sistema y, en él, llama a `run()`. El hilo que invoca `start()` continúa su propio camino sin esperar a que el nuevo hilo termine.
- **`run()`** llamado directamente, sin pasar por `start()`, **no crea ningún hilo nuevo**: simplemente ejecuta ese método como una llamada normal, dentro del hilo actual. Esa es la diferencia real entre concurrente (`start()`) y secuencial (`run()` a pelo) — mismo código, comportamiento completamente distinto.
- Un hilo solo se puede arrancar una vez: llamar a `start()` dos veces sobre el mismo objeto lanza `IllegalThreadStateException`.
- **Ciclo de vida** de un hilo: `NEW` → `RUNNABLE` → (`BLOCKED` / `WAITING` / `TIMED_WAITING`) → `TERMINATED`.

## Parte 6 · Lo que viene: compartir datos entre hilos

En el ejercicio de `01-Hilos-Numeros-Letras` cada hilo solo toca sus propias variables locales, así que no hay ningún problema. En cuanto dos hilos leen y escriben las **mismas** variables compartidas aparecen las condiciones de carrera (*race conditions*): el resultado final depende del orden exacto en que se entrelacen las instrucciones, y ese orden no es fijo. Hay dos formas habituales de resolverlo: sincronización manual (`synchronized`, `wait()`/`notifyAll()`) o colecciones ya preparadas para hilos (`java.util.concurrent`) — la Parte 7 desarrolla la segunda, que es la que usa el ejercicio `02-Tienda-Dependientes-Clientes`.

## Parte 7 · Colecciones seguras para hilos y cierre cooperativo (interrupt)

### ConcurrentLinkedQueue y poll()

`ConcurrentLinkedQueue<T>` es una cola en la que varios hilos pueden hacer `add()` y `poll()` a la vez sin tener que escribir `synchronized` en ningún sitio — la propia clase se encarga de que dos hilos nunca se pisen por dentro.

- `poll()` **no bloquea**: si la cola está vacía, devuelve `null` al instante en vez de esperar. Por eso cada dependiente, cuando `poll()` le devuelve `null`, hace un `Thread.sleep(100)` corto y vuelve a intentarlo — es *polling* con pausa: más simple de escribir que `wait()`/`notifyAll()`, a cambio de gastar algo de CPU comprobando la cola de vez en cuando.
- Es la alternativa "fácil" a sincronizar una `LinkedList` a mano con `synchronized`/`wait()`/`notifyAll()`: mismo problema (varios hilos compartiendo una cola), solución ya resuelta por la biblioteca estándar.

### Cierre cooperativo con interrupt()

Un hilo en Java no se puede "matar" desde fuera de forma segura. En su lugar se usa una señal cooperativa:

- **`hilo.interrupt()`** marca al hilo como interrumpido y, si en ese momento está dormido (`Thread.sleep(...)`, `wait()`...), lo despierta lanzándole una `InterruptedException`.
- El propio hilo decide qué hacer con el aviso: en `Dependiente.run()`, el bucle `while (!Thread.currentThread().isInterrupted())` comprueba la bandera en cada vuelta, y el `catch (InterruptedException e)` recoge el aviso si estaba dormido en ese instante. En los dos casos, el hilo termina su `run()` por su cuenta — nadie lo fuerza desde fuera, solo se le pide que pare.
- **`hilo.join()`** hace que el hilo que lo llama (normalmente el principal) espere a que ese otro hilo termine **de verdad** su `run()`. Por eso después de `interrupt()` siempre se hace `join()`: interrumpir solo pide que pare, `join()` confirma que ya ha parado antes de seguir (por ejemplo, antes de imprimir que la tienda ha cerrado).

En resumen, el patrón completo de `02-Tienda-Dependientes-Clientes` (igual que `CoffeeShop.java`) es: **cola segura para hilos** + **trabajadores haciendo polling con pausa** + **cierre avisando con `interrupt()`** + **`join()` para confirmar que todos han terminado**.
