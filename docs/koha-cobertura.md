# Cobertura Koha vs Biblioteca

## Catalogacion
- Gestion bibliografica: `catalogo`, `libro-form`, `ejemplares`, `tipos-material`, `categorias`, `editoriales`, `autores`, `tesis`.
- MARC/UNIMARC: `marc-registros`, `marc-campos`, `marc-subcampos`.
- Autoridades: `autoridades`, `autoridad-campos`, `autoridad-subcampos`.
- Etiquetas/codigos de barras: `ejemplares` incluye `Codigo_Barra`.

## Circulacion
- Prestamos/devoluciones/renovaciones: `prestamos` + acciones de renovar/devolver.
- Reservas/lista de espera: `reservas` + acciones de atender/cancelar.
- Politicas de prestamo: `politicas-prestamo`.
- Multas: `multas`.

## OPAC
- Busqueda simple: `opac-home`.
- Reservas: `opac-detalle`.
- Renovaciones/reservas desde cuenta: `opac-cuenta`.
- Auto-registro: `opac-registro`.
- Funciones sociales: `opac-comentarios`, `opac-etiquetas`, `opac-listas`, `opac-lista-items`, `opac-historial`.

## Seriales
- Registro y control de seriales: `seriales`.
- Suscripciones y recepcion: `suscripciones`, `serial-numeros`, `serial-recepciones`.

## Adquisiciones
- Proveedores, cotizaciones y facturas: `proveedores`, `cotizaciones`, `facturas-compra`.
- Ordenes y detalle de compra: `ordenes-compra`, `ordenes-compra-detalle`.
- Presupuestos: `presupuestos`.

## Usuarios
- Mantenimiento de usuarios: `usuarios` (CRUD y bloqueo).
- Roles y permisos: `roles`, `permisos`, `roles-permisos`, `usuarios-roles`.

## Reportes
- Resumen operativo: `reportes` (libros, prestamos, reservas, multas, usuarios).

## Pendientes tecnicos
## Administracion e integraciones
- Sedes: `sedes`.
- Integraciones y protocolos: `integraciones` (Z39.50, SRU, OAI-PMH, SIP2/NCIP, discovery, RFID/API).

## Pendientes tecnicos
- Integraciones activas: falta implementar conectores reales (Z39.50, SRU, OAI-PMH, SIP2/NCIP, discovery).
