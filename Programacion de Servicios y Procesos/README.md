# Programacion de Servicios y Procesos (PSP)

Apuntes y ejercicios de PSP, con la misma estructura que el resto de
asignaturas de este curso: cada tema numerado es un proyecto Maven
independiente que se abre en IntelliJ con **File -> Open...**
seleccionando su carpeta (la que tiene el `pom.xml`).

## Estructura

```
Programacion de Servicios y Procesos/
├── 00-Apuntes/
│   └── 00-teoria-y-apuntes.md      <- secuencial, concurrencia, paralelismo, hilos en Java y colecciones thread-safe
├── 01-Hilos-Numeros-Letras/
│   ├── pom.xml
│   ├── README.md
│   └── src/main/java/com/jorge/hilos/
│       ├── Main.java
│       ├── HiloNumeros.java
│       └── HiloLetras.java
└── 02-Tienda-Dependientes-Clientes/
    ├── pom.xml
    ├── README.md
    └── src/main/java/com/jorge/tienda/
        └── Main.java
```

## 01 - Hilos: numeros y letras
Dos hilos (`Thread`) lanzados con `start()`: uno imprime 1, 2, 3 y el
otro A, B, C, entrelazandose por consola de forma no determinista. Es el
ejemplo mas simple para ver la diferencia entre ejecucion secuencial y
concurrente. Si el concepto no esta claro todavia, lee antes
`00-Apuntes/00-teoria-y-apuntes.md`.

## 02 - Tienda: dependientes y clientes
Basado en el ejemplo `CoffeeShop.java` de Blackboard: `Runnable` +
`ConcurrentLinkedQueue` + `interrupt()`/`join()` para cerrar, aplicado a
una tienda con dos zonas (3 dependientes de consumibles, 2 de ropa).
Cada cliente se reparte segun lo que busca; si no vendemos lo que busca,
no se le atiende. Explicado con mas detalle en el README de la carpeta y
en la Parte 7 de los apuntes.
