-- Datos de demo para la tabla `products` (ejecutar en Supabase → SQL Editor).
-- Mezcla stock alto, bajo (<10) y agotado (0) para que se vean los tres colores de la pastilla.
-- Si ya hay productos de prueba y quieres empezar de cero, ejecuta antes:  delete from products;

insert into products (name, description, price, stock) values
  ('Teclado mecánico 75%', 'Switches rojos, layout ES, retroiluminado', 69.90, 25),
  ('Ratón inalámbrico', 'Ergonómico, 2.4 GHz y Bluetooth', 24.50, 40),
  ('Monitor 27" IPS', 'QHD, 144 Hz, 1 ms', 229.00, 8),
  ('Auriculares gaming', 'Cierre cerrado, micrófono desmontable', 39.99, 15),
  ('Webcam Full HD', '1080p a 60 fps con micrófono integrado', 49.90, 22),
  ('Hub USB-C 7 en 1', 'HDMI 4K, 2x USB-A, lector SD y carga 100 W', 34.95, 30),
  ('SSD externo 1 TB', 'USB 3.2, hasta 1050 MB/s', 89.00, 12),
  ('Alfombrilla XXL', 'Tela antideslizante, 90x40 cm', 14.99, 60),
  ('Soporte de portátil', 'Aluminio plegable, 6 alturas', 27.90, 18),
  ('Micrófono USB', 'Condensador cardioide con trípode', 59.00, 7),
  ('Altavoces 2.0', 'Bluetooth 5.3, 20 W RMS', 44.90, 14),
  ('Cargador GaN 65 W', '2 puertos USB-C y 1 USB-A', 32.50, 35),
  ('Cable HDMI 2.1', '2 metros, 8K a 60 Hz', 12.95, 80),
  ('Silla ergonómica', 'Respaldo de malla, soporte lumbar ajustable', 189.00, 4),
  ('Lámpara de escritorio LED', 'Regulable, carga inalámbrica en la base', 29.99, 20),
  ('Router Wi-Fi 6', 'Doble banda AX3000, 4 antenas', 79.90, 9),
  ('Tarjeta microSD 256 GB', 'Clase A2, ideal para consolas y cámaras', 21.90, 50),
  ('Teclado numérico USB', 'Compacto, 22 teclas', 11.50, 0),
  ('Ventilador para portátil', 'Base refrigerante con 5 ventiladores', 25.00, 0),
  ('Tableta gráfica', 'Área activa 10", lápiz sin batería', 64.90, 6);
