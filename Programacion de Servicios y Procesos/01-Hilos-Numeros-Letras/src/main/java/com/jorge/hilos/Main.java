package com.jorge.hilos;

// Punto de entrada: crea los dos hilos y los arranca con start(), por lo
// que pasan a ejecutarse de forma concurrente, repartiendose el tiempo
// de CPU segun decida el planificador de la JVM / sistema operativo.
public class Main {
    public static void main(String[] args) {
        Thread hiloNumeros = new Thread(() -> System.out.println("1 2 3"));
        Thread hiloLetras = new Thread(() -> System.out.println("A B C")) ;

        System.out.println("Hilo principal: arrancando los dos hilos...");

        hiloNumeros.start();
        hiloLetras.start();

        System.out.println("Hilo principal: hilos lanzados, sigo mi camino sin esperarlos.");

        // Nota: si en vez de start() llamasemos a hiloNumeros.run() y
        // hiloLetras.run() directamente, NO se crearia ningun hilo
        // nuevo: el codigo se ejecutaria de forma secuencial, dentro de
        // ESTE mismo hilo (primero las 3 lineas de uno, luego las 3 del
        // otro, sin ningun entrelazado). Pruebalo cambiando start() por
        // run() para verlo con tus propios ojos.
    }
}
