<?php
function adm_pago_table_exists($db, $table) {
    if (!$db) {
        return false;
    }
    $safe = str_replace("'", "''", $table);
    $db->Execute("SELECT COUNT(*) AS Total FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{$safe}'");
    $rows = $db->getData();
    return !empty($rows) && (int)($rows[0]['Total'] ?? 0) > 0;
}

function adm_pago_fetch_all($db, $sql) {
    if (!$db) {
        return [];
    }
    $db->Execute($sql);
    return $db->success === 'true' ? $db->getData() : [];
}

function adm_pago_fetch_config($db, $idCarrera, $nivel) {
    if (!adm_pago_table_exists($db, 'Edu_Admision_Config_Financiera')) {
        return null;
    }
    $idCarrera = (int)$idCarrera;
    $nivel = str_replace("'", "''", trim((string)$nivel));
    $sql = "SELECT * FROM Edu_Admision_Config_Financiera
            WHERE Id_Empresa = 1
              AND Activo = 1
              AND (Id_Carrera = {$idCarrera} OR (Id_Carrera IS NULL AND Nivel = '{$nivel}'))
            ORDER BY CASE WHEN Id_Carrera = {$idCarrera} THEN 0 ELSE 1 END, Id_Config_Financiera DESC
            LIMIT 1";
    $rows = adm_pago_fetch_all($db, $sql);
    return $rows[0] ?? null;
}

function adm_pago_decode_json($value) {
    $decoded = json_decode((string)($value ?? ''), true);
    return is_array($decoded) ? $decoded : [];
}

function adm_pago_fetch_planes($db) {
    return adm_pago_fetch_all($db, "SELECT Id_Admision_Plan_Pago,Codigo,Nombre,Tipo,Descuento_Porcentaje,Numero_Cuotas,Dias_Primer_Pago,Interes_Porcentaje,Config_JSON FROM Edu_Admision_Plan_Pago WHERE Id_Empresa=1 AND Activo=1 ORDER BY Id_Admision_Plan_Pago");
}

function adm_pago_find_plan($planes, $idPlan) {
    $idPlan = (int)$idPlan;
    foreach ($planes as $plan) {
        if ((int)($plan['Id_Admision_Plan_Pago'] ?? 0) === $idPlan) {
            return $plan;
        }
    }
    return $planes[0] ?? null;
}

function adm_pago_calcular($config, $plan) {
    $config = is_array($config) ? $config : [];
    $plan = is_array($plan) ? $plan : [];
    $moneda = trim((string)($config['Moneda'] ?? 'CRC'));
    $cursos = max(1, (int)($config['Cursos_Por_Bloque'] ?? 4));
    $creditosPorCurso = max(0, (float)($config['Creditos_Por_Curso'] ?? 3));
    $precioCredito = max(0, (float)($config['Precio_Credito'] ?? 0));
    $precioCurso = max(0, (float)($config['Precio_Curso'] ?? 0));
    $matricula = max(0, (float)($config['Matricula_Bloque'] ?? 0));
    $subtotalCursos = $precioCurso > 0 ? ($precioCurso * $cursos) : ($precioCredito * $creditosPorCurso * $cursos);
    $base = $matricula + $subtotalCursos;
    $descuentoPorcentaje = max(0, (float)($plan['Descuento_Porcentaje'] ?? 0));
    $interesPorcentaje = max(0, (float)($plan['Interes_Porcentaje'] ?? 0));
    $descuento = round($base * ($descuentoPorcentaje / 100), 2);
    $interes = round(($base - $descuento) * ($interesPorcentaje / 100), 2);
    $total = max(0, round($base - $descuento + $interes, 2));
    $cuotas = max(1, (int)($plan['Numero_Cuotas'] ?? 1));

    return [
        'moneda' => $moneda !== '' ? $moneda : 'CRC',
        'cursos_por_bloque' => $cursos,
        'creditos_por_curso' => $creditosPorCurso,
        'precio_credito' => $precioCredito,
        'precio_curso' => $precioCurso,
        'matricula_bloque' => $matricula,
        'subtotal_cursos' => round($subtotalCursos, 2),
        'monto_base' => round($base, 2),
        'descuento_porcentaje' => $descuentoPorcentaje,
        'descuento' => $descuento,
        'interes_porcentaje' => $interesPorcentaje,
        'interes' => $interes,
        'total' => $total,
        'numero_cuotas' => $cuotas,
        'cuota_monto' => round($total / $cuotas, 2),
        'dias_primer_pago' => max(1, (int)($plan['Dias_Primer_Pago'] ?? 8))
    ];
}

function adm_pago_info($config) {
    $config = is_array($config) ? $config : [];
    return [
        'medio_pago_texto' => trim((string)($config['Medio_Pago_Texto'] ?? 'Transferencia, deposito o medio institucional disponible.')),
        'notificar_email' => trim((string)($config['Notificar_Email'] ?? 'admisiones@usantana.com')),
        'bancos' => adm_pago_decode_json($config['Bancos_JSON'] ?? '')
    ];
}

