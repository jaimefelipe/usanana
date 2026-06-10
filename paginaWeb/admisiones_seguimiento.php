<?php
function adm_db_instance() {
    $candidates = [__DIR__ . '/core/db/epsMySqlDataBase_v2.php', __DIR__ . '/../backoffice/core/db/epsMySqlDataBase_v2.php'];
    foreach ($candidates as $file) { if (file_exists($file)) { include_once($file); break; } }
    return class_exists('epsMySqlDatabase') ? epsMySqlDatabase::GetInstance() : null;
}
function adm_q($value) { return "'" . str_replace("'", "''", trim((string)($value ?? ''))) . "'"; }
function adm_abs_url($url) {
    $url = trim((string)$url);
    if ($url === '') return '';
    if (preg_match('/^https?:\/\//i', $url)) return $url;
    return 'https://usantana.com' . ($url[0] === '/' ? $url : '/' . $url);
}
function adm_estado_label($estado) {
    $map = [
        'solicitud_recibida' => 'Solicitud recibida',
        'documentacion_incompleta' => 'Documentacion incompleta',
        'documentacion_completa' => 'Documentacion completa',
        'pendiente_aprobacion' => 'Pendiente de aprobacion',
        'aprobada' => 'Aprobada',
        'rechazada' => 'Rechazada',
        'admitida_condicionada' => 'Admitida condicionada',
        'orden_pago' => 'Orden de pago generada',
        'pago_pendiente' => 'Pago pendiente',
        'pago_en_revision' => 'Pago en revision',
        'pago_aprobado' => 'Pago aprobado',
        'matriculado' => 'Matriculado',
        'alumno_activo' => 'Alumno activo'
    ];
    return $map[$estado] ?? $estado;
}
function adm_json_array($value) {
    $decoded = json_decode((string)($value ?? ''), true);
    return is_array($decoded) ? $decoded : [];
}

$token = trim((string)($_GET['token'] ?? ''));
$ok = isset($_GET['ok']) ? trim((string)$_GET['ok']) : '';
$error = isset($_GET['error']) ? trim((string)$_GET['error']) : '';
$db = adm_db_instance();
$solicitud = null;
$documentos = [];
$ordenes = [];

if ($db && $token !== '') {
    $db->Execute("SELECT s.*, c.Carrera FROM Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera=s.Id_Carrera WHERE s.Id_Empresa=1 AND s.Portal_Token=" . adm_q($token) . " LIMIT 1");
    $rows = $db->getData();
    $solicitud = $rows[0] ?? null;
    if ($solicitud) {
        $id = (int)$solicitud['Id_Admision_Solicitud'];
        $db->Execute("SELECT * FROM Edu_Admision_Documento WHERE Id_Empresa=1 AND Id_Admision_Solicitud=$id ORDER BY Id_Admision_Documento");
        $documentos = $db->getData();
        $db->Execute("SELECT o.*, p.Nombre AS Plan_Pago FROM Edu_Admision_Orden_Pago o LEFT JOIN Edu_Admision_Plan_Pago p ON p.Id_Admision_Plan_Pago=o.Id_Admision_Plan_Pago WHERE o.Id_Empresa=1 AND o.Id_Admision_Solicitud=$id ORDER BY o.Id_Admision_Orden_Pago DESC");
        $ordenes = $db->getData();
        $db->Execute("SELECT Nombre FROM Edu_Admision_Plan_Pago WHERE Id_Empresa=1 AND Id_Admision_Plan_Pago=" . (int)($solicitud['Id_Admision_Plan_Pago'] ?? 0) . " LIMIT 1");
        $planRows = $db->getData();
        $solicitud['Plan_Pago'] = $planRows[0]['Nombre'] ?? '';
    }
}
include 'header.php';
?>

<div class="container-fluid page-header py-6 my-6 mt-0 wow fadeIn" data-wow-delay="0.1s">
  <div class="container text-center">
    <h1 class="display-4 text-white animated slideInDown mb-4">Seguimiento de admision</h1>
  </div>
</div>

<div class="container-xxl py-6">
  <div class="container">
    <?php if ($ok): ?><div class="alert alert-success">Informacion actualizada correctamente.</div><?php endif; ?>
    <?php if ($error): ?><div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

    <?php if (!$token): ?>
      <div class="alert alert-warning">Ingrese desde el enlace enviado a su correo.</div>
    <?php elseif (!$solicitud): ?>
      <div class="alert alert-danger">No encontramos una solicitud con este enlace de seguimiento.</div>
    <?php else: ?>
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="bg-light rounded p-4">
            <h3 class="mb-3"><?php echo htmlspecialchars($solicitud['Codigo']); ?></h3>
            <p class="mb-1"><strong>Estado:</strong></p>
            <h5 class="text-primary"><?php echo htmlspecialchars(adm_estado_label($solicitud['Estado'])); ?></h5>
            <p><strong>Carrera:</strong><br><?php echo htmlspecialchars($solicitud['Carrera'] ?? ''); ?></p>
            <?php if (!empty($solicitud['Condiciones_Admision'])): ?>
              <div class="alert alert-info"><strong>Observaciones de admisiones:</strong><br><?php echo nl2br(htmlspecialchars($solicitud['Condiciones_Admision'])); ?></div>
            <?php endif; ?>
            <?php $calculoInicial = adm_json_array($solicitud['Calculo_Pago_JSON'] ?? ''); ?>
            <?php if (!empty($calculoInicial)): ?>
              <div class="border rounded bg-white p-3 mt-3">
                <h6>Plan financiero seleccionado</h6>
                <p class="mb-1"><strong>Plan:</strong> <?php echo htmlspecialchars($solicitud['Plan_Pago'] ?: 'Pendiente'); ?></p>
                <p class="mb-1"><strong>Monto estimado:</strong> <?php echo htmlspecialchars($calculoInicial['moneda'] ?? 'CRC'); ?> <?php echo number_format((float)($calculoInicial['total'] ?? 0), 2); ?></p>
                <p class="mb-0"><strong>Cuotas:</strong> <?php echo (int)($calculoInicial['numero_cuotas'] ?? 1); ?> de <?php echo htmlspecialchars($calculoInicial['moneda'] ?? 'CRC'); ?> <?php echo number_format((float)($calculoInicial['cuota_monto'] ?? 0), 2); ?></p>
              </div>
            <?php endif; ?>
          </div>

          <?php if (in_array($solicitud['Estado'], ['aprobada','admitida_condicionada','orden_pago','pago_pendiente','pago_en_revision','pago_aprobado','matriculado','alumno_activo'], true)): ?>
            <div class="bg-light rounded p-4 mt-4">
              <h5>Carta de admision</h5>
              <a class="btn btn-primary" target="_blank" href="admisiones_carta.php?token=<?php echo urlencode($token); ?>">Ver / descargar carta</a>
            </div>
          <?php endif; ?>
        </div>

        <div class="col-lg-8">
          <form class="bg-light rounded p-4" action="admisiones_actualizar.php" method="post" enctype="multipart/form-data">
            <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
            <h4 class="mb-3">Datos de contacto</h4>
            <div class="row g-3">
              <div class="col-md-6"><label class="form-label">Telefono</label><input class="form-control" name="telefono" value="<?php echo htmlspecialchars($solicitud['Telefono']); ?>"></div>
              <div class="col-md-6"><label class="form-label">Correo</label><input class="form-control" type="email" name="correo" value="<?php echo htmlspecialchars($solicitud['Correo']); ?>"></div>
              <div class="col-12"><label class="form-label">Direccion</label><input class="form-control" name="direccion" value="<?php echo htmlspecialchars($solicitud['Direccion']); ?>"></div>
              <div class="col-12"><label class="form-label">Observaciones adicionales</label><textarea class="form-control" name="observaciones" rows="2"><?php echo htmlspecialchars($solicitud['Observaciones']); ?></textarea></div>
            </div>

            <h4 class="mt-5 mb-3">Documentos</h4>
            <?php foreach ($documentos as $doc): ?>
              <div class="border rounded p-3 mb-3 bg-white">
                <div class="d-flex justify-content-between flex-wrap gap-2">
                  <div>
                    <strong><?php echo htmlspecialchars($doc['Nombre']); ?></strong><br>
                    <span class="badge bg-secondary"><?php echo htmlspecialchars($doc['Estado']); ?></span>
                    <?php if ($doc['URL']): ?><a class="ms-2" target="_blank" href="<?php echo htmlspecialchars(adm_abs_url($doc['URL'])); ?>">Ver actual</a><?php endif; ?>
                  </div>
                  <div class="text-muted small"><?php echo htmlspecialchars($doc['Nombre_Archivo']); ?></div>
                </div>
                <?php if (!empty($doc['Observacion'])): ?>
                  <div class="alert alert-warning mt-2 mb-2"><?php echo nl2br(htmlspecialchars($doc['Observacion'])); ?></div>
                <?php endif; ?>
                <?php if (in_array($doc['Estado'], ['pendiente','rechazado','requiere_correccion'], true)): ?>
                  <label class="form-label mt-2">Reenviar documento</label>
                  <input class="form-control" type="file" name="doc_<?php echo (int)$doc['Id_Admision_Documento']; ?>" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                <?php endif; ?>
              </div>
            <?php endforeach; ?>

            <button class="btn btn-primary" type="submit">Guardar cambios</button>
          </form>

          <?php if (!empty($ordenes)): ?>
            <div class="bg-light rounded p-4 mt-4">
              <h4>Ordenes de pago</h4>
              <?php foreach ($ordenes as $orden): ?>
                <div class="border rounded p-3 mb-2 bg-white">
                  <strong>Referencia:</strong> <?php echo htmlspecialchars($orden['Referencia']); ?><br>
                  <strong>Concepto:</strong> <?php echo htmlspecialchars($orden['Concepto']); ?><br>
                  <strong>Plan:</strong> <?php echo htmlspecialchars($orden['Plan_Pago']); ?><br>
                  <strong>Total:</strong> <?php echo htmlspecialchars($orden['Moneda']); ?> <?php echo number_format((float)$orden['Total'], 2); ?><br>
                  <strong>Fecha limite:</strong> <?php echo htmlspecialchars($orden['Fecha_Limite']); ?><br>
                  <strong>Estado:</strong> <?php echo htmlspecialchars($orden['Estado']); ?><br>
                  <?php $pagoInfo = adm_json_array($orden['Pago_Info_JSON'] ?: ($solicitud['Pago_Info_JSON'] ?? '')); ?>
                  <?php if (!empty($pagoInfo['medio_pago_texto'])): ?>
                    <strong>Medios de pago:</strong> <?php echo htmlspecialchars($pagoInfo['medio_pago_texto']); ?><br>
                  <?php endif; ?>
                  <?php if (!empty($pagoInfo['notificar_email'])): ?>
                    <strong>Notificar pago a:</strong> <?php echo htmlspecialchars($pagoInfo['notificar_email']); ?><br>
                  <?php endif; ?>
                  <?php if (!empty($pagoInfo['bancos']) && is_array($pagoInfo['bancos'])): ?>
                    <div class="mt-2">
                      <strong>Cuentas bancarias:</strong>
                      <ul class="mb-2">
                        <?php foreach ($pagoInfo['bancos'] as $banco): ?>
                          <li>
                            <?php echo htmlspecialchars($banco['banco'] ?? 'Banco'); ?>
                            <?php if (!empty($banco['cuenta'])): ?> | Cuenta: <?php echo htmlspecialchars($banco['cuenta']); ?><?php endif; ?>
                            <?php if (!empty($banco['iban'])): ?> | IBAN: <?php echo htmlspecialchars($banco['iban']); ?><?php endif; ?>
                            <?php if (!empty($banco['moneda'])): ?> | <?php echo htmlspecialchars($banco['moneda']); ?><?php endif; ?>
                          </li>
                        <?php endforeach; ?>
                      </ul>
                    </div>
                  <?php endif; ?>
                  <?php if (!empty($orden['Comprobante_URL'])): ?>
                    <strong>Comprobante:</strong> <a target="_blank" href="<?php echo htmlspecialchars(adm_abs_url($orden['Comprobante_URL'])); ?>">Ver comprobante enviado</a><br>
                  <?php endif; ?>
                  <?php if (in_array($orden['Estado'], ['pendiente','rechazado','incompleto'], true)): ?>
                    <form class="mt-3" action="admisiones_actualizar.php" method="post" enctype="multipart/form-data">
                      <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                      <label class="form-label">Subir comprobante de pago</label>
                      <input class="form-control mb-2" type="file" name="pago_<?php echo (int)$orden['Id_Admision_Orden_Pago']; ?>" accept=".pdf,.jpg,.jpeg,.png">
                      <button class="btn btn-primary btn-sm" type="submit">Enviar comprobante</button>
                    </form>
                  <?php endif; ?>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
      </div>
    <?php endif; ?>
  </div>
</div>

<?php include 'footer.php'; ?>

