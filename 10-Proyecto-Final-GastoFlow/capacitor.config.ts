import type { CapacitorConfig } from '@capacitor/cli';

// Configuración de Capacitor: permite empaquetar la misma web como app nativa (Android/iOS).
// webDir = carpeta donde Angular deja la app compilada (ver outputPath en angular.json).
const config: CapacitorConfig = {
  appId: 'dev.jorgegonzalez.gastoflow',
  appName: 'GastoFlow',
  webDir: 'www',
};

export default config;
