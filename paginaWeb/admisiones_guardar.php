<?php
function adm_redirect_error($message) {
    header('Location: admisiones.php?error=' . urlencode($message));
    exit;
}

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

function adm_q($value) {
    $value = trim((string)($value ?? ''));
    return "'" . str_replace("'", "''", $value) . "'";
}

function adm_num($value) {
    return is_numeric($value) ? (string)(int)$value : 'NULL';
}

function adm_upload_file($field, $codigo, $tipo) {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        adm_redirect_error('No se pudo cargar el archivo ' . $tipo . '.');
    }

    $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    $original = basename($_FILES[$field]['name']);
    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed, true)) {
        adm_redirect_error('Tipo de archivo no permitido en ' . $tipo . '.');
    }
    if ((int)$_FILES[$field]['size'] > 10 * 1024 * 1024) {
        adm_redirect_error('El archivo ' . $tipo . ' supera el limite de 10 MB.');
    }

    $baseDir = __DIR__ . '/public/admisiones/' . date('Y') . '/' . preg_replace('/[^A-Za-z0-9_-]/', '', $codigo);
    if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true)) {
        adm_redirect_error('No se pudo preparar la carpeta de documentos.');
    }

    $safeName = $tipo . '-' . uniqid('', true) . '.' . $ext;
    $dest = $baseDir . '/' . $safeName;
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $dest)) {
        adm_redirect_error('No se pudo guardar el archivo ' . $tipo . '.');
    }

    return [
        'url' => '/public/admisiones/' . date('Y') . '/' . rawurlencode($codigo) . '/' . rawurlencode($safeName),
        'name' => $original,
        'mime' => $_FILES[$field]['type'] ?? ''
    ];
}

function adm_send_initial_mail($to, $nombre, $codigo, $token) {
    $to = trim((string)$to);
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $seguimientoUrl = 'https://usantana.com/admisiones_seguimiento.php?token=' . rawurlencode($token);
    $subject = 'Solicitud de admision recibida ' . $codigo;
    $message = "Hola {$nombre},\n\n" .
        "Recibimos su solicitud de admision y creamos su expediente digital.\n\n" .
        "Codigo de seguimiento: {$codigo}\n" .
        "Portal de seguimiento: {$seguimientoUrl}\n\n" .
        "Desde ese enlace podra consultar el estado, corregir informacion y reenviar documentos si admisiones lo solicita.\n\n" .
        "Atentamente,\nDepartamento de Admisiones\nUniversidad Santa Ana San Jose\n";
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'From: Admisiones USASJ <admisiones@usantana.com>';
    $headers[] = 'Reply-To: admisiones@usantana.com';
    return @mail($to, $subject, $message, implode("\r\n", $headers));
}

require_once(__DIR__ . '/admisiones_pago_lib.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: admisiones.php');
    exit;
}

$required = ['nombre', 'tipo_identificacion', 'identificacion', 'correo', 'telefono', 'id_carrera'];
foreach ($required as $field) {
    if (trim((string)($_POST[$field] ?? '')) === '') {
        adm_redirect_error('Complete los campos obligatorios.');
    }
}

$db = adm_db_instance();
if (!$db) {
    adm_redirect_error('No se pudo conectar con la base de datos.');
}

$idCarrera = adm_num($_POST['id_carrera']);
$db->Execute('SELECT Id_Carrera, Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 AND Estado = 1 AND Id_Carrera = ' . $idCarrera);
$carreraRows = $db->getData();
if (empty($carreraRows)) {
    adm_redirect_error('La carrera seleccionada no esta disponible para admision.');
}
$nivelCarrera = $carreraRows[0]['Nivel'] ?? '';

$planesPago = adm_pago_fetch_planes($db);
$idPlanPago = (int)($_POST['id_plan_pago'] ?? 0);
$planPago = adm_pago_find_plan($planesPago, $idPlanPago);
if (!empty($planesPago) && !$planPago) {
    adm_redirect_error('Seleccione un plan de pago valido.');
}
$configPago = adm_pago_fetch_config($db, (int)$idCarrera, $nivelCarrera);
$calculoPago = adm_pago_calcular($configPago ?: [], $planPago ?: []);
$infoPago = adm_pago_info($configPago ?: []);

$idSucursal = adm_num($_POST['id_sucursal'] ?? null);
if ($idSucursal !== 'NULL') {
    $db->Execute('SELECT Id_Sucursal FROM Gen_Sucursal WHERE Id_Empresa = 1 AND Estado = 1 AND Id_Sucursal = ' . $idSucursal);
    if (empty($db->getData())) {
        adm_redirect_error('La sede seleccionada no esta disponible.');
    }
}

$codigo = 'ADM-' . date('Y') . '-' . substr((string)time(), -6) . random_int(10, 99);
$token = $codigo . '-' . bin2hex(random_bytes(4));

$docs = [
    ['field' => 'doc_identificacion', 'tipo' => 'identificacion', 'nombre' => 'Documento de identidad o pasaporte', 'requerido' => 1],
    ['field' => 'doc_titulo', 'tipo' => 'titulo', 'nombre' => 'Titulo o constancia academica', 'requerido' => 1],
    ['field' => 'doc_notas', 'tipo' => 'notas', 'nombre' => 'Certificacion de notas', 'requerido' => 1],
    ['field' => 'doc_foto', 'tipo' => 'foto', 'nombre' => 'Fotografia reciente', 'requerido' => 1],
    ['field' => 'doc_otro', 'tipo' => 'otro', 'nombre' => 'Otros documentos', 'requerido' => 0]
];

$uploaded = [];
foreach ($docs as $doc) {
    $file = adm_upload_file($doc['field'], $codigo, $doc['tipo']);
    if ($doc['requerido'] && !$file) {
        adm_redirect_error('Debe cargar todos los documentos requeridos.');
    }
    $uploaded[$doc['tipo']] = $file;
}

$sql = "INSERT INTO Edu_Admision_Solicitud (
    Id_Empresa, Codigo, Nombre, Tipo_Identificacion, Identificacion, Correo, Telefono, Direccion,
    Id_Carrera, Modalidad, Id_Sucursal, Nivel, Colegio_Procedencia, Ultimo_Grado, Anio_Graduacion,
    Promedio, Observaciones, Estado, Portal_Token, Id_Admision_Plan_Pago, Monto_Base_Estimado,
    Descuento_Estimado, Total_Estimado, Numero_Cuotas_Estimado, Cuota_Estimada, Calculo_Pago_JSON,
    Pago_Info_JSON, Fecha_Envio, Creado_Por, Creado_El
) VALUES (
    1,
    " . adm_q($codigo) . ",
    " . adm_q($_POST['nombre']) . ",
    " . adm_q($_POST['tipo_identificacion']) . ",
    " . adm_q($_POST['identificacion']) . ",
    " . adm_q($_POST['correo']) . ",
    " . adm_q($_POST['telefono']) . ",
    " . adm_q($_POST['direccion'] ?? '') . ",
    " . $idCarrera . ",
    " . adm_q($_POST['modalidad'] ?? '') . ",
    " . $idSucursal . ",
    " . adm_q($nivelCarrera) . ",
    " . adm_q($_POST['colegio_procedencia'] ?? '') . ",
    " . adm_q($_POST['ultimo_grado'] ?? '') . ",
    " . adm_q($_POST['anio_graduacion'] ?? '') . ",
    " . adm_q($_POST['promedio'] ?? '') . ",
    " . adm_q($_POST['observaciones'] ?? '') . ",
    'solicitud_recibida',
    " . adm_q($token) . ",
    " . ($planPago ? (int)$planPago['Id_Admision_Plan_Pago'] : 'NULL') . ",
    " . (float)$calculoPago['monto_base'] . ",
    " . (float)$calculoPago['descuento'] . ",
    " . (float)$calculoPago['total'] . ",
    " . (int)$calculoPago['numero_cuotas'] . ",
    " . (float)$calculoPago['cuota_monto'] . ",
    " . adm_q(json_encode($calculoPago, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) . ",
    " . adm_q(json_encode($infoPago, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) . ",
    NOW(),
    'web',
    NOW()
)";

$db->Execute($sql);
if ($db->success !== 'true') {
    adm_redirect_error('No se pudo crear la solicitud: ' . $db->error);
}
$idSolicitud = $db->last_id;

foreach ($docs as $doc) {
    $file = $uploaded[$doc['tipo']] ?? null;
    $estado = $file ? 'recibido' : 'pendiente';
    $url = $file['url'] ?? '';
    $name = $file['name'] ?? '';
    $mime = $file['mime'] ?? '';
    $sqlDoc = "INSERT INTO Edu_Admision_Documento (
        Id_Empresa, Id_Admision_Solicitud, Tipo_Documento, Nombre, Requerido, URL, Nombre_Archivo, Mime_Type, Estado, Creado_El
    ) VALUES (
        1,
        " . adm_num($idSolicitud) . ",
        " . adm_q($doc['tipo']) . ",
        " . adm_q($doc['nombre']) . ",
        " . (int)$doc['requerido'] . ",
        " . adm_q($url) . ",
        " . adm_q($name) . ",
        " . adm_q($mime) . ",
        " . adm_q($estado) . ",
        NOW()
    )";
    $db->Execute($sqlDoc);
}

$sqlBitacora = "INSERT INTO Edu_Admision_Bitacora (
    Id_Empresa, Id_Admision_Solicitud, Estado_Anterior, Estado_Nuevo, Accion, Comentario, Creado_Por, Creado_El
) VALUES (
    1,
    " . adm_num($idSolicitud) . ",
    '',
    'solicitud_recibida',
    'Solicitud recibida desde pagina web',
    'El aspirante envio la solicitud publica con documentos iniciales.',
    'web',
    NOW()
)";
$db->Execute($sqlBitacora);

adm_send_initial_mail($_POST['correo'], $_POST['nombre'], $codigo, $token);

header('Location: admisiones.php?ok=1&codigo=' . urlencode($codigo) . '&token=' . urlencode($token));
exit;



