# Manual operativo del modulo Biblioteca

## Resumen del sistema
El modulo Biblioteca se organiza por menus laterales y agrupa las funciones en:
- Operacion: catalogo, prestamos, reservas, usuarios, reportes.
- Catalogacion: categorias, editoriales, autores, tipos de material, ejemplares, tesis y control MARC/autoridades.
- Circulacion: politicas de prestamo, multas.
- Seriales, Adquisiciones, Administracion, Integraciones y OPAC como modulos especializados.

## Entidades principales y dependencias
- Tipo material: clasifica el soporte del libro (base para politicas y catalogo).
- Categoria: clasifica el libro.
- Editorial: editorial del libro.
- Autor: persona o entidad autora del libro.
- Libro (Catalogo): referencia a tipo material y opcionalmente categoria, editorial y autores.
- Ejemplar: copia fisica/digital de un libro; es lo que se presta.
- Usuario de biblioteca: alumno/docente/administrativo/externo que recibe prestamos.
- Politica de prestamo: reglas por tipo de usuario y tipo material (dias, renovaciones, multa).
- Prestamo: vincula ejemplar + usuario + fecha de vencimiento.

Dependencia clave para prestar:
Tipo material -> (opcional: Politica) -> Libro -> Ejemplar -> Prestamo
Usuario de biblioteca ----------------------------^ (Prestamo)

## Ruta de alta (de cero a registrar un prestamo)
1) Catalogacion > Tipos material
   - Crear al menos un tipo de material (ej: Libro, Tesis, Revista).

2) Catalogacion > Categorias
   - Crear las categorias principales (ej: Ingenieria, Literatura).

3) Catalogacion > Editoriales
   - Crear editoriales necesarias.

4) Catalogacion > Autores
   - Registrar autores base.

5) Operacion > Catalogo
   - Crear el libro con al menos: Titulo y Tipo material.
   - Opcional: Categoria, Editorial, Autores, ISBN, idioma, anio, etc.

6) Catalogacion > Ejemplares
   - Crear al menos un ejemplar del libro.
   - Campos clave: Libro, Codigo barra (opcional), Ubicacion, Tipo soporte, Estado = disponible.

7) Operacion > Usuarios biblioteca
   - Registrar el alumno (o usuario) que recibira el prestamo.
   - Campos clave: Nombre, Tipo usuario, Codigo universitario (si aplica).

8) Circulacion > Politicas de prestamo (recomendado)
   - Definir reglas por Tipo usuario y Tipo material.
   - Campos clave: Dias prestamo, Max renovaciones, Max prestamos, Multa diaria.

9) Operacion > Prestamos
   - Click en Nuevo prestamo.
   - Seleccionar Ejemplar y Usuario.
   - Definir Fecha de vencimiento y Registrar.
   - El ejemplar pasa a estado prestado y el prestamo queda activo.

## Opcionales despues del prestamo
- Operacion > Reservas: si no hay ejemplares disponibles.
- Circulacion > Multas: gestionar cargos por atraso.
- Reportes: revisar prestamos activos y vencidos.

## Checklist rapido antes de prestar
- Existe libro en Catalogo.
- Existe al menos un ejemplar en estado disponible.
- Existe usuario de biblioteca.
- Politica de prestamo definida (si aplica en tu operacion).
