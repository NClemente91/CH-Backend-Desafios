#Creamos la base de datos
CREATE DATABASE IF NOT EXISTS prueba;

#Seleccionamos la base de datos
USE prueba;

#Creamos la tabla items
CREATE TABLE IF NOT EXISTS items(
	nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    stock INT,
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

#Insertamos datos en la tabla
INSERT INTO items (nombre, categoria, stock) VALUES ('Fideos','Harina','20');
INSERT INTO items (nombre, categoria, stock) VALUES ('Leche','Lácteos','30');
INSERT INTO items (nombre, categoria, stock) VALUES ('Crema','Lácteos','15');

#Mostramos los registros ingresados
SELECT * FROM items;

#Borramos el item con id = 1
DELETE FROM items WHERE id=1;

#Actualizamos el stock del item con id=2 a 45
UPDATE items SET stock=45 WHERE id=2;

#Volvemos a mostramos los registros ingresados
SELECT * FROM items;
