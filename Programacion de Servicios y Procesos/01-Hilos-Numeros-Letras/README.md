# 01 - Hilos: Numeros y Letras

Proyecto Maven sin dependencias externas: se abre en IntelliJ (File ->
Open, seleccionando esta carpeta) y se ejecuta `Main.java`.

## Que hace
- `HiloNumeros` extiende `Thread` e imprime 1, 2, 3 (con una pequenia
  pausa entre cada numero).
- `HiloLetras` extiende `Thread` e imprime A, B, C de la misma forma.
- `Main` crea los dos hilos y llama a `start()` en cada uno, asi que se
  ejecutan de forma concurrente: no se sabe de antemano en que orden van
  a salir los numeros y las letras por consola.

## Como ejecutarlo
Abre `Main.java` y pulsa el boton de Run junto a `public static void
main`. Ejecutalo varias veces: veras que el orden de entrelazado (1, A,
2, B, 3, C / A, 1, B, 2... ) cambia de una ejecucion a otra. Esa es la
prueba de que son hilos reales y no una simple llamada secuencial.

## Para entender el porque
`00-Apuntes/00-teoria-y-apuntes.md`, en la carpeta de la asignatura,
explica la diferencia entre ejecucion secuencial, concurrencia y
paralelismo, y por que `start()` no es lo mismo que llamar a `run()`
directamente (mira el comentario al final de `Main.java`).
