package com.jorge.tienda;

import java.util.Objects;
import java.util.concurrent.CountDownLatch;

/**
 * Only the critical section is protected by a private shared monitor.
 */
class SynchronizedBlockCounter03 {
    private static final Object LOCK = new Object();
    private static int counter = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread firstWorker = new Thread(() -> runIncrements(), "first-worker");
        Thread secondWorker = new Thread(() -> runIncrements(), "second-worker");

        firstWorker.start();
        secondWorker.start();

        firstWorker.join();
        secondWorker.join();

        System.out.println("Expected value: 200000");
        System.out.println("Actual value:   " + counter);
    }


    private static synchronized void runIncrements() {
        IO.println(Thread.currentThread().getName()+ " - Antes del lock");
        //synchronized (LOCK) {
            for (int i = 0; i < 100_000; i++) {
                if (counter%1000 ==0) {
                    IO.println(Thread.currentThread().getName()+" -Counter: "+ counter);
                }
                counter++;
            }
          //}
        IO.println(Thread.currentThread().getName()+" - Despues del lock");
    }
}
