# Generalidades para construir componentes Angular basados en invoice.component

## 1. Vista de listado (modo `edit = false`)
- El contenedor base usa `<div [hidden]="edit" class="container-fluid pb-5">` para garantizar el mismo padding inferior del componente de facturas.
- El hero superior es un `div` con `d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3`. A la izquierda va el título (`<h2 class="mb-1">`) y el subtítulo (`<div class="text-muted small">`). A la derecha, el buscador reutiliza `input-group invoice-search` con icono (`fa-search`), `input.form-control` unido a `[(ngModel)]="searchField"` y eventos `(blur)="search()"`, `(keydown)="keytab1($event)"`, y, si aplica, el botón `+` que dispara `editRecord('')`.
- El grid de tarjetas se organiza con `<div class="row g-4 invoice-grid">` y columnas `<div class="col-12 col-md-6 col-xl-4">`. Cada tarjeta usa `card invoice-card h-100`, el enlace clicable `a.invoice-card-link`, y los bloques de contenido (`invoice-doc`, `invoice-name`, `invoice-line`, `invoice-id`). Mantén la lógica de etiquetas (`Tipo_Documento`, `Condicion_Venta`, `Metodo_Pago`, `Respuesta_MH`) en funciones reutilizables (`getDocumentoNumero`, `getNombreCliente`) para facilitar tests.
- Asegura que el listado incluya paginación simple (`ChangePage(0..2)`), y que el container de paginación esté separado con clases `container-fluid` y `<ul class="pagination">`.

## 2. Formulario principal (modo `edit = true`)
- La vista de edición se muestra dentro de `<div [hidden]="!edit" class="container-fluid pb-5">` y la forma entera se envuelve en `<form class="invoice-form">`.
- Usa un layout de cards/collapsibles: la barra superior (`invoice-form-header`) con tipos de documento, moneda, estado y botones de expansión `data-bs-toggle="collapse"`. Los selects importantes usan `[(ngModel)]` sobre el DTO principal (`Invoice.Tipo_Documento`, `Invoice.Moneda`, `Invoice.Metodo_Pago`, etc.) y se deshabilitan según `Invoice.Respuesta_MH`.
- Separa las secciones en `row g-3` y agrupa campos relacionados con `col-` para lograr columnas limpias. Cuando un control requiere un prefijo o botón (identificación, consecutivo, tipo docente), usa `input-group` con `input-group-prepend` y `input-group-append`.
- Define objetos auxiliares (`Detalle`, `Details`) para manejar la inclusión de productos y guarda un método `processProduct` que calcule los totales antes de agregar líneas.
- Usa `Factura.*` y `Detalle.*` con `[(ngModel)]` en los campos del template y activa validaciones `required`/`disabled` mediante `Invoice.Respuesta_MH`. Mantén funciones descriptivas (`IdValidation`, `enterValidation`, `obtenerProducto`, `calcularTotales`) para cada sección de formulario.

## 3. Barra de productos, tabla de detalles y totales
- La sección de productos usa `<div class="row g-3 invoice-product-bar">` con controles de SKU, descripción, cantidad y precio. Cada campo dispara `keytab` para cambiar el foco y `processProduct` en eventos `(blur)` cuando sea necesario.
- La tabla de detalles usa `invoice-detail-table` y un `*ngFor="let Detail of Details;let indice = index"` para renderizar cada línea (`SKU`, `Descripcion`, `Cantidad`, `Precio`, `Sub_Total`, `Total`). Las acciones de cada fila (editar/borrar) verifican `Detail.Adicional` y `Invoice.Respuesta_MH`.
- Para los totales, usa `invoice-totals` y `input-group invoice-total-field` para SubTotal, IVA y Total. Los valores son etiquetas con formato `number:'1.2-2'`.
- La barra de acciones (`invoice-actions`) agrupa botones en `form-group col-3 col-md-2`. Incluye botones condicionales según `Invoice.Tipo_Documento` y `Invoice.Respuesta_MH` como `imprimirFactura`, `imprimirTiquete`, `convertirDocumentoAOC`, `enviarDocumentoCorreo`, `AnularFactura`, `aplicarFactura`, `cancel`.

## 4. Modales reutilizables
- Repite la estructura `modal-main` → `modal-content card` → `card-header/body/footer` para cada overlay (productos, loading, exoneración, cliente nuevo, cobro). Cada modal se activa con un booleano (`PantallaProductos`, `PantallaLoading`, `PantallaExoneracion`, `PantallaClienteNuevo`, `PantallaCobro`).
- Los modales que muestran listas (`registros` en productos) usan grillas (`row g-3` con tarjetas), mientras que los formularios más cortos (cliente, exoneración, cobro) usan `row g-3` con campos en `col-md-*`.
- El footer siempre contiene botones de acción principales (`Seleccionar`, `Aplicar`, `Crear`, `Exonerar`) y `Cancelar` que invocan los correspondientes handlers (`closeModal`, `closeExoneracion`, `cerrarPantallaClienteNuevo`, `CerrarPantallaCobro`).

## 5. Espaciado, tipografía y estados
- Usa utilidades Bootstrap (`mb-3`, `gap-3`, `pt-3`, `px-3`) para separar secciones. Los títulos en las cards son `h2`, `h4` o `span.text-muted`, y los estados se acompañan de clases como `text-primary`, `text-success`, `text-warning`, `text-danger`.
- Los estados (`PantallaProductos`, `PantallaLoading`, `PantallaExoneracion`, `PantallaClienteNuevo`, `PantallaCobro`) se muestran/ocultan con `[hidden]`. Mantén un estado base `edit` y evita banderas duplicadas; los overlays secundarios también deben poder cerrarse con `ESC` o `Cancelar`.
- Cuando no hay datos, renderiza cards con mensajes `text-muted small` dentro del mismo grid (manteniendo `row g-4`), así el layout no se rompe.
