package com.jorge.tienda;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

// Ejercicio basado en CoffeeShop.java (Blackboard): mismo patron de
// concurrencia (Runnable + ConcurrentLinkedQueue compartida + interrupt()
// para cerrar), pero con dos zonas de la tienda en vez de una unica barra.
public class Main {

    private static final int NUM_DEPENDIENTES_CONSUMIBLES = 3;
    private static final int NUM_DEPENDIENTES_ROPA = 2;

    // Una cola segura para hilos por cada zona de la tienda
    private static final Queue<String> colaConsumibles = new ConcurrentLinkedQueue<>();
    private static final Queue<String> colaRopa = new ConcurrentLinkedQueue<>();

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== APERTURA DE LA TIENDA ===");

        // 1. CONTRATACION + 2. ACTIVACION: se crean y arrancan los dependientes
        Thread[] hilosConsumibles = new Thread[NUM_DEPENDIENTES_CONSUMIBLES];
        for (int i = 0; i < NUM_DEPENDIENTES_CONSUMIBLES; i++) {
            hilosConsumibles[i] = new Thread(new Dependiente(i + 1, "Consumibles", colaConsumibles),
                    "Dependiente-Consumibles-" + (i + 1));
            System.out.println("El dependiente de consumibles " + (i + 1) + " ha llegado a la tienda");
            hilosConsumibles[i].start();
        }

        Thread[] hilosRopa = new Thread[NUM_DEPENDIENTES_ROPA];
        for (int i = 0; i < NUM_DEPENDIENTES_ROPA; i++) {
            hilosRopa[i] = new Thread(new Dependiente(i + 1, "Ropa", colaRopa),
                    "Dependiente-Ropa-" + (i + 1));
            System.out.println("El dependiente de ropa " + (i + 1) + " ha llegado a la tienda");
            hilosRopa[i].start();
        }
        System.out.println("------------------------------------------");

        // 3. ATENCION A CLIENTES: cada cliente que llega se reparte segun lo
        // que busca; si no vendemos lo que busca, no se le atiende
        Cliente[] clientes = {
                new Cliente("Ana", "HW"), new Cliente("Luis", "ROPA"), new Cliente("Marta", "OTRO"),
                new Cliente("Pedro", "HW"), new Cliente("Sofia", "ROPA"), new Cliente("Diego", "HW"),
                new Cliente("Laura", "OTRO"), new Cliente("Carlos", "ROPA"), new Cliente("Elena", "HW"),
                new Cliente("Javier", "ROPA")
        };

        for (Cliente cliente : clientes) {
            System.out.println("[LLEGADA] " + cliente.nombre() + " entra buscando " + cliente.busca());

            switch (cliente.busca()) {
                case "HW" -> colaConsumibles.add(cliente.nombre());
                case "ROPA" -> colaRopa.add(cliente.nombre());
                default -> System.out.println("[NO ATENDIDO] " + cliente.nombre() + " busca algo que no vendemos.");
            }

            Thread.sleep((long) (Math.random() * 300 + 100)); // espera breve entre clientes
        }

        // Esperar a que las dos colas se vacien por completo
        while (!colaConsumibles.isEmpty() || !colaRopa.isEmpty()) {
            Thread.sleep(200);
        }

        System.out.println("\n=== TODOS LOS CLIENTES HAN SIDO ATENDIDOS ===");

        // 5. CIERRE: avisar/interrumpir a los dependientes para que acaben su turno
        for (Thread h : hilosConsumibles) h.interrupt();
        for (Thread h : hilosRopa) h.interrupt();

        // Esperar ordenadamente a que todos los hilos mueran
        for (Thread h : hilosConsumibles) h.join();
        for (Thread h : hilosRopa) h.join();

        System.out.println("=== CIERRE DE LA TIENDA ===");
    }

    // Cliente que entra en la tienda: su nombre y lo que busca (HW, ROPA u OTRO)
    private record Cliente(String nombre, String busca) {
    }

    // Dependiente, igual que el Camarero del ejemplo: un Runnable que repite
    // su bucle de trabajo (4. BUCLE DE TRABAJO) mientras no lo interrumpan
    private static class Dependiente implements Runnable {
        private final int id;
        private final String zona;
        private final Queue<String> cola;

        public Dependiente(int id, String zona, Queue<String> cola) {
            this.id = id;
            this.zona = zona;
            this.cola = cola;
        }

        @Override
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    // poll() saca un cliente de forma segura; si esta vacia, null
                    String cliente = cola.poll();

                    if (cliente != null) {
                        System.out.println("[SERVICIO] Dependiente " + zona + "-" + id + " atiende a " + cliente);
                        Thread.sleep((long) (Math.random() * 800 + 400)); // tiempo simulado de atencion
                    } else {
                        Thread.sleep(100); // no hay clientes ahora mismo, vuelve a mirar en breve
                    }
                }
            } catch (InterruptedException e) {
                // el main interrumpe cuando ya no quedan clientes en ninguna cola
            }
            System.out.println("Dependiente " + zona + "-" + id + " ha terminado su turno.");
        }
    }
}
