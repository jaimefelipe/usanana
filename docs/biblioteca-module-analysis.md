# Análisis del módulo de Gestión de Biblioteca

## Objetivo y alcance
<<<<<<< ours
- Incorporar una sección completa de "Biblioteca" al workspace Angular existente (Angular 17), siguiendo el patrón modular de los proyectos actuales y reutilizando la infraestructura de enrutamiento y layout del `CoreModule`.
- Exponer funcionalidades de catálogo, circulación y administración para operar préstamos físicos/digitales y mantener trazabilidad histórica.

## Integración esperada en el workspace
- **Entrada en AppModule**: importar el módulo de biblioteca de forma análoga a `SecurityModule` y `ContactoModule`, exponiendo sus rutas por lazy-loading (`biblioteca/**`).
- **Reutilización de layout**: usar el contenedor de páginas y el `<app-menu>` compartido para una navegación consistente.
=======
- Incorporar una aplicación completa de "Biblioteca" al workspace Angular existente (Angular 17) como proyecto independiente (`projects/biblioteca`), que pueda compilarse y publicarse sin depender de `main`.
- Exponer funcionalidades de catálogo, circulación y administración para operar préstamos físicos/digitales y mantener trazabilidad histórica.

## Integración esperada en el workspace
- **Aplicación dedicada**: proyecto `biblioteca` con baseHref `/biblioteca/`, accesible directamente y enlazable desde otros módulos mediante un link externo.
- **Reutilización de estilos**: se heredan estilos globales compartidos (`projects/main/src/styles.css`) para mantener la apariencia consistente.
>>>>>>> theirs
- **Compartidos y UI**: aprovechar módulos de utilidades compartidas (formularios, pipes, componentes de tabla) ya presentes en otros feature modules.

## Dominios y entidades clave
- **Libros**: títulos, ISBN, ejemplares, estado (disponible, prestado, reservado, perdido), ubicación.
- **Autores y editoriales**: normalización de datos de catálogo y vínculos con libros.
- **Usuarios de biblioteca**: alumnos/empleados vinculados a identidades existentes del sistema (referencia cruzada con el módulo de seguridad/contacto si aplica).
- **Préstamos y devoluciones**: registro de movimientos, fechas de vencimiento, renovaciones y estado de ejemplares.
- **Reservas**: gestión de lista de espera y asignación automática al quedar disponible un ejemplar.
- **Multas y bloqueos**: cálculo de mora, aplicación de sanciones y lifting cuando se regulariza la cuenta.
- **Reportes**: indicadores de circulación, morosidad y rotación de catálogo.

## Estructura propuesta del módulo
<<<<<<< ours
- **Routing propio (`BibliotecaRoutingModule`)** con rutas hijas bajo `biblioteca/`:
  - `biblioteca` (dashboard/resumen)
  - `biblioteca/catalogo` (listado de libros, filtros avanzados)
  - `biblioteca/catalogo/:id` (detalle y ejemplares)
  - `biblioteca/prestamos` (gestión y creación)
  - `biblioteca/reservas` (colas de espera)
  - `biblioteca/usuarios` (estado de cuenta, préstamos activos, multas)
  - `biblioteca/reportes` (gráficos/tablas)
=======
- **Routing propio (`BibliotecaRoutingModule`)** con rutas hijas ancladas en la raíz de la aplicación de biblioteca (resueltas en `/biblioteca/**` gracias al `baseHref`):
  - `/` (dashboard/resumen)
  - `/catalogo` (listado de libros, filtros avanzados)
  - `/catalogo/:id` (detalle y ejemplares)
  - `/prestamos` (gestión y creación)
  - `/reservas` (colas de espera)
  - `/usuarios` (estado de cuenta, préstamos activos, multas)
  - `/reportes` (gráficos/tablas)
>>>>>>> theirs
- **Lazy loading recomendado** para no aumentar el bundle inicial.

## Componentes y páginas sugeridas
- **DashboardBibliotecaComponent**: KPIs rápidos (ejemplares, préstamos activos, vencidos hoy, reservas).
- **CatalogoLibrosComponent**: búsqueda por título/ISBN/autor, filtros (estado, categoría), paginación, acciones rápidas.
- **LibroDetalleComponent**: ficha bibliográfica, ejemplares disponibles, historial reciente, botones de reservar/prestar.
- **PrestamosComponent**: listado de préstamos, alta/renovación/devolución; validaciones de disponibilidad y bloqueos.
- **ReservasComponent**: gestión de colas, priorización y notificación cuando un ejemplar vuelve a estar disponible.
- **UsuariosBibliotecaComponent**: estado de cuenta por usuario (préstamos, reservas, multas), bloqueo/desbloqueo.
- **ReportesBibliotecaComponent**: tablas/gráficos (rotación de libros, mora, reservas), exportación.
- **Componentes compartidos**: selectores de libros/usuarios, tarjeta de ejemplar, timeline de movimientos.

## Servicios y modelos
- **Servicios de datos** (REST/GraphQL según backend disponible):
  - `CatalogoService`: CRUD de libros, autores, ejemplares y adjuntos.
  - `CirculacionService`: préstamos, devoluciones, renovaciones y reservas.
  - `UsuariosBibliotecaService`: estado de cuenta, bloqueos, multas, notificaciones.
  - `ReportesBibliotecaService`: consultas agregadas (circulación, mora, top préstamos).
- **Modelos/Interfaces**: `Libro`, `Ejemplar`, `Autor`, `Editorial`, `Prestamo`, `Reserva`, `Multa`, `UsuarioBiblioteca`.
- **Validaciones**: reglas de negocio para límites de préstamos por rol, tiempos de préstamo, penalizaciones y conflictos de reservas.

## Experiencia de usuario
- **UX consistente**: headers/breadcrumbs alineados con módulos existentes; uso de modales o side-panels para operaciones rápidas.
- **Estados vacíos y ayudas**: mensajes claros, tooltips de reglas de préstamo, resaltado de vencidos.
- **Accesibilidad**: navegación por teclado y etiquetas ARIA en tablas y formularios.

## Extensibilidad y deuda técnica prevista
- Preparar hooks para integración futura con inventario físico (códigos de barras/RFID) y con autenticación central.
- Considerar internacionalización de textos y soporte de temas (si el resto del workspace lo adopta).
- Definir contrato mínimo de backends (endpoints esperados) para evitar acoplamiento fuerte y permitir mocks en desarrollo/test.

