use cinerama

CREATE TABLE cines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ciudad VARCHAR(80),
    direccion VARCHAR(180),
    activo TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cines (nombre, ciudad, direccion) VALUES
('CINERAMA PACIFICO', 'LIMA', 'AV JOSE PARDO 121 MIRAFLORES - LIMA - LIMA'),
('CINERAMA MINKA', 'CALLAO', 'AV ARGENTINA 3093 CC MINKA 2DO NIVEL CALLAO'),
('CINERAMA CHIMBOTE', 'CHIMBOTE', 'AV. V. RAUL H. DE LA TORRE MEGA PLAZA CHIMBOTE'),
('CINERAMA QUINDE', 'ICA', 'AV LOS MAESTROS S/N CC EL QUINDE'),
('CINERAMA TARAPOTO', 'TARAPOTO', 'AV ALFONSO UGARTE 1360 TARAPOTO'),
('CINERAMA CAJAMARCA', 'CAJAMARCA', 'JR SOR MANUELA GIL 151 CC EL QUINDE CAJAMARCA'),
('CINERAMA SOL', 'ICA', 'AV SAN MARTIN 727 CC PLAZA DEL SOL ICA'),
('CINERAMA HUACHO', 'HUACHO', 'COLON 601 CC PLAZA DEL SOL 2DO NIVEL'),
('CINERAMA MOYOBAMBA', 'MOYOBAMBA', 'JR MANUEL DEL AGUILA 542 MOYOBAMBA'),
('CINERAMA CUZCO', 'CUSCO', 'CALLE CRUZ VERDE 347 CC IMPERIAL PLAZA CUSCO'),
('CINERAMA PIURA', 'PIURA', 'AV GRAU 1460 CC. PLAZA DEL SOL');

CREATE TABLE peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,    -- lilo, karate, encerrado, hurry
    titulo VARCHAR(150) NOT NULL,
    director VARCHAR(120),
    duracion_min INT,
    clasificacion VARCHAR(50),
    genero VARCHAR(60),
    estado ENUM('EN_CARTELERA','PROXIMO','RETIRADO') DEFAULT 'EN_CARTELERA'
);

ALTER TABLE peliculas
ADD estreno DATE NULL,
ADD reparto TEXT NULL;

INSERT INTO peliculas (codigo, titulo, director, duracion_min, clasificacion, genero, estreno, reparto)
VALUES
('chavin', 'CHAVIN DE HUANTAR EL RESCATE DEL SIGLO', 'DIEGO DE LEÓN', 95, 'MAYORES DE 14', 'ANIMADO', '2025-10-30', 
 'ALFONSO DIBÓS, ANDRE SILVA, CARLOS THORNTON, CHRISTIAN ESQUIVEL, CONNIE CHAPARRO, MIGUEL IZA, RODRIGO SÁNCHEZ, SERGIO GALLIANI'),

('hurry', 'Hurry', 'DIRECTOR X', 100, 'TODO ESPECTADOR', 'AVENTURA/FAMILIAR', '2025-08-01',
 'Actores y actrices reconocidos'),

('zootopia2', 'ZOOTOPIA 2', 'JARED BUSH, BYRON HOWARD', 108, 'TODO ESPECTADOR', 'ANIMACIÓN', '2025-11-27',
 '-'),

('nada3', 'NADA ES LO QUE PARECE 3', 'RUBEN FLEISCHER', 112, 'MAYORES DE 14', 'ACCIÓN', '2025-11-13',
 'MORGAN FREEMAN, ROSAMUND PIKE, WOODY HARRELSON');


CREATE TABLE funciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cine_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    tipo_cine ENUM('2D','3D') NOT NULL,
    sala VARCHAR(10) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    precio DECIMAL(8,2) NOT NULL DEFAULT 12.00,
    FOREIGN KEY (cine_id) REFERENCES cines(id),
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);


-- Supongamos:
-- CINERAMA PACIFICO tiene id = 1
-- Lilo y Stitch tiene id = 1

INSERT INTO funciones (cine_id, pelicula_id, tipo_cine, sala, fecha, hora, precio)
VALUES
(1, 1, '2D', '01', CURDATE(), '15:20:00', 12.00),
(1, 1, '2D', '01', CURDATE(), '17:00:00', 12.00),
(1, 1, '3D', '02', CURDATE(), '19:10:00', 15.00);


CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Paso 1: cine
    cine VARCHAR(120) NOT NULL,

    -- Paso 2: película (lo conectaremos cuando actualices info.js)
    pelicula_codigo VARCHAR(30) NULL,
    pelicula_titulo VARCHAR(150) NULL,

    -- Paso 3: horario (podemos vincular a funciones.id después)
    funcion_id INT NULL,
    tipo_cine VARCHAR(5) NULL,          -- '2D' o '3D'
    sala VARCHAR(10) NULL,
    horario VARCHAR(10) NULL,           -- '03:20 pm', etc.

    -- Paso 4: asientos
    asientos VARCHAR(255) NULL,         -- ej: 'A1,A2,A3'
    cantidad_entradas INT NULL,
    monto_entradas DECIMAL(8,2) NULL,

    -- Paso 5: pago (esto es lo que YA usa tu pago.js)
    nombre_cliente VARCHAR(120) NULL,
    correo_cliente VARCHAR(120) NULL,
    metodo_pago VARCHAR(30) NULL,       -- 'tarjeta' / 'billetera'
    billetera VARCHAR(20) NULL,         -- 'Yape' / 'Plin' / NULL
    estado ENUM('PENDIENTE','PAGADO','CANCELADO') DEFAULT 'PENDIENTE',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);



ALTER TABLE reservas
ADD CONSTRAINT fk_reservas_funciones
FOREIGN KEY (funcion_id)
REFERENCES funciones(id);



ALTER TABLE reservas
ADD COLUMN tipo_sala ENUM('2D', '3D') AFTER pelicula;


select * from reservas r ;


CREATE TABLE formatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('2D','3D') NOT NULL
);

INSERT INTO formatos (nombre) VALUES ('2D'), ('3D');

CREATE TABLE horarios_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pelicula_id INT NOT NULL,
    hora TIME NOT NULL,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

SELECT * FROM formatos;
SELECT * FROM horarios_base;


INSERT INTO horarios_base (pelicula_id, hora) VALUES
(1, '15:20:00'),
(2, '16:40:00'),
(3, '18:10:00'),
(4, '19:30:00');


CREATE TABLE salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cine_id INT NOT NULL,
    nombre VARCHAR(10) NOT NULL,
    total_asientos INT NOT NULL,
    FOREIGN KEY (cine_id) REFERENCES cines(id)
);

CREATE TABLE asientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    fila VARCHAR(5) NOT NULL,
    numero INT NOT NULL,
    FOREIGN KEY (sala_id) REFERENCES salas(id)
);

CREATE TABLE asientos_reservados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    funcion_id INT NOT NULL,
    asiento_id INT NOT NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    FOREIGN KEY (funcion_id) REFERENCES funciones(id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id)
);


CREATE TABLE entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    funcion_id INT NOT NULL,
    precio DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    FOREIGN KEY (funcion_id) REFERENCES funciones(id)
);

SHOW TABLES;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20),
    telefono VARCHAR(20)
);

CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

INSERT INTO metodos_pago (nombre) VALUES ('tarjeta'), ('billetera');

CREATE TABLE billeteras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

INSERT INTO billeteras (nombre) VALUES ('Yape'), ('Plin');


CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    cliente_id INT NOT NULL,
    metodo_pago_id INT NOT NULL,
    billetera_id INT NULL,
    monto DECIMAL(8,2) NOT NULL,
    estado ENUM('PENDIENTE','PAGADO','RECHAZADO') DEFAULT 'PENDIENTE',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id),
    FOREIGN KEY (billetera_id) REFERENCES billeteras(id)
);


SELECT * FROM cines;

SELECT * FROM peliculas;

SELECT * FROM funciones;

SELECT * FROM reservas;

SELECT * FROM salas;

SELECT * FROM asientos;

SELECT * FROM asientos_reservados;

SELECT * FROM entradas;

SELECT * FROM formatos;

SELECT * FROM horarios_base;

SELECT * FROM reservas
WHERE estado = 'PAGADO';


SELECT asientos
FROM reservas
WHERE pelicula_titulo = 'Hurry'
  AND sala = '02'
  AND horario = '04:00 pm'
  AND estado = 'PAGADO';

SELECT
  cine,
  pelicula_titulo,
  tipo_cine,
  sala,
  horario,
  asientos,
  cantidad_entradas,
  monto_entradas,
  nombre_cliente,
  correo_cliente,
  metodo_pago,
  estado
FROM reservas;


SHOW TABLES;

DESCRIBE salas;
DESCRIBE asientos;
DESCRIBE asientos_reservados;
DESCRIBE entradas;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),      -- Combo, Bebida, Dulce
    precio DECIMAL(8,2) NOT NULL,
    activo TINYINT(1) DEFAULT 1
);


CREATE TABLE productos_reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO productos (nombre, categoria, precio) VALUES
('Combo Pollo', 'Combo', 25.00),
('Combo Nachos', 'Combo', 18.00),
('Gaseosa', 'Bebida', 6.00),
('Agua', 'Bebida', 4.00),
('Galletas', 'Snack', 4.00),
('Popcorn Grande', 'Snack', 12.00);


select * from productos

DESCRIBE reservas;


SHOW CREATE TABLE reservas;


ALTER TABLE reservas
MODIFY estado ENUM('PENDIENTE','RESERVADO','PAGADO','CANCELADO')
DEFAULT 'PENDIENTE';

SELECT 
  id,
  cine,
  pelicula_titulo,
  sala,
  horario,
  estado
FROM reservas
ORDER BY id DESC
LIMIT 20;

SELECT 
  id,
  cine,
  pelicula_titulo,
  sala,
  horario,
  estado
FROM reservas
WHERE pelicula_titulo LIKE '%zoo%';

SELECT 
  cine,
  pelicula_titulo,
  sala,
  horario,
  asientos,
  estado
FROM reservas
WHERE estado IN ('RESERVADO','PAGADO');

SELECT 
  pelicula_titulo,
  COUNT(*) AS total
FROM reservas
GROUP BY pelicula_titulo;

SELECT cine, pelicula_titulo, sala, horario, asientos, estado
FROM reservas
WHERE estado IN ('RESERVADO', 'PAGADO');

ALTER TABLE reservas 
MODIFY estado ENUM('PENDIENTE','RESERVADO','PAGADO','CANCELADO') 
DEFAULT 'PENDIENTE';

CREATE TABLE mensajes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    cine VARCHAR(120) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from mensajes_contacto;

SELECT
    id,
    cine,
    estado,
    fecha_creacion
FROM reservas
ORDER BY id DESC
LIMIT 10;

SELECT
    id,
    cine,
    pelicula_titulo,
    tipo_cine,
    sala,
    horario,
    estado
FROM reservas
ORDER BY id DESC
LIMIT 5;

SELECT
    id,
    cine,
    pelicula_titulo,
    tipo_cine,
    sala,
    horario,
    asientos,
    cantidad_entradas,
    monto_entradas,
    estado
FROM reservas
ORDER BY id DESC
LIMIT 5;

SELECT
    id,
    cine,
    pelicula_titulo,
    tipo_cine,
    sala,
    horario,
    asientos,
    cantidad_entradas,
    monto_entradas,
    nombre_cliente,
    correo_cliente,
    metodo_pago,
    billetera,
    estado
FROM reservas
ORDER BY id DESC
LIMIT 5;

USE cinerama;

DELETE FROM funciones
WHERE cine_id = 1
  AND pelicula_id = 1;

INSERT INTO funciones
(
    cine_id,
    pelicula_id,
    tipo_cine,
    sala,
    fecha,
    hora,
    precio
)
VALUES
(
    1,
    1,
    '2D',
    '01',
    CURDATE(),
    '15:20:00',
    12.00
),
(
    1,
    1,
    '3D',
    '02',
    CURDATE(),
    '14:10:00',
    15.00
);

SELECT *
FROM funciones
WHERE cine_id = 1
  AND pelicula_id = 1;


SELECT
    id,
    nombre,
    ciudad
FROM cines
ORDER BY id;

SELECT
    id,
    codigo,
    titulo,
    estado
FROM peliculas
ORDER BY id;

-- ACTUALIZAR PELICULAS-

-- ============================================
-- ID 1 - EL AFINADOR
-- Conservamos codigo = chavin
-- ============================================

UPDATE peliculas
SET
    codigo = 'chavin',
    titulo = 'EL AFINADOR',
    director = 'DANIEL ROHER.',
    duracion_min = 107,
    clasificacion = 'MAYORES DE 14',
    genero = 'ANIMADO',
    estreno = '2026-06-25',
    reparto = 'LEO WOODALL, DUSTIN HOFFMAN, ALISEN RICHMOND-PECK.',
    estado = 'EN_CARTELERA'
WHERE id = 1;


-- ============================================
-- ID 2 - SUPER GIRL
-- Conservamos codigo = hurry
-- ============================================

UPDATE peliculas
SET
    codigo = 'hurry',
    titulo = 'SUPER GIRL',
    director = 'CRAIG GILLESPIE.',
    duracion_min = 108,
    clasificacion = 'TODO ESPECTADOR',
    genero = 'AVENTURA',
    estreno = '2026-06-24',
    reparto = 'MILLY ALCOCK, DAVID CORENSWET, EVE RIDLEY.',
    estado = 'EN_CARTELERA'
WHERE id = 2;


-- ============================================
-- ID 3 - TOY STORY
-- Conservamos codigo = zootopia2
-- ============================================

UPDATE peliculas
SET
    codigo = 'zootopia2',
    titulo = 'TOY STORY',
    director = 'MCKENNA HARRIS, ANDREW STANTON.',
    duracion_min = 102,
    clasificacion = 'TODO ESPECTADOR',
    genero = 'ANIMACION',
    estreno = '2026-06-17',
    reparto = 'TOM HANKS, KEANU REEVES, JOAN CUSACK.',
    estado = 'EN_CARTELERA'
WHERE id = 3;


-- ============================================
-- ID 4 - EL DIA DE LA REVELACION
-- Conservamos codigo = nada3
-- ============================================

UPDATE peliculas
SET
    codigo = 'nada3',
    titulo = 'EL DIA DE LA REVELACION',
    director = 'STEVEN SPIELBERG',
    duracion_min = 145,
    clasificacion = 'MAYORES DE 14',
    genero = 'ACCION',
    estreno = '2026-06-10',
    reparto = 'EMILY BLUNT, JOSH O''CONNOR, COLIN FIRTH.',
    estado = 'EN_CARTELERA'
WHERE id = 4;

select * from peliculas;

INSERT INTO funciones (
    cine_id,
    pelicula_id,
    tipo_cine,
    sala,
    fecha,
    hora,
    precio
)
SELECT
    c.id,
    p.id,
    '2D',
    '01',
    '2026-08-01',
    '15:20:00',
    12.00
FROM cines c
CROSS JOIN peliculas p
WHERE NOT EXISTS (
    SELECT 1
    FROM funciones f
    WHERE f.cine_id = c.id
      AND f.pelicula_id = p.id
      AND f.tipo_cine = '2D'
);

INSERT INTO funciones (
    cine_id,
    pelicula_id,
    tipo_cine,
    sala,
    fecha,
    hora,
    precio
)
SELECT
    c.id,
    p.id,
    '3D',
    '02',
    '2026-08-01',
    '14:10:00',
    15.00
FROM cines c
CROSS JOIN peliculas p
WHERE NOT EXISTS (
    SELECT 1
    FROM funciones f
    WHERE f.cine_id = c.id
      AND f.pelicula_id = p.id
      AND f.tipo_cine = '3D'
);

SELECT COUNT(*) AS total_funciones
FROM funciones;

SELECT 
    id,
    cine_id,
    pelicula_id,
    tipo_cine,
    sala,
    fecha,
    hora,
    precio
FROM funciones
WHERE cine_id = 1
  AND pelicula_id = 1;

show tables;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(9) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('USUARIO', 'ADMIN') NOT NULL DEFAULT 'USUARIO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from usuarios;


