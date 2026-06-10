<?php
function adm_db_instance() {
    $candidates = [
        __DIR__ . '/core/db/epsMySqlDataBase_v2.php',
        __DIR__ . '/../backoffice/core/db/epsMySqlDataBase_v2.php'
    ];
    foreach ($candidates as $file) {
        if (file_exists($file)) {
            include_once($file);
            break;
        }
    }
    return class_exists('epsMySqlDatabase') ? epsMySqlDatabase::GetInstance() : null;
}

function adm_fetch_all($db, $sql) {
    if (!$db) {
        return [];
    }
    $db->Execute($sql);
    return $db->success === 'true' ? $db->getData() : [];
}

function adm_nivel_label($nivel) {
    $labels = [
        '1' => 'Cursos Libres',
        '2' => 'Tecnico',
        '3' => 'Diploma',
        '4' => 'Certificacion',
        '5' => 'Especializacion',
        '6' => 'Bachillerato',
        '7' => 'Licenciatura',
        '8' => 'Maestria',
        '9' => 'Doctorado'
    ];
    $key = trim((string)$nivel);
    return $labels[$key] ?? ($key !== '' ? $key : 'Sin nivel');
}

function adm_modalidad_label($modalidad) {
    $labels = [
        'P' => 'Presencial',
        '1' => 'Presencial',
        'V' => 'Virtual',
        '2' => 'Virtual',
        'T' => 'Tutoria',
        '3' => 'Tutoria',
        'S' => 'Suficiencia'
    ];
    $key = trim((string)$modalidad);
    return $labels[$key] ?? ($key !== '' ? $key : 'Sin modalidad');
}

require_once(__DIR__ . '/admisiones_pago_lib.php');

$db = adm_db_instance();
$carreras = adm_fetch_all($db, "SELECT Id_Carrera, Carrera, Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 AND Estado = 1 ORDER BY CAST(Nivel AS UNSIGNED), Carrera");
$niveles = adm_fetch_all($db, "SELECT DISTINCT Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 AND Estado = 1 AND Nivel IS NOT NULL AND TRIM(Nivel) <> '' ORDER BY CAST(Nivel AS UNSIGNED), Nivel");
$sedes = adm_fetch_all($db, "SELECT Id_Sucursal, Nombre FROM Gen_Sucursal WHERE Id_Empresa = 1 AND Estado = 1 ORDER BY Nombre");
$modalidades = adm_fetch_all($db, "SELECT DISTINCT Modalidad FROM Edu_Grupo WHERE Id_Empresa = 1 AND Estado = 1 AND Modalidad IS NOT NULL AND TRIM(Modalidad) <> '' ORDER BY Modalidad");
$planesPago = adm_pago_fetch_planes($db);
$configsPago = adm_pago_table_exists($db, 'Edu_Admision_Config_Financiera')
    ? adm_fetch_all($db, "SELECT * FROM Edu_Admision_Config_Financiera WHERE Id_Empresa=1 AND Activo=1 ORDER BY CASE WHEN Id_Carrera IS NULL THEN 1 ELSE 0 END, Id_Config_Financiera DESC")
    : [];

$success = isset($_GET['ok']) && $_GET['ok'] === '1';
$codigo = isset($_GET['codigo']) ? htmlspecialchars($_GET['codigo'], ENT_QUOTES, 'UTF-8') : '';
$tokenSeguimiento = isset($_GET['token']) ? trim((string)$_GET['token']) : '';
$urlSeguimiento = $tokenSeguimiento !== '' ? 'admisiones_seguimiento.php?token=' . urlencode($tokenSeguimiento) : '';
$error = isset($_GET['error']) ? htmlspecialchars($_GET['error'], ENT_QUOTES, 'UTF-8') : '';

include 'header.php';
?>

<div class="container-fluid page-header py-6 my-6 mt-0 wow fadeIn" data-wow-delay="0.1s">
    <div class="container text-center">
        <h1 class="display-4 text-white animated slideInDown mb-4">Admisiones</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a class="text-white" href="/">Inicio</a></li>
                <li class="breadcrumb-item text-primary active" aria-current="page">Admisiones</li>
            </ol>
        </nav>
    </div>
</div>

<div class="container-xxl py-6">
    <div class="container">
        <?php if ($success): ?>
            <div class="alert alert-success">
                <h4 class="alert-heading">Solicitud recibida</h4>
                <p class="mb-1">Su expediente digital fue creado correctamente.</p>
                <p class="mb-2"><strong>Codigo de seguimiento:</strong> <?php echo $codigo; ?></p>
                <?php if ($urlSeguimiento !== ''): ?>
                    <p class="mb-2">Use este enlace para revisar el estado, corregir informacion o reenviar documentos si es necesario.</p>
                    <a class="btn btn-success" href="<?php echo htmlspecialchars($urlSeguimiento, ENT_QUOTES, 'UTF-8'); ?>">Ver / corregir mi solicitud</a>
                <?php else: ?>
                    <p class="mb-0">Tambien recibira por correo el enlace privado para dar seguimiento y corregir la solicitud.</p>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <div class="row g-5">
            <div class="col-lg-4">
                <h6 class="text-primary text-uppercase mb-2">Primer ingreso</h6>
                <h1 class="display-6 mb-4">Solicitud de admision</h1>
                <p>Complete este formulario publico y adjunte los documentos oficiales requeridos. Admisiones revisara el expediente y dara seguimiento desde el sistema academico.</p>
                <div class="bg-light rounded p-4 mt-4">
                    <h5 class="mb-3">Documentos requeridos</h5>
                    <ul class="mb-0">
                        <li>Documento de identidad o pasaporte</li>
                        <li>Titulo o constancia academica</li>
                        <li>Certificacion de notas</li>
                        <li>Fotografia reciente</li>
                        <li>Otros documentos segun carrera</li>
                    </ul>
                </div>
            </div>

            <div class="col-lg-8">
                <form class="bg-light rounded p-4 p-sm-5" action="admisiones_guardar.php" method="post" enctype="multipart/form-data">
                    <h4 class="mb-4">Datos personales</h4>
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label">Nombre completo *</label>
                            <input class="form-control" type="text" name="nombre" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Tipo identificacion *</label>
                            <select class="form-select" name="tipo_identificacion" required>
                                <option value="01">Cedula fisica</option>
                                <option value="03">DIMEX</option>
                                <option value="05">Pasaporte</option>
                                <option value="04">NITE</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Identificacion *</label>
                            <input class="form-control" type="text" name="identificacion" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Correo *</label>
                            <input class="form-control" type="email" name="correo" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Telefono *</label>
                            <input class="form-control" type="text" name="telefono" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Direccion</label>
                            <input class="form-control" type="text" name="direccion">
                        </div>
                    </div>

                    <h4 class="mt-5 mb-4">Interes academico</h4>
                    <?php if (empty($carreras)): ?>
                        <div class="alert alert-warning">No hay carreras activas configuradas para admision en este momento.</div>
                    <?php endif; ?>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Nivel *</label>
                            <select class="form-select" name="nivel" id="nivel-admision" required <?php echo empty($niveles) ? 'disabled' : ''; ?>>
                                <option value="">Seleccione un nivel</option>
                                <?php foreach ($niveles as $nivel): ?>
                                    <option value="<?php echo htmlspecialchars($nivel['Nivel']); ?>">
                                        <?php echo htmlspecialchars(adm_nivel_label($nivel['Nivel'])); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Carrera de interes *</label>
                            <select class="form-select" name="id_carrera" id="carrera-admision" required <?php echo empty($carreras) ? 'disabled' : ''; ?>>
                                <option value="">Seleccione primero un nivel</option>
                                <?php foreach ($carreras as $carrera): ?>
                                    <option value="<?php echo htmlspecialchars($carrera['Id_Carrera']); ?>" data-nivel="<?php echo htmlspecialchars($carrera['Nivel']); ?>">
                                        <?php echo htmlspecialchars($carrera['Carrera']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Modalidad</label>
                            <select class="form-select" name="modalidad" <?php echo empty($modalidades) ? 'disabled' : ''; ?>>
                                <?php if (empty($modalidades)): ?>
                                    <option value="">No hay modalidades activas configuradas</option>
                                <?php else: ?>
                                    <option value="">Seleccione modalidad</option>
                                    <?php foreach ($modalidades as $modalidad): ?>
                                        <option value="<?php echo htmlspecialchars($modalidad['Modalidad']); ?>">
                                            <?php echo htmlspecialchars(adm_modalidad_label($modalidad['Modalidad'])); ?>
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Sede</label>
                            <select class="form-select" name="id_sucursal" <?php echo empty($sedes) ? 'disabled' : ''; ?>>
                                <?php if (empty($sedes)): ?>
                                    <option value="">No hay sedes activas configuradas</option>
                                <?php else: ?>
                                    <option value="">Seleccione sede</option>
                                    <?php foreach ($sedes as $sede): ?>
                                        <option value="<?php echo htmlspecialchars($sede['Id_Sucursal']); ?>">
                                            <?php echo htmlspecialchars($sede['Nombre']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Colegio o institucion de procedencia</label>
                            <input class="form-control" type="text" name="colegio_procedencia">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Ultimo grado</label>
                            <input class="form-control" type="text" name="ultimo_grado">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Ano graduacion</label>
                            <input class="form-control" type="text" name="anio_graduacion">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Promedio</label>
                            <input class="form-control" type="text" name="promedio">
                        </div>
                        <div class="col-md-9">
                            <label class="form-label">Observaciones</label>
                            <input class="form-control" type="text" name="observaciones">
                        </div>
                    </div>

                    <h4 class="mt-5 mb-4">Plan de pago</h4>
                    <?php if (empty($planesPago)): ?>
                        <div class="alert alert-warning">No hay planes de pago activos configurados. Admisiones confirmara el plan disponible.</div>
                    <?php endif; ?>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Plan deseado *</label>
                            <select class="form-select" name="id_plan_pago" id="plan-pago-admision" required <?php echo empty($planesPago) ? 'disabled' : ''; ?>>
                                <?php if (empty($planesPago)): ?>
                                    <option value="">Sin planes configurados</option>
                                <?php else: ?>
                                    <?php foreach ($planesPago as $plan): ?>
                                        <option value="<?php echo (int)$plan['Id_Admision_Plan_Pago']; ?>">
                                            <?php echo htmlspecialchars($plan['Nombre']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Resumen estimado</label>
                            <div class="border rounded bg-white p-3" id="resumen-pago-admision">
                                Seleccione carrera y plan para calcular.
                            </div>
                            <small class="text-muted">El monto final queda sujeto a validacion de admisiones/finanzas.</small>
                        </div>
                    </div>

                    <h4 class="mt-5 mb-4">Documentos oficiales</h4>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Documento de identidad / pasaporte *</label>
                            <input class="form-control" type="file" name="doc_identificacion" accept=".pdf,.jpg,.jpeg,.png" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Titulo o constancia academica *</label>
                            <input class="form-control" type="file" name="doc_titulo" accept=".pdf,.jpg,.jpeg,.png" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Certificacion de notas *</label>
                            <input class="form-control" type="file" name="doc_notas" accept=".pdf,.jpg,.jpeg,.png" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Fotografia reciente *</label>
                            <input class="form-control" type="file" name="doc_foto" accept=".jpg,.jpeg,.png" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Otros documentos</label>
                            <input class="form-control" type="file" name="doc_otro" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                        </div>
                    </div>

                    <div class="mt-4 d-flex justify-content-end">
                        <button class="btn btn-primary py-3 px-5" type="submit" <?php echo empty($carreras) ? 'disabled' : ''; ?>>Enviar solicitud</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
(function () {
    var nivel = document.getElementById('nivel-admision');
    var carrera = document.getElementById('carrera-admision');
    var plan = document.getElementById('plan-pago-admision');
    var resumen = document.getElementById('resumen-pago-admision');
    var planes = <?php echo json_encode($planesPago, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    var configs = <?php echo json_encode($configsPago, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    if (!nivel || !carrera) {
        return;
    }
    var opciones = Array.prototype.slice.call(carrera.querySelectorAll('option[data-nivel]'));
    function filtrarCarreras() {
        var selectedNivel = nivel.value;
        carrera.value = '';
        opciones.forEach(function (option) {
            option.hidden = selectedNivel === '' || option.getAttribute('data-nivel') !== selectedNivel;
        });
        calcularPago();
    }
    function moneda(valor, monedaCodigo) {
        var numero = Number(valor || 0);
        return (monedaCodigo || 'CRC') + ' ' + numero.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function configActual() {
        var carreraId = carrera.value;
        var nivelId = nivel.value;
        var byCarrera = configs.find(function (item) { return String(item.Id_Carrera || '') === String(carreraId || ''); });
        if (byCarrera) { return byCarrera; }
        return configs.find(function (item) { return !item.Id_Carrera && String(item.Nivel || '') === String(nivelId || ''); }) || null;
    }
    function planActual() {
        var planId = plan ? plan.value : '';
        return planes.find(function (item) { return String(item.Id_Admision_Plan_Pago) === String(planId); }) || null;
    }
    function calcularPago() {
        if (!resumen) { return; }
        var cfg = configActual();
        var pl = planActual();
        if (!cfg || !pl) {
            resumen.innerHTML = 'No hay configuracion financiera para esta carrera/nivel. Admisiones confirmara el monto.';
            return;
        }
        var cursos = Math.max(1, Number(cfg.Cursos_Por_Bloque || 4));
        var creditos = Math.max(0, Number(cfg.Creditos_Por_Curso || 3));
        var precioCredito = Math.max(0, Number(cfg.Precio_Credito || 0));
        var precioCurso = Math.max(0, Number(cfg.Precio_Curso || 0));
        var matricula = Math.max(0, Number(cfg.Matricula_Bloque || 0));
        var subtotalCursos = precioCurso > 0 ? precioCurso * cursos : precioCredito * creditos * cursos;
        var base = matricula + subtotalCursos;
        var descuento = base * (Number(pl.Descuento_Porcentaje || 0) / 100);
        var interes = (base - descuento) * (Number(pl.Interes_Porcentaje || 0) / 100);
        var total = Math.max(0, base - descuento + interes);
        var cuotas = Math.max(1, Number(pl.Numero_Cuotas || 1));
        var monedaCodigo = cfg.Moneda || 'CRC';
        resumen.innerHTML =
            '<strong>' + moneda(total, monedaCodigo) + '</strong><br>' +
            'Matricula: ' + moneda(matricula, monedaCodigo) + '<br>' +
            'Cursos por bloque: ' + cursos + '<br>' +
            'Monto base: ' + moneda(base, monedaCodigo) + '<br>' +
            'Descuento: ' + moneda(descuento, monedaCodigo) + '<br>' +
            'Cuotas: ' + cuotas + ' de ' + moneda(total / cuotas, monedaCodigo);
    }
    nivel.addEventListener('change', filtrarCarreras);
    carrera.addEventListener('change', calcularPago);
    if (plan) { plan.addEventListener('change', calcularPago); }
    filtrarCarreras();
})();
</script>

<?php include 'footer.php'; ?>

