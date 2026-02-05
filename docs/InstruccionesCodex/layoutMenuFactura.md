# Cómo replicar el layout y menú de factura2 en nuevas apps

## 1. Contenedor raíz (`app.component`)
- El componente principal monta primero el topbar (`<app-app-menu-superior>`) y luego el `wrapper` con el menú lateral (`<app-app-menu>`) y el `<main class="main-content">` que expone el `<router-outlet>`.
- Mantén los estados `isMobileView` y `menuColapsado` en `app.component.ts`, pásalos a los hijos mediante inputs (`[collapsed]`, `[mobile]`) y responde a `(toggleSidebar)` para sincronizar la UI. Evita lógica adicional: el shell sólo reacciona a eventos y deja que las rutas rendericen el contenido dentro del `router-outlet`.
- Añade la overlay móvil (`<div class="sidebar-overlay">`) con su clase `is-visible` ligada a `isMobileView && !menuColapsado` y con `click` que cierra el menú, tal como en factura2.

## 2. Topbar fijo (`app-menu-superior.component`)
- La barra superior es `<nav class="app-topbar fixed-top">` con dos secciones: `topbar-left` (botón hamburger, logo, nombre) y `topbar-right` (botones de notificaciones y avatar).
- Usa `btn btn-icon` y `btn btn-ghost` para los iconos, con `fa` de FontAwesome y `badge-dot` donde se necesiten indicadores. El logo es `/assets/logo.svg` y el nombre se inyecta con `{{ titulo }}`.
- El botón de hamburguesa emite `toggleSidebar.emit()` y lleva `aria-label`; el componente no decide nada más. Reutiliza `btn-avatar` para mostrar las iniciales del usuario y deja espacio para futuros drop-downs.

## 3. Menú lateral (`app-menu.component`)
- El menú principal vive dentro de `<nav class="sidebar p-2">` con `role="navigation"` y clases condicionales: `[class.collapsed]="collapsed"`, `[class.is-open]="mobile && !collapsed"`, `[class.is-mobile]="mobile"`.
- Las listas usan `<ul class="nav flex-column">` y `li.nav-item`. Cada sección (Configuración, Inventario, Ventas, Compras, Cuentas por Cobrar, utilidades, acciones del usuario) se representa con un enlace que llama a `toggle($event, 'clave')` para abrir/cerrar la subsección. El texto visible se oculta si el menú está colapsado.
- Usa directivas como `*ngIf="AppInventario"` para ocultar secciones según los permisos/flags configurados; todas esas propiedades deben residir en el TS o en servicios centrales. Los enlaces internos usan `[routerLink]`, `routerLinkActive="active"` y `routerLinkActiveOptions` para resaltar la ruta activa sin depender de links absolutos.
- Incluye un pie de menú (`{{ Company }} | {{ User }}`) que se muestra sólo cuando el menú no está colapsado y el usuario está logeado. Añade botones de `Soporte`, `Menú Principal` y `Salir/Entrar` con íconos y `title` adaptativos según el estado `collapsed`.

## 4. Pantalla de bienvenida (`full.component`)
- La página inicial combina tarjetas hero, accesos directos, KPIs y gráficos. Usa contenedores `.page-toolbar`, `.hero-card`, `.home-section`, `.page-grid` y clases `.section-title`, `.section-subtitle` para la tipografía.
- Los accesos directos (`accesosDirectos`) se listan con tarjetas `.shortcut-card`, cada una con icono, título y descripción, y `routerLink` hacia la zona correspondiente. Mantén el patrón `tone-<color>` para la paleta del icono.
- Los indicadores (`kpis`) usan tarjetas con `.kpi-card`, `.kpi-stack`, `.kpi-value`, `.kpi-label` y `.kpi-meta`. Apóyate en `kpi.format` para aplicar pipes (`currency`, `number`).
- Los gráficos usan Syncfusion (`<ejs-chart>`) con `chartXAxis`, `chartYAxis`, `chartTooltipCurrency`, `chartTooltipCount`, y las colecciones `ventasSemana`, `comprasSemana`, `inventarioSemana`. Documenta qué datos deben llegar desde el service para mantener la coherencia visual.

## 5. Estética y consistencia
- Conserva los estilos específicos (`full.component.css`, `app-menu-superior.component.css`, `app-menu.component.css`) con variables CSS compartidas (`--sidebar-width`, `--topbar-height`, etc.) para que todo el layout sea responsive sin duplicar reglas.
- Los nombres de clases siguen el formato `<dominio>-<elemento>` (`app-topbar`, `sidebar`, `hero-card`, `page-card-link`); respétalo en la nueva app para permitir overrides simples desde `styles.scss`.
- Cada nuevo módulo que integres debe exponer un `routerLink` que se pueda activar desde el menú; la lógica de permisos/flags se centraliza en el menú y no en cada tarjeta.
- Mantén la misma estrategia de comunicación entre componentes (inputs/outputs) y evita atajos con estados globales: el menú lateral sólo se colapsa/expande mediante eventos emitidos desde el topbar o la overlay.
