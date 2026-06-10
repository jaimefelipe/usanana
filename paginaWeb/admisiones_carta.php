<?php
function adm_db_instance() {
    $candidates=[__DIR__.'/core/db/epsMySqlDataBase_v2.php', __DIR__.'/../backoffice/core/db/epsMySqlDataBase_v2.php'];
    foreach($candidates as $file){ if(file_exists($file)){ include_once($file); break; }}
    return class_exists('epsMySqlDatabase') ? epsMySqlDatabase::GetInstance() : null;
}
function adm_q($value) { return "'" . str_replace("'", "''", trim((string)($value ?? ''))) . "'"; }

require_once(__DIR__ . '/admisiones_carta_lib.php');

$token=trim((string)($_GET['token'] ?? ''));
$db=adm_db_instance();
if(!$db || $token==='') { http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Carta no disponible'; exit; }

$db->Execute('SELECT s.*, c.Carrera FROM Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera=s.Id_Carrera WHERE s.Id_Empresa=1 AND s.Portal_Token='.adm_q($token).' LIMIT 1');
$rows=$db->getData();
$s=$rows[0] ?? null;
$estadosPermitidos = ['aprobada','admitida_condicionada','orden_pago','pago_pendiente','pago_en_revision','pago_aprobado','matriculado','alumno_activo'];
if(!$s || !in_array($s['Estado'], $estadosPermitidos, true)) { http_response_code(403); header('Content-Type: text/plain; charset=utf-8'); echo 'Carta no disponible para este estado'; exit; }

$idSolicitudCarta = (int)$s['Id_Admision_Solicitud'];
$db->Execute("SELECT o.*, p.Nombre AS Plan_Pago FROM Edu_Admision_Orden_Pago o LEFT JOIN Edu_Admision_Plan_Pago p ON p.Id_Admision_Plan_Pago=o.Id_Admision_Plan_Pago WHERE o.Id_Empresa=1 AND o.Id_Admision_Solicitud=$idSolicitudCarta ORDER BY o.Id_Admision_Orden_Pago DESC");
$s['OrdenesPago'] = $db->getData();
$db->Execute("SELECT f.* FROM Edu_Admision_Config_Financiera f WHERE f.Id_Empresa=1 AND f.Activo=1 AND f.Id_Carrera=" . (int)$s['Id_Carrera'] . " ORDER BY f.Id_Config_Financiera DESC LIMIT 1");
$configRows = $db->getData();
if (empty($configRows)) {
    $nivelCarta = adm_q($s['Nivel'] ?? '');
    $db->Execute("SELECT f.* FROM Edu_Admision_Config_Financiera f WHERE f.Id_Empresa=1 AND f.Activo=1 AND f.Id_Carrera IS NULL AND f.Nivel=$nivelCarta ORDER BY f.Id_Config_Financiera DESC LIMIT 1");
    $configRows = $db->getData();
}
$s['ConfigFinanciera'] = $configRows[0] ?? [];
$db->Execute("SELECT Id_Admision_Plan_Pago,Codigo,Nombre,Tipo,Descuento_Porcentaje,Numero_Cuotas,Dias_Primer_Pago,Interes_Porcentaje FROM Edu_Admision_Plan_Pago WHERE Id_Empresa=1 AND Activo=1 ORDER BY Id_Admision_Plan_Pago");
$s['PlanesPago'] = $db->getData();
$pdf = adm_carta_pdf_bytes($s, 'S');
$filename = 'carta-admision-' . preg_replace('/[^A-Za-z0-9_-]/', '', $s['Codigo']) . '.pdf';
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $filename . '"');
header('Content-Length: ' . strlen($pdf));
echo $pdf;
exit;


