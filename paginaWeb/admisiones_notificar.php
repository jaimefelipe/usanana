<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once(__DIR__ . '/admisiones_carta_lib.php');

function adm_notify_db_instance() {
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

function adm_notify_q($value) {
    $value = trim((string)($value ?? ''));
    return "'" . str_replace("'", "''", $value) . "'";
}

function adm_notify_json($success, $payload = []) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge(['success' => $success ? 'true' : 'false'], $payload));
    exit;
}

function adm_notify_send_mail($to, $subject, $message, $attachments = []) {
    $to = trim((string)$to);
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    if (empty($attachments)) {
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'From: Admisiones USASJ <admisiones@usantana.com>';
        $headers[] = 'Reply-To: admisiones@usantana.com';
        return @mail($to, $subject, $message, implode("\r\n", $headers));
    }

    $boundary = '==USASJ_ADM_' . md5(uniqid('', true));
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'From: Admisiones USASJ <admisiones@usantana.com>';
    $headers[] = 'Reply-To: admisiones@usantana.com';
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $message . "\r\n\r\n";

    foreach ($attachments as $attachment) {
        if (empty($attachment['content']) || empty($attachment['filename'])) {
            continue;
        }
        $mime = $attachment['mime'] ?? 'application/octet-stream';
        $filename = preg_replace('/[^A-Za-z0-9_.-]/', '-', $attachment['filename']);
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: {$mime}; name=\"{$filename}\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"{$filename}\"\r\n\r\n";
        $body .= chunk_split(base64_encode($attachment['content'])) . "\r\n";
    }
    $body .= "--{$boundary}--";

    return @mail($to, $subject, $body, implode("\r\n", $headers));
}

function adm_notify_pago_info_text($orden, $sol) {
    $info = json_decode((string)($orden['Pago_Info_JSON'] ?? ''), true);
    if (!is_array($info) || empty($info)) {
        $info = json_decode((string)($sol['Pago_Info_JSON'] ?? ''), true);
    }
    if (!is_array($info) || empty($info)) {
        return '';
    }
    $text = '';
    if (!empty($info['medio_pago_texto'])) {
        $text .= "Medios de pago: " . $info['medio_pago_texto'] . "\n";
    }
    if (!empty($info['notificar_email'])) {
        $text .= "Notificar pago a: " . $info['notificar_email'] . "\n";
    }
    if (!empty($info['bancos']) && is_array($info['bancos'])) {
        $text .= "Cuentas bancarias:\n";
        foreach ($info['bancos'] as $banco) {
            if (!is_array($banco)) { continue; }
            $partes = [];
            if (!empty($banco['banco'])) { $partes[] = $banco['banco']; }
            if (!empty($banco['cuenta'])) { $partes[] = 'Cuenta ' . $banco['cuenta']; }
            if (!empty($banco['iban'])) { $partes[] = 'IBAN ' . $banco['iban']; }
            if (!empty($banco['moneda'])) { $partes[] = $banco['moneda']; }
            if (!empty($partes)) { $text .= "- " . implode(' | ', $partes) . "\n"; }
        }
    }
    return $text;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    adm_notify_json(false, ['error' => 'Metodo no permitido']);
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$db = adm_notify_db_instance();
if (!$db) {
    adm_notify_json(false, ['error' => 'No se pudo conectar con la base de datos']);
}

$idSolicitud = isset($input['id_solicitud']) ? (int)$input['id_solicitud'] : 0;
$token = trim((string)($input['token'] ?? ''));
$tipo = trim((string)($input['tipo'] ?? 'recibida'));

$where = $idSolicitud > 0
    ? 's.Id_Empresa = 1 AND s.Id_Admision_Solicitud = ' . $idSolicitud
    : 's.Id_Empresa = 1 AND s.Portal_Token = ' . adm_notify_q($token);

$db->Execute('SELECT s.*, c.Carrera FROM Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera=s.Id_Carrera WHERE ' . $where . ' LIMIT 1');
$rows = $db->getData();
if (empty($rows)) {
    adm_notify_json(false, ['error' => 'Solicitud no encontrada']);
}

$sol = $rows[0];
$idSolicitudOrden = (int)$sol['Id_Admision_Solicitud'];
$db->Execute("SELECT o.*, p.Nombre AS Plan_Pago FROM Edu_Admision_Orden_Pago o LEFT JOIN Edu_Admision_Plan_Pago p ON p.Id_Admision_Plan_Pago=o.Id_Admision_Plan_Pago WHERE o.Id_Empresa=1 AND o.Id_Admision_Solicitud=$idSolicitudOrden ORDER BY o.Id_Admision_Orden_Pago DESC");
$sol['OrdenesPago'] = $db->getData();
$db->Execute("SELECT f.* FROM Edu_Admision_Config_Financiera f WHERE f.Id_Empresa=1 AND f.Activo=1 AND f.Id_Carrera=" . (int)$sol['Id_Carrera'] . " ORDER BY f.Id_Config_Financiera DESC LIMIT 1");
$configRows = $db->getData();
if (empty($configRows)) {
    $nivelNotificacion = adm_notify_q($sol['Nivel'] ?? '');
    $db->Execute("SELECT f.* FROM Edu_Admision_Config_Financiera f WHERE f.Id_Empresa=1 AND f.Activo=1 AND f.Id_Carrera IS NULL AND f.Nivel=$nivelNotificacion ORDER BY f.Id_Config_Financiera DESC LIMIT 1");
    $configRows = $db->getData();
}
$sol['ConfigFinanciera'] = $configRows[0] ?? [];
$db->Execute("SELECT Id_Admision_Plan_Pago,Codigo,Nombre,Tipo,Descuento_Porcentaje,Numero_Cuotas,Dias_Primer_Pago,Interes_Porcentaje FROM Edu_Admision_Plan_Pago WHERE Id_Empresa=1 AND Activo=1 ORDER BY Id_Admision_Plan_Pago");
$sol['PlanesPago'] = $db->getData();
$seguimientoUrl = 'https://usantana.com/admisiones_seguimiento.php?token=' . rawurlencode($sol['Portal_Token']);
$cartaUrl = 'https://usantana.com/admisiones_carta.php?token=' . rawurlencode($sol['Portal_Token']);
$nombre = $sol['Nombre'] ?: 'aspirante';
$codigo = $sol['Codigo'] ?: '';
$estado = $sol['Estado'] ?: '';
$validacion = adm_carta_codigo_validacion($sol);
$attachments = [];

$subject = 'Seguimiento de admision ' . $codigo;
$body = "Hola {$nombre},\n\n";

if ($tipo === 'correccion') {
    $subject = 'Correccion requerida en su solicitud de admision ' . $codigo;
    $body .= "El area de admisiones reviso su expediente y requiere que corrija o complete informacion/documentos.\n\n";
    $body .= "Ingrese al portal de seguimiento para ver las observaciones y reenviar los documentos necesarios:\n{$seguimientoUrl}\n\n";
} elseif ($tipo === 'resultado') {
    if ($estado === 'rechazada') {
        $subject = 'Resultado de su solicitud de admision ' . $codigo;
        $body .= "Su solicitud fue revisada. Puede consultar el resultado y observaciones en el portal de seguimiento:\n{$seguimientoUrl}\n\n";
    } else {
        $subject = ($estado === 'admitida_condicionada' ? 'Admision condicionada ' : 'Solicitud de admision aprobada ') . $codigo;
        $body .= "Adjuntamos su carta oficial de admision en formato PDF.\n\n";
        $body .= "Numero de solicitud: {$codigo}\n";
        $body .= "Codigo de validacion: {$validacion}\n\n";
        if (!empty($sol['OrdenesPago'])) {
            $orden = $sol['OrdenesPago'][0];
            $body .= "Informacion de pago:\n";
            $body .= "Plan: " . ($orden['Plan_Pago'] ?? 'Pendiente de definir') . "\n";
            $body .= "Referencia: " . ($orden['Referencia'] ?? '') . "\n";
            $body .= "Concepto: " . ($orden['Concepto'] ?? 'Admision y matricula inicial') . "\n";
            $body .= "Total: " . ($orden['Moneda'] ?? 'CRC') . " " . number_format((float)($orden['Total'] ?? 0), 2) . "\n";
            if (!empty($orden['Fecha_Limite'])) { $body .= "Fecha limite: " . $orden['Fecha_Limite'] . "\n"; }
            $body .= adm_notify_pago_info_text($orden, $sol);
            $body .= "Pago y comprobante: {$seguimientoUrl}\n\n";
        } else {
            $opciones = adm_carta_opciones_pago_lineas($sol);
            if (!empty($opciones)) {
                $body .= "Opciones financieras estimadas:\n";
                foreach ($opciones as $lineaPago) {
                    $body .= "- {$lineaPago}\n";
                }
                $body .= "\n";
            }
            $body .= "La orden de pago definitiva se mostrara en el portal de seguimiento cuando Admisiones la genere.\n";
            $body .= "Portal para pago/comprobante: {$seguimientoUrl}\n\n";
        }
        $body .= "Tambien puede descargar la carta y continuar con las indicaciones de pago desde el portal:\n{$seguimientoUrl}\n\nCarta en linea:\n{$cartaUrl}\n\n";
        $pdf = adm_carta_pdf_bytes($sol, 'S');
        if ($pdf !== false) {
            $attachments[] = [
                'filename' => 'carta-admision-' . preg_replace('/[^A-Za-z0-9_-]/', '', $codigo) . '.pdf',
                'mime' => 'application/pdf',
                'content' => $pdf
            ];
        }
    }
} elseif ($tipo === 'alumno_activo') {
    $subject = 'Acceso a plataforma academica ' . $codigo;
    $usuario = !empty($sol['Correo']) ? $sol['Correo'] : $sol['Identificacion'];
    $body .= "Su proceso de admision y matricula fue completado. Ya quedo como alumno activo.\n\n";
    $body .= "Datos de acceso iniciales:\n";
    $body .= "Usuario: {$usuario}\n";
    $body .= "Clave temporal: Password\n";
    $body .= "Plataforma academica: https://usantana.com/campus\n\n";
    $body .= "Por seguridad, cambie la clave despues del primer ingreso. En el portal de seguimiento tambien puede consultar el estado final de su expediente:\n{$seguimientoUrl}\n\n";
    $body .= "Para induccion o soporte, contacte al area academica o soporte institucional.\n\n";
} elseif ($tipo === 'orden_pago') {
    $subject = 'Orden de pago de admision ' . $codigo;
    $body .= "Ya tiene una orden de pago generada para continuar el proceso de matricula.\n\n";
    if (!empty($sol['OrdenesPago'])) {
        $orden = $sol['OrdenesPago'][0];
        $body .= "Informacion de pago:\n";
        $body .= "Plan: " . ($orden['Plan_Pago'] ?? 'Pendiente de definir') . "\n";
        $body .= "Referencia: " . ($orden['Referencia'] ?? '') . "\n";
        $body .= "Concepto: " . ($orden['Concepto'] ?? 'Admision y matricula inicial') . "\n";
        $body .= "Total: " . ($orden['Moneda'] ?? 'CRC') . " " . number_format((float)($orden['Total'] ?? 0), 2) . "\n";
        if (!empty($orden['Fecha_Limite'])) { $body .= "Fecha limite: " . $orden['Fecha_Limite'] . "\n"; }
        $body .= adm_notify_pago_info_text($orden, $sol);
        $body .= "\n";
    }
    $body .= "Ingrese al portal para ver medios de pago y cargar el comprobante si corresponde:\n{$seguimientoUrl}\n\n";
    $pdf = adm_carta_pdf_bytes($sol, 'S');
    if ($pdf !== false) {
        $attachments[] = [
            'filename' => 'carta-admision-' . preg_replace('/[^A-Za-z0-9_-]/', '', $codigo) . '.pdf',
            'mime' => 'application/pdf',
            'content' => $pdf
        ];
    }
} else {
    $subject = 'Solicitud de admision recibida ' . $codigo;
    $body .= "Recibimos su solicitud de admision y creamos su expediente digital.\n\n";
    $body .= "Codigo de seguimiento: {$codigo}\nPortal de seguimiento:\n{$seguimientoUrl}\n\n";
}

if (!empty($sol['Condiciones_Admision'])) {
    $body .= "Observaciones:\n" . $sol['Condiciones_Admision'] . "\n\n";
}

$body .= "Atentamente,\nDepartamento de Admisiones\nUniversidad Santa Ana San Jose\n";

$sent = adm_notify_send_mail($sol['Correo'], $subject, $body, $attachments);
$attachmentNote = count($attachments) > 0 ? ' con PDF adjunto' : '';

$db->Execute("INSERT INTO Edu_Admision_Bitacora (
    Id_Empresa, Id_Admision_Solicitud, Estado_Anterior, Estado_Nuevo, Accion, Comentario, Creado_Por, Creado_El
) VALUES (
    1,
    " . (int)$sol['Id_Admision_Solicitud'] . ",
    " . adm_notify_q($estado) . ",
    " . adm_notify_q($estado) . ",
    " . adm_notify_q('Notificacion ' . $tipo) . ",
    " . adm_notify_q(($sent ? 'Correo enviado a ' : 'No se pudo enviar correo a ') . $sol['Correo'] . $attachmentNote) . ",
    'sistema',
    NOW()
)");

adm_notify_json(true, [
    'sent' => $sent ? 'true' : 'false',
    'email' => $sol['Correo'],
    'seguimiento_url' => $seguimientoUrl,
    'validacion' => $validacion,
    'attachments' => count($attachments)
]);


