<?php
function adm_redirect($token, $params = '') { header('Location: admisiones_seguimiento.php?token=' . urlencode($token) . $params); exit; }
function adm_db_instance() { $candidates=[__DIR__.'/core/db/epsMySqlDataBase_v2.php', __DIR__.'/../backoffice/core/db/epsMySqlDataBase_v2.php']; foreach($candidates as $file){ if(file_exists($file)){ include_once($file); break; }} return class_exists('epsMySqlDatabase') ? epsMySqlDatabase::GetInstance() : null; }
function adm_q($value) { return "'" . str_replace("'", "''", trim((string)($value ?? ''))) . "'"; }
function adm_json_array($value) { $decoded=json_decode((string)($value ?? ''), true); return is_array($decoded) ? $decoded : []; }
function adm_mail_simple($to, $subject, $message) {
    $to=trim((string)$to);
    if($to==='' || !filter_var($to, FILTER_VALIDATE_EMAIL)) return false;
    $headers=[];
    $headers[]='MIME-Version: 1.0';
    $headers[]='Content-Type: text/plain; charset=UTF-8';
    $headers[]='From: Admisiones USASJ <admisiones@usantana.com>';
    $headers[]='Reply-To: admisiones@usantana.com';
    return @mail($to,$subject,$message,implode("\r\n",$headers));
}
function adm_upload_file($field, $codigo, $tipo) {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) return null;
    $allowed=['pdf','jpg','jpeg','png','doc','docx'];
    $original=basename($_FILES[$field]['name']);
    $ext=strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if(!in_array($ext,$allowed,true) || (int)$_FILES[$field]['size'] > 10*1024*1024) return null;
    $dir=__DIR__.'/public/admisiones/'.date('Y').'/'.preg_replace('/[^A-Za-z0-9_-]/','',$codigo);
    if(!is_dir($dir)) mkdir($dir,0755,true);
    $safe=$tipo.'-'.uniqid('',true).'.'.$ext;
    if(!move_uploaded_file($_FILES[$field]['tmp_name'],$dir.'/'.$safe)) return null;
    return ['url'=>'/public/admisiones/'.date('Y').'/'.rawurlencode($codigo).'/'.rawurlencode($safe),'name'=>$original,'mime'=>$_FILES[$field]['type'] ?? ''];
}

$token=trim((string)($_POST['token'] ?? ''));
if($token==='') adm_redirect('', '&error=Token requerido');
$db=adm_db_instance();
if(!$db) adm_redirect($token, '&error=No se pudo conectar con la base de datos');
$db->Execute('SELECT * FROM Edu_Admision_Solicitud WHERE Id_Empresa=1 AND Portal_Token='.adm_q($token).' LIMIT 1');
$rows=$db->getData();
$sol=$rows[0] ?? null;
if(!$sol) adm_redirect($token, '&error=Solicitud no encontrada');
$id=(int)$sol['Id_Admision_Solicitud'];
$codigo=$sol['Codigo'];
$updated=false;
$pagoSubido=false;

if(isset($_POST['telefono']) || isset($_POST['correo']) || isset($_POST['direccion']) || isset($_POST['observaciones'])){
    $telefono = $_POST['telefono'] ?? $sol['Telefono'];
    $correo = $_POST['correo'] ?? $sol['Correo'];
    $direccion = $_POST['direccion'] ?? $sol['Direccion'];
    $observaciones = $_POST['observaciones'] ?? $sol['Observaciones'];
    $db->Execute("UPDATE Edu_Admision_Solicitud SET Telefono=".adm_q($telefono).", Correo=".adm_q($correo).", Direccion=".adm_q($direccion).", Observaciones=".adm_q($observaciones).", Fecha_Ultima_Actualizacion_Aspirante=NOW(), Modificado_El=NOW(), Modificado_Por='prospecto' WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id");
    $updated=true;
}

$db->Execute("SELECT * FROM Edu_Admision_Documento WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id");
foreach($db->getData() as $doc){
    $field='doc_'.(int)$doc['Id_Admision_Documento'];
    $file=adm_upload_file($field,$codigo,$doc['Tipo_Documento'].'-correccion');
    if($file){
        $docId=(int)$doc['Id_Admision_Documento'];
        $db->Execute("UPDATE Edu_Admision_Documento SET URL=".adm_q($file['url']).", Nombre_Archivo=".adm_q($file['name']).", Mime_Type=".adm_q($file['mime']).", Estado='recibido', Observacion=NULL, Modificado_El=NOW(), Modificado_Por='prospecto' WHERE Id_Empresa=1 AND Id_Admision_Documento=$docId");
        $db->Execute("UPDATE Edu_Admision_Solicitud SET Fecha_Ultima_Actualizacion_Aspirante=NOW(), Modificado_El=NOW(), Modificado_Por='prospecto' WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id");
        $updated=true;
    }
}

$db->Execute("SELECT * FROM Edu_Admision_Orden_Pago WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id AND Estado IN ('pendiente','rechazado','incompleto')");
foreach($db->getData() as $orden){
    $field='pago_'.(int)$orden['Id_Admision_Orden_Pago'];
    $file=adm_upload_file($field,$codigo,'comprobante-pago');
    if($file){
        $ordenId=(int)$orden['Id_Admision_Orden_Pago'];
        $db->Execute("UPDATE Edu_Admision_Orden_Pago SET Comprobante_URL=".adm_q($file['url']).", Estado='comprobante_recibido', Observacion_Financiera=NULL, Modificado_El=NOW(), Modificado_Por='prospecto' WHERE Id_Empresa=1 AND Id_Admision_Orden_Pago=$ordenId");
        $db->Execute("UPDATE Edu_Admision_Solicitud SET Estado='pago_en_revision', Fecha_Ultima_Actualizacion_Aspirante=NOW(), Modificado_El=NOW(), Modificado_Por='prospecto' WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id");
        $pagoInfo=adm_json_array($orden['Pago_Info_JSON'] ?? '');
        if(empty($pagoInfo)) $pagoInfo=adm_json_array($sol['Pago_Info_JSON'] ?? '');
        $notificar=$pagoInfo['notificar_email'] ?? 'admisiones@usantana.com';
        adm_mail_simple(
            $notificar,
            'Comprobante de pago recibido '.$codigo,
            "Se recibio un comprobante de pago desde el portal de admisiones.\n\n".
            "Solicitud: ".$codigo."\n".
            "Aspirante: ".($sol['Nombre'] ?? '')."\n".
            "Referencia: ".($orden['Referencia'] ?? '')."\n".
            "Comprobante: https://usantana.com".($file['url'] ?? '')."\n\n".
            "Revise el expediente en Academico > Admisiones.\n"
        );
        $pagoSubido=true;
        $updated=true;
    }
}

if($updated){
    $nuevoEstado = $pagoSubido ? 'pago_en_revision' : $sol['Estado'];
    $accion = $pagoSubido ? 'Comprobante de pago enviado' : 'Actualizacion del prospecto';
    $comentario = $pagoSubido ? 'El prospecto envio un comprobante de pago para revision financiera.' : 'El prospecto actualizo informacion o documentos desde el portal.';
    $db->Execute("INSERT INTO Edu_Admision_Bitacora (Id_Empresa,Id_Admision_Solicitud,Estado_Anterior,Estado_Nuevo,Accion,Comentario,Creado_Por) VALUES (1,$id,".adm_q($sol['Estado']).",".adm_q($nuevoEstado).",".adm_q($accion).",".adm_q($comentario).",'prospecto')");
}

adm_redirect($token, '&ok=1');
