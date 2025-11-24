BEGIN;

-- ---
-- Tabla de Usuarios
-- ---
CREATE TABLE IF NOT EXISTS public."Usuario"
(
    id_usuario serial NOT NULL,
    nombre_usuario text NOT NULL,
    correo text NOT NULL,
    "contraseña" text NOT NULL,
    tipo_usuario text NOT NULL,
    fecha_registro date NOT NULL,
    PRIMARY KEY (id_usuario),
    telefono text,
    foto_perfil text
);

COMMENT ON COLUMN public."Usuario".tipo_usuario
    IS 'comprador, vendedor o admin';

-- ---
-- Tabla de Franquicias (Ej: Pokemon, Magic)
-- ---
CREATE TABLE IF NOT EXISTS public."Franquicia"
(
    id_franquicia serial NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    imagen text,
    PRIMARY KEY (id_franquicia)
);

COMMENT ON COLUMN public."Franquicia".imagen
    IS 'URL o dirección de la imagen';

-- ---
-- Tabla de Cartas (Plantillas de cartas)
-- ---
CREATE TABLE IF NOT EXISTS public."Carta"
(
    id_carta serial NOT NULL,
    nombre text NOT NULL,
    rareza text NOT NULL,
    tipo text NOT NULL,
    id_franquicia integer NOT NULL,
    imagen_carta text NOT NULL,
    PRIMARY KEY (id_carta),
    
    -- FK a Franquicia
    FOREIGN KEY (id_franquicia)
        REFERENCES public."Franquicia" (id_franquicia)
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- ---
-- Tabla de Publicaciones (Listings de Vendedores)
-- ---
CREATE TABLE IF NOT EXISTS public."Publicacion"
(
    id_publicacion serial NOT NULL,
    id_usuario integer NOT NULL, -- El vendedor
    id_carta integer NOT NULL, -- La carta que se vende
    precio numeric(10, 2) NOT NULL,
    cantidad integer NOT NULL,
    estado text NOT NULL,
    fecha_publicacion date NOT NULL,
    PRIMARY KEY (id_publicacion),
    
    -- FK al Vendedor (Usuario)
    FOREIGN KEY (id_usuario)
        REFERENCES public."Usuario" (id_usuario)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    
    -- FK a la Carta
    FOREIGN KEY (id_carta)
        REFERENCES public."Carta" (id_carta)
        ON UPDATE NO ACTION ON DELETE NO ACTION
    
    -- Se eliminó: UNIQUE (id_carta) para permitir que varios usuarios vendan la misma carta.
);

COMMENT ON COLUMN public."Publicacion".estado
    IS 'disponible, vendido, agotado, pausado';

-- ---
-- Tabla de Transacciones (Ventas completadas)
-- ---
CREATE TABLE IF NOT EXISTS public."Transaccion"
(
    id_transaccion serial NOT NULL,
    id_publicacion integer NOT NULL,
    id_comprador integer NOT NULL,
    cantidad integer NOT NULL,
    total numeric(10, 2) NOT NULL,
    fecha_transaccion timestamp with time zone NOT NULL,
    metodo_de_pago text NOT NULL,
    PRIMARY KEY (id_transaccion),
    
    -- FK a la Publicación que se compró
    FOREIGN KEY (id_publicacion)
        REFERENCES public."Publicacion" (id_publicacion)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    
    -- FK al Comprador (Usuario)
    FOREIGN KEY (id_comprador)
        REFERENCES public."Usuario" (id_usuario)
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- ---
-- Tabla de Envíos
-- ---
CREATE TABLE IF NOT EXISTS public."Envio"
(
    id_envio serial NOT NULL,
    id_transaccion integer NOT NULL,
    direccion_envio text NOT NULL,
    estado_envio text NOT NULL,
    fecha_envio date NOT NULL,
    fecha_entrega_estimada date NOT NULL,
    fecha_entrega_real date, -- Puede ser NULO si aún no se entrega
    PRIMARY KEY (id_envio),
    
    -- FK a la Transacción
    FOREIGN KEY (id_transaccion)
        REFERENCES public."Transaccion" (id_transaccion)
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

COMMENT ON COLUMN public."Envio".estado_envio
    IS 'pendiente, en envio, entregado';

-- ---
-- Tabla de Valoraciones (Reviews)
-- ---
CREATE TABLE IF NOT EXISTS public."Valoracion"
(
    id_valoracion serial NOT NULL,
    id_vendedor integer NOT NULL, -- Usuario valorado
    id_comprador integer NOT NULL, -- Usuario que valora
    id_transaccion integer NOT NULL,
    puntuacion integer NOT NULL,
    comentario text NOT NULL,
    fecha_valoracion date NOT NULL,
    PRIMARY KEY (id_valoracion),
    
    -- Una transacción solo puede tener una valoración
    UNIQUE (id_transaccion),
    
    -- Se eliminaron: UNIQUE (id_vendedor) y UNIQUE (id_comprador)
    
    -- FK al Vendedor (Usuario)
    FOREIGN KEY (id_vendedor)
        REFERENCES public."Usuario" (id_usuario)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    
    -- FK al Comprador (Usuario)
    FOREIGN KEY (id_comprador)
        REFERENCES public."Usuario" (id_usuario)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    
    -- FK a la Transacción
    FOREIGN KEY (id_transaccion)
        REFERENCES public."Transaccion" (id_transaccion)
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

COMMENT ON COLUMN public."Valoracion".id_vendedor
    IS 'usuario valorado';

COMMENT ON COLUMN public."Valoracion".id_comprador
    IS 'usaurio que valora';

COMMENT ON COLUMN public."Valoracion".id_transaccion
    IS 'permite valorar bajo una compra real';

-- ---
-- Tabla de Carrito de Compras
-- ---
CREATE TABLE IF NOT EXISTS public."Carrito"
(
    id_carrito serial NOT NULL,
    id_usuario integer NOT NULL, -- Dueño del carrito
    id_publicacion integer NOT NULL, -- Item en el carrito
    cantidad integer NOT NULL,
    PRIMARY KEY (id_carrito),
    
    -- FK al Usuario
    FOREIGN KEY (id_usuario)
        REFERENCES public."Usuario" (id_usuario)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    
    -- FK a la Publicación
    FOREIGN KEY (id_publicacion)
        REFERENCES public."Publicacion" (id_publicacion)
        ON UPDATE NO ACTION ON DELETE NO ACTION
);


END;


-- Nueva actualización para importar base de datos de Pokemon TCG

-- 1. Agregamos columnas nuevas
ALTER TABLE public."Carta"
ADD COLUMN id_api_externa text UNIQUE, -- El ID único de la API (ej: 'xy1-1')
ADD COLUMN nombre_set text,            -- El nombre del set (ej: 'Base')
ADD COLUMN numero_carta text;          -- El número dentro del set (ej: '1/102')

-- 2. (Opcional pero recomendado) Agregar índice para búsquedas más rápidas
CREATE INDEX idx_carta_api_id ON public."Carta"(id_api_externa);

-- 3. Asegúrate de tener la franquicia 'Pokémon' creada
-- Si aún no la tienes, ejecútalo y ANOTA el id_franquicia que te genere
INSERT INTO public."Franquicia" (nombre, descripcion, imagen)
VALUES ('Pokémon', 'TCG', 'logo.png')
ON CONFLICT DO NOTHING;