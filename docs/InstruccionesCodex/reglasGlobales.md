# Cómo usar estos documentos
- Antes de tocar un componente lee `reglasGlobales.md`, `generalidadesComponentes.md` en ese orden.

# Reglas generales reutilizables

## 0. Base: invoice.component como plantilla
- El listado visible por defecto corresponde a `Invoices` y se controla con un booleano `edit` (falso = lista, verdadero = formulario). El mismo booleano se usa para esconder el listado y mostrar el form en el HTML (`[hidden]="edit"` / `[hidden]="!edit"`).
- Cuando se abre un registro o se crea uno nuevo, se clona el objeto `Invoice` y sus arrays anexos (`Details`, `Detalle`, `persona`, `Exoneracion`) antes de exponerlo al template; esto evita efectos colaterales entre el listado y el formulario activo.
- Para búsquedas y paginaciones reutiliza las propiedades `searchField`, `paginacion`, `ChangePage()` y `loadInvoices()` tal como se hace en `invoice.component`, lo que garantiza coherencia en los filtros y en la interacción con el backend.
- Las funciones de soporte encargadas de totales y estados (`calcularTotales`, `procesaAdicionales`, `recalcularTotalesFactura`, `getDocumentoNumero`, `getNombreCliente`) deben estar disponibles en nuevos componentes que presenten listas de tarjetas con estados o líneas.

## 1. Convenciones de datos
- `Id_Empresa` siempre se obtiene desde core (normalmente `localStorage`). Ningún SQL ni formulario debe exponerlo: se filtra automáticamente dentro del service.
- Todas las tablas tienen PKs `Id_<Tabla>` y los FKs se denominan `Id_<EntidadPadre>`.
- Auditoría: `Creado_El`, `Creado_Por`, `Modificado_El`, `Modificado_Por` deben actualizarse en los services (UI solo los muestra si el mantenimiento lo requiere).

## 2. Acceso a datos y contratos
- Prohibido usar `SELECT *` en consultas; los services siempre definen `fields` explícitos.
- Toda lógica SQL vive en el service; los componentes consumen métodos `loadX`, `getX`, `updateX`.
- Las respuestas API usan el contrato `{ ok, data, error }`.
- El servicio core expone `executeSqlSyn(sqlConfig)` con campos `{ table, fields, where, searchField, paginacion, orderField, orderDirection }`.

## 3. Estados de UI estándar
- `edit` es la bandera principal que controla si se ve la lista (`[hidden]="edit"`) o el formulario completo (`[hidden]="!edit"`). Al abrir `editRecord()` se resetea el DTO y los detalles antes de activar la vista de edición.
- Los modales derivados (productos, exoneración, nuevos contactos, cobros y loading) usan booleans explícitos: `PantallaProductos`, `PantallaExoneracion`, `PantallaClienteNuevo`, `PantallaCobro`, `PantallaLoading`. Cada booleano corresponde a un sólo overlay y se cierra con un handler único (`closeModal`, `closeExoneracion`, etc.).
- Cuando una acción produce vistas encadenadas (por ejemplo `convertirOCaFactura`, `imprimirFactura`, `enviarDocumentoCorreo`), documenta qué booleanos cambian y qué estado final se espera del DTO para evitar confusiones al volver al listado.

## 4. Reglas para modales
- Todo modal transaccional trabaja sobre una copia del DTO y confirma los cambios al cerrar.  
- Los modales de edición directa pueden trabajar por referencia cuando el contexto exige edición en sitio, pero deben documentar el alcance de los efectos colaterales.
- La estructura HTML debe respetar `modal-main` → `modal-content card` → `card-header/body/footer`. El footer incluye botones de `Cancelar` y la acción principal, que invoca el método `applyX` (por ejemplo `crearCliente`, `exonerar`, `aplicarCobro`).
- Usa títulos (`<h2>`) y campos agrupados con `row g-3` para mantener la misma densidad visual del modal principal.

## 5. Estándares CSS reutilizables
- Usa tokens CSS (`--ui-border`, `--ui-radius-lg`, `--ui-shadow-sm`, `--ui-muted`, `--ui-surface`) sin inventar nuevos colores por pantalla.
- Huye del uso genérico de `.list-*` si el componente ya usa convenciones más específicas. En el caso de `invoice.component` se emplean clases como `invoice-card`, `invoice-card-link`, `invoice-line`, `invoice-form`, `invoice-search`, `invoice-grid`, `invoice-detail-table`, `invoice-product-bar`, `invoice-totals`, `invoice-actions`, `invoice-error`. Nuevos componentes basados en este patrón deben mantener el prefijo `invoice-` o el suyo propio cuando se busca modularidad, pero siempre con la misma intención semántica: tarjetas, líneas, totales y acciones claras.
- Todos los listados comparten `row g-4` y columnas `col-12 col-md-6 col-xl-4` para tarjetas; los detalles usan `row g-3` para campos y `input-group` para controles compuestos.
- Los botones principales tienen altura 44 px y se agrupan en `.invoice-actions .form-group` con `gap` uniforme; si hay muchos botones, la fila tiene `flex-wrap: wrap` y `button` con `white-space: nowrap`.

## 6. Navegación derivada
- El flujo principal del invoice.component se dirige con eventos `(click)="editRecord(...)"`, `(click)="ChangePage(...)"` y `(click)="cancel()"`. Copia ese estilo de eventos declarativos generando un método por cada transición.
- Cuando una acción abre otro registro (`convertirDocumentoAOC`, `editRecord` con query params) asegúrate de documentar el estado final esperado (p. ej. `"edit = true, Invoice.Tipo_Documento = '01'"`) y de resete a `edit` cuando corresponda.
- Antes de introducir cambios sobre un componente existente crea un backup del archivo (por ejemplo copia `invoice.component.*` a una carpeta `backups/` con timestamp) para preservar la versión funcional previa; documenta la ubicación del backup junto a los nuevos commits o notas de cambio.
