# Plan de trabajo — Biblioteca + Campus (feedback del cliente)

> **Nota de reconciliación (2026-08-29):** la documentación de trabajo real de
> este módulo vive en
> `C:\Users\Usuario\Desktop\jbrenes\Toxo\codex\_codex-work\docs\referencia\usantana\biblioteca\`
> (`PLAN_RELEASES.md`, `CHANGELOG.md`, `releases/`). Este archivo se escribió
> sin haber leído esa documentación primero — el fix de Etapa 0 quedó
> registrado ahí como release **v2.0.2** (no v2.1, que ya estaba reservado
> para "Licencia visible vía etiqueta MARC 533"). La Etapa 1 de este archivo
> ya está cubierta con más detalle por los releases v2.2–v3.0 de
> `PLAN_RELEASES.md`. Usar ese plan maestro como fuente de verdad; este
> archivo queda solo como bitácora de la sesión y el mapeo a los documentos
> originales del cliente.

**Fecha:** 2026-08-29
**Fuente:** `_codex-work/docs/Clientes/usantana/` (Modulos completos.pdf, Observaciones Campus lado estudiante.docx,
observaciones.jpeg, error1-8.jpeg) — reporte del Departamento de Biblioteca sobre el release actual.

Este plan reemplaza el orden de trabajo previo para estos dos módulos. Regla general: primero lo que
**ya debía funcionar y está roto** (Etapa 0), después lo que falta para que cada pantalla quede
**completa** en vez de a medias (Etapa 1), y al final las funcionalidades nuevas más grandes que el
cliente pidió (Etapa 2+). No se pasa a la siguiente etapa hasta cerrar la anterior completa.

---

## Etapa 0 — Regresiones críticas (bloquean uso normal) — HECHO EN ESTA SESIÓN

### 0.1 — Toda reserva fallaba en producción (Biblioteca Y Campus)
- **Causa raíz confirmada:** `Bib_Reserva` tiene `CONSTRAINT ck_reserva_estado CHECK (Estado IN
  ('activa','atendida','cancelada','liberada'))`, pero **todo** el código (biblioteca-data.service.ts,
  campus libro-detalle.service.ts, campus mi-biblioteca.service.ts) inserta/lee Estado en
  `'En espera'` / `'Disponible'`, valores que el CHECK nunca permitió. Cada intento de reserva
  tronaba con el error visible en error2–5.jpeg (`ck_reserva_estado failed`).
- **Fix:** `docs/sql/biblioteca-v2-0-2-fix-reserva-estado.sql` (idempotente) — amplía el CHECK a
  `LOWER(Estado) IN ('activa','en espera','disponible','atendida','cancelada','liberada')`.
  También actualizado `docs/sql/biblioteca-schema.sql` para que el doc de referencia quede igual a
  producción.
- **Pendiente:** ejecutar el script contra la BD de producción (`usanwoig_santana`).

### 0.2 — Catalogar un libro sin ISBN fallaba a partir del segundo registro
- **Causa raíz confirmada:** `Bib_Libro` tiene `UNIQUE KEY uq_libro_empresa_isbn (Id_Empresa, ISBN)`.
  El código guardaba ISBN vacío como cadena `''` en vez de `NULL`. MySQL/MariaDB sí permite varios
  `NULL` en una unique key, pero **no** permite dos `''` repetidos → el segundo artículo/tesis/registro
  sin ISBN de esa empresa disparaba `Duplicate entry` en el INSERT. Esto coincide con error6–8.jpeg
  (alerta "undefined" seguida de "No se pudo obtener el identificador del libro") y con que la mayoría
  de los registros del catálogo del cliente no tienen ISBN.
- **Fix:** `biblioteca-data.service.ts` — nuevo helper `sqlIsbn()` que manda `NULL` cuando el ISBN
  viene vacío, usado en `createLibro()` y `updateLibro()`.

### 0.3 — El backend nunca exponía el ID recién insertado con el nombre que el código esperaba
- **Causa raíz confirmada:** `epsMySqlDataBase_v2.php` devuelve el id nuevo como `"Identity"` (así lo
  usan factura, matrícula, security-user, etc. en todo el sistema). `biblioteca-data.service.ts`
  (createLibro, MARC campo/subcampo) buscaba `data['insertId']`, que no existe — por diseño caía
  siempre al fallback `resolveLibroId()` (una búsqueda por ISBN/Título), que es frágil y podía fallar
  incluso cuando el INSERT sí funcionó.
- **Fix:** `extractInsertId()` y `createLibro()` ahora leen `Identity` primero (con `insertId` como
  compatibilidad).

### 0.4 — Campus solo ofrecía "Solicitar reserva", nunca "Solicitar préstamo"
- **Reportado por el cliente (PDF punto 5/7 y docx punto 5):** cuando el documento está disponible debe
  aparecer "Solicitar préstamo"; "Solicitar reserva" es solo para cuando ya está prestado. El componente
  de Campus (`libro-detalle`) nunca tenía una ruta de préstamo directo — siempre llamaba a
  `crearReserva()`, sin importar la disponibilidad.
- **Fix:** `libro-detalle.service.ts` — nuevo `crearPrestamo()` (elige un ejemplar disponible, valida la
  política de circulación — 7 días / máx. 2 activos, igual que la app de Biblioteca — y actualiza el
  ejemplar a `prestado`). `libro-detalle.component.ts/html` — el botón ahora decide según
  `disponibles > 0`: "Solicitar préstamo" (crea el préstamo) o "Solicitar reserva" (como antes, a la
  lista de espera).

### Pendiente para cerrar la Etapa 0 (siguiente turno de esta sesión)
- Ejecutar `biblioteca-v2-0-2-fix-reserva-estado.sql` en producción (FTP + runner PHP, ver más abajo).
- Compilar y publicar `biblioteca` y `campus` por FTP con estos cambios.
- Probar en `usantana.com`: reservar un libro disponible → debe salir "Solicitar préstamo" y quedar en
  Mi Biblioteca; catalogar dos registros MARC seguidos sin ISBN → ambos deben guardar sin error.

---

## Etapa 1 — Completar pantallas ya existentes (Campus, impacto alto / riesgo bajo)

Todavía no implementado. Orden sugerido:

1. **Filtro de categorías no filtra nada** (PDF/docx punto 2): no es bug de código, es que los
   registros no tienen `Categoria_Id` asignado en catalogación. Acción real: disciplina de catalogación
   (opcional pero recomendada), no una tarea de desarrollo aislada.
2. **Portadas en catálogo/ficha de Campus** (punto 3): `campus/catalogo` y `campus/libro-detalle` no
   muestran la imagen que ya se sube en Ejemplares. Traer `Imagen_Portada`/URL desde `Bib_Ejemplar` en
   `catalogo.service.ts` y `libro-detalle.service.ts` y pintarla en las tarjetas y la ficha.
3. **Orden de los registros** (punto 4): `catalogo.service.ts` ordena `ORDER BY L.Titulo ASC`. Cambiar a
   más reciente primero (requiere columna de fecha de creación en `Bib_Libro`, o usar `Id_Libro DESC`
   como aproximación inmediata).
4. **Búsquedas ampliadas** (docx punto 1): agregar búsqueda por palabras clave (MARC 650/653/651) e
   ISSN (022 $a) en `catalogo.service.ts` — hoy solo busca en Título/Subtítulo/ISBN.
5. **Sección "Detalles" completa en la ficha** (punto 6): agregar autor(es), resumen, editorial, fecha
   de publicación, tipo de licencia, idioma, palabras clave y enlace en `libro-detalle` — varios de estos
   campos ya se traen (`obtenerLibro`), falta mostrarlos y agregar Palabras_Clave/licencia (533).

## Etapa 2 — Funcionalidad nueva declarada por el cliente (mayor esfuerzo)

- Autoridades con múltiples autores por registro (hoy 1 autoridad = 1 registro).
- Alertas de vencimiento próximo / renovación proactiva.
- Módulos nuevos del PDF: Publicaciones seriadas, Adquisiciones, Bases de datos/recursos electrónicos,
  Reportes y estadísticas ampliados (altmétricas, dashboards). Quedan fuera de alcance de "arreglar lo
  que ya debía funcionar"; se planifican como proyecto aparte una vez cerradas las etapas 0 y 1.

---

## Cómo se aplicó el fix de base de datos

Producción usa hosting compartido (`usantana.com` / `usanwoig_santana`), sin acceso SSH/MySQL directo
no interactivo confirmado desde esta máquina. Mecanismo usado: subir por FTP (`_codex-work/.secrets/ftp/usantana.xml`)
un script PHP de un solo uso que reutiliza `epsMySqlDataBase_v2.php` para ejecutar
`biblioteca-v2-0-2-fix-reserva-estado.sql`, dispararlo una vez por URL, confirmar el resultado y
eliminarlo del servidor.
