# 02 - Tienda: Dependientes y Clientes

Basado en el ejemplo `CoffeeShop.java` de Blackboard: mismo patron de
concurrencia (un `Runnable` por trabajador + `ConcurrentLinkedQueue`
compartida + `interrupt()` para avisar del cierre), pero con dos zonas de
la tienda (consumibles y ropa) en vez de una unica barra de cafeteria.

Proyecto Maven sin dependencias externas, una unica clase (`Main.java`),
igual que el ejemplo original. Se abre en IntelliJ (File -> Open,
seleccionando esta carpeta) y se ejecuta `Main.java`.

Hay 5 ficheros sueltos (`Cliente.java`, `TipoCliente.java`, `Zona.java`,
`ColaClientes.java`, `Dependiente.java`) de una version anterior que ya
no se usa -- puedes borrarlos desde IntelliJ (clic derecho > Delete), no
hacen nada.

## Como encaja con CoffeeShop.java

| CoffeeShop.java (ejemplo) | Este ejercicio |
|---|---|
| `Camarero implements Runnable` | `Dependiente implements Runnable` (clase anidada en `Main`, igual que el ejemplo) |
| Una `ConcurrentLinkedQueue<String>` para todos los camareros | Dos colas, `colaConsumibles` y `colaRopa` -- cada dependiente solo mira la suya |
| Todos los clientes son iguales | Cada `Cliente` (nombre + lo que busca) se reparte a la cola de su zona; si busca algo que no vendemos (OTRO), no se le atiende |
| `poll()` + `Thread.sleep(100)` si no hay cliente | Igual: los dependientes no se bloquean, consultan su cola y esperan un poco si esta vacia |
| `main` espera a que la cola este vacia, luego `interrupt()` + `join()` | Igual, pero esperando a que **las dos** colas esten vacias |

## Los 5 pasos del enunciado, en el codigo
1. **Contratacion (new)**: se crean los `Dependiente` (3 de consumibles, 2 de ropa) -- crear el objeto todavia no lo pone a trabajar.
2. **Activacion (start)**: `new Thread(dependiente, nombre).start()` en cada uno.
3. **Atencion a clientes**: segun `cliente.busca()` (HW/ROPA/OTRO), se reparte a la cola correspondiente, o se descarta con el mensaje `[NO ATENDIDO]`.
4. **Bucle de trabajo**: `while (!Thread.currentThread().isInterrupted())` en `Dependiente.run()` -- igual que el `Camarero` del ejemplo.
5. **Cierre**: cuando las dos colas se vacian, `main` llama a `interrupt()` sobre todos los hilos y luego `join()` para esperar a que terminen de verdad antes de imprimir el cierre.

## Como ejecutarlo
Abre `Main.java` y pulsa Run. El orden exacto de quien atiende a quien
varia en cada ejecucion (tiempos de `Math.random()`, como en el
ejemplo), pero siempre se atienden todos los de HW y ROPA, se descartan
los OTRO, y la tienda cierra limpiamente al final.
