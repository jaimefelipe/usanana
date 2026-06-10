<?php
function adm_carta_latin($value) {
    $value = trim((string)($value ?? ''));
    $converted = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $value);
    return $converted !== false ? $converted : utf8_decode($value);
}

function adm_carta_fecha_larga($date = null) {
    $ts = $date ? strtotime($date) : time();
    $meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return date('d', $ts) . ' de ' . $meses[(int)date('n', $ts) - 1] . ' de ' . date('Y', $ts);
}

function adm_carta_codigo_validacion($solicitud) {
    $base = ($solicitud['Codigo'] ?? '') . '|' . ($solicitud['Portal_Token'] ?? '') . '|' . ($solicitud['Identificacion'] ?? '');
    $hash = strtoupper(hash('sha256', $base));
    return substr($hash, 0, 4) . '-' . substr($hash, 4, 4) . '-' . substr($hash, 8, 4) . '-' . substr($hash, 12, 4);
}

function adm_carta_estado_texto($solicitud) {
    if (($solicitud['Estado'] ?? '') === 'admitida_condicionada' || ($solicitud['Resultado_Admision'] ?? '') === 'condicionada') {
        return 'admisión condicionada';
    }
    return 'admisión aprobada';
}

function adm_carta_fpdf_path() {
    $candidates = [
        __DIR__ . '/../backoffice/core/php/fpdf/fpdf.php',
        __DIR__ . '/backoffice/core/php/fpdf/fpdf.php',
        dirname(__DIR__) . '/backoffice/core/php/fpdf/fpdf.php',
        ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/backoffice/core/php/fpdf/fpdf.php',
        __DIR__ . '/core/php/fpdf/fpdf.php'
    ];
    foreach ($candidates as $path) {
        if ($path && file_exists($path)) {
            return $path;
        }
    }
    return '';
}


function adm_carta_pago_lineas($solicitud) {
    $lineas = adm_carta_opciones_pago_lineas($solicitud);
    $ordenes = $solicitud['OrdenesPago'] ?? [];
    if (is_array($ordenes) && !empty($ordenes)) {
        $orden = $ordenes[0];
        $lineas[] = 'Orden generada: ' . trim((string)($orden['Referencia'] ?? ''));
        $lineas[] = 'Plan seleccionado: ' . trim((string)($orden['Plan_Pago'] ?? 'Pendiente de definir'));
        $lineas[] = 'Concepto: ' . trim((string)($orden['Concepto'] ?? 'Admision y matricula inicial'));
        $lineas[] = 'Monto total de la orden: ' . trim((string)($orden['Moneda'] ?? 'CRC')) . ' ' . number_format((float)($orden['Total'] ?? 0), 2);
        if (!empty($orden['Fecha_Limite'])) {
            $lineas[] = 'Fecha limite: ' . trim((string)$orden['Fecha_Limite']);
        }
        $lineas[] = 'Medio de pago: transferencia, deposito o medio institucional disponible.';
    }
    $ordenPagoInfo = !empty($ordenes[0]['Pago_Info_JSON']) ? $ordenes[0]['Pago_Info_JSON'] : '';
    $pagoInfo = json_decode((string)$ordenPagoInfo, true);
    if (!is_array($pagoInfo) || empty($pagoInfo)) {
        $pagoInfo = json_decode((string)($solicitud['Pago_Info_JSON'] ?? ''), true);
    }
    if ((!is_array($pagoInfo) || empty($pagoInfo)) && !empty($solicitud['ConfigFinanciera']) && is_array($solicitud['ConfigFinanciera'])) {
        $config = $solicitud['ConfigFinanciera'];
        $pagoInfo = [
            'medio_pago_texto' => (string)($config['Medio_Pago_Texto'] ?? ''),
            'notificar_email' => (string)($config['Notificar_Email'] ?? ''),
            'bancos' => json_decode((string)($config['Bancos_JSON'] ?? '[]'), true)
        ];
    }
    if (is_array($pagoInfo) && !empty($pagoInfo)) {
        if (!empty($pagoInfo['medio_pago_texto'])) {
            $lineas[] = 'Instrucciones de pago: ' . trim((string)$pagoInfo['medio_pago_texto']);
        }
        if (!empty($pagoInfo['notificar_email'])) {
            $lineas[] = 'Notificar pago a: ' . trim((string)$pagoInfo['notificar_email']);
        }
        if (!empty($pagoInfo['bancos']) && is_array($pagoInfo['bancos'])) {
            foreach ($pagoInfo['bancos'] as $banco) {
                if (!is_array($banco)) {
                    continue;
                }
                $partes = [];
                if (!empty($banco['banco'])) { $partes[] = trim((string)$banco['banco']); }
                if (!empty($banco['cuenta'])) { $partes[] = 'Cuenta ' . trim((string)$banco['cuenta']); }
                if (!empty($banco['iban'])) { $partes[] = 'IBAN ' . trim((string)$banco['iban']); }
                if (!empty($banco['moneda'])) { $partes[] = trim((string)$banco['moneda']); }
                if (!empty($partes)) {
                    $lineas[] = 'Cuenta bancaria: ' . implode(' | ', $partes);
                }
            }
        }
    }
    $lineas[] = 'Comprobante: debe cargarse en el portal de seguimiento para revision financiera.';
    $lineas[] = 'Portal de pago y comprobante: https://usantana.com/admisiones_seguimiento.php?token=' . rawurlencode((string)($solicitud['Portal_Token'] ?? ''));
    return array_filter($lineas, function($linea) { return trim($linea) !== ''; });
}

function adm_carta_base_financiera($solicitud) {
    $config = $solicitud['ConfigFinanciera'] ?? [];
    if (is_array($config) && !empty($config)) {
        $matricula = (float)($config['Matricula_Bloque'] ?? 0);
        $cursos = max(1, (int)($config['Cursos_Por_Bloque'] ?? 4));
        $creditos = max(0, (float)($config['Creditos_Por_Curso'] ?? 3));
        $precioCredito = max(0, (float)($config['Precio_Credito'] ?? 0));
        $precioCurso = max(0, (float)($config['Precio_Curso'] ?? 0));
        $subtotalCursos = $precioCurso > 0 ? $precioCurso * $cursos : $precioCredito * $creditos * $cursos;
        return [
            'moneda' => (string)($config['Moneda'] ?? 'CRC'),
            'matricula' => $matricula,
            'cursos' => $cursos,
            'creditos' => $creditos,
            'precio_credito' => $precioCredito,
            'precio_curso' => $precioCurso,
            'subtotal_cursos' => $subtotalCursos,
            'base' => $matricula + $subtotalCursos
        ];
    }
    return [
        'moneda' => (string)($solicitud['Moneda'] ?? 'CRC'),
        'matricula' => 0,
        'cursos' => 0,
        'creditos' => 0,
        'precio_credito' => 0,
        'precio_curso' => 0,
        'subtotal_cursos' => 0,
        'base' => (float)($solicitud['Monto_Base_Estimado'] ?? 0)
    ];
}

function adm_carta_opciones_pago_lineas($solicitud) {
    $planes = $solicitud['PlanesPago'] ?? [];
    $fin = adm_carta_base_financiera($solicitud);
    $lineas = [];
    if ($fin['base'] <= 0) {
        return $lineas;
    }
    $lineas[] = 'Resumen de costo inicial: matricula ' . $fin['moneda'] . ' ' . number_format($fin['matricula'], 2) . ', cursos/bloque ' . $fin['cursos'] . ', base estimada ' . $fin['moneda'] . ' ' . number_format($fin['base'], 2) . '.';
    if (!is_array($planes) || empty($planes)) {
        $lineas[] = 'Plan de pago estimado: total ' . $fin['moneda'] . ' ' . number_format((float)($solicitud['Total_Estimado'] ?? $fin['base']), 2) . '.';
        return $lineas;
    }
    $lineas[] = 'Opciones de pago disponibles:';
    foreach ($planes as $plan) {
        if (!is_array($plan)) {
            continue;
        }
        $descuentoPct = (float)($plan['Descuento_Porcentaje'] ?? 0);
        $interesPct = (float)($plan['Interes_Porcentaje'] ?? 0);
        $descuento = $fin['base'] * ($descuentoPct / 100);
        $interes = max(0, $fin['base'] - $descuento) * ($interesPct / 100);
        $total = max(0, $fin['base'] - $descuento + $interes);
        $cuotas = max(1, (int)($plan['Numero_Cuotas'] ?? 1));
        $cuota = $total / $cuotas;
        $detalle = trim((string)($plan['Nombre'] ?? $plan['Codigo'] ?? 'Plan'));
        $detalle .= ': total ' . $fin['moneda'] . ' ' . number_format($total, 2);
        if ($descuentoPct > 0) {
            $detalle .= ' con ' . number_format($descuentoPct, 2) . '% de descuento';
        }
        if ($interesPct > 0) {
            $detalle .= ' e interes ' . number_format($interesPct, 2) . '%';
        }
        $detalle .= ', ' . $cuotas . ' cuota(s) de ' . $fin['moneda'] . ' ' . number_format($cuota, 2);
        $lineas[] = $detalle . '.';
    }
    return $lineas;
}

function adm_carta_pago_texto($solicitud) {
    $lineas = adm_carta_pago_lineas($solicitud);
    return empty($lineas) ? '' : implode(' | ', $lineas);
}
function adm_carta_datos($solicitud) {
    $codigo = (string)($solicitud['Codigo'] ?? '');
    $validacion = adm_carta_codigo_validacion($solicitud);
    $nombre = (string)($solicitud['Nombre'] ?? '');
    $identificacion = (string)($solicitud['Identificacion'] ?? '');
    $carrera = (string)($solicitud['Carrera'] ?? '');
    $modalidad = (string)($solicitud['Modalidad'] ?? '');
    $estadoTexto = adm_carta_estado_texto($solicitud);
    $fecha = adm_carta_fecha_larga();
    $seguimiento = 'https://usantana.com/admisiones_seguimiento.php?token=' . rawurlencode((string)($solicitud['Portal_Token'] ?? ''));
    $condiciones = trim((string)($solicitud['Condiciones_Admision'] ?? ''));

    return [
        'codigo' => $codigo,
        'validacion' => $validacion,
        'nombre' => $nombre,
        'identificacion' => $identificacion,
        'carrera' => $carrera,
        'modalidad' => $modalidad,
        'estado' => $estadoTexto,
        'fecha' => $fecha,
        'seguimiento' => $seguimiento,
        'condiciones' => $condiciones,
        'asunto' => 'Carta oficial de admisión - Solicitud ' . $codigo,
        'intro' => 'Por medio de la presente, el Departamento de Admisiones de la Universidad Santa Ana San José comunica formalmente que, luego de revisar la solicitud de ingreso y la documentación presentada, se ha resuelto otorgarle ' . $estadoTexto . ' para ingresar al programa académico indicado en esta carta.',
        'parrafo2' => 'Esta comunicación constituye la notificación institucional de admisión para el proceso de primer ingreso. Para completar su incorporación académica, deberá continuar con los pasos de matrícula, pago y activación indicados en el portal de seguimiento.',
        'pago_lineas' => adm_carta_pago_lineas($solicitud),
        'pago_texto' => adm_carta_pago_texto($solicitud),
        'pasos' => 'Ingrese al portal de seguimiento, revise la orden de pago generada, realice el pago correspondiente y cargue el comprobante si aplica. Una vez validado el pago, el sistema continuará con la activación académica y el envío de sus datos de acceso.',
        'verificacion' => 'Este documento fue generado electrónicamente por el sistema de admisiones. No requiere firma manuscrita. Su autenticidad puede verificarse con el número de solicitud y el código de validación indicados en esta carta.'
    ];
}

function adm_carta_wrap($text, $max = 94) {
    $text = preg_replace('/\s+/', ' ', trim((string)$text));
    if ($text === '') return [];
    return explode("\n", wordwrap($text, $max, "\n", false));
}

function adm_carta_pdf_escape($text) {
    $text = adm_carta_latin($text);
    return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
}

function adm_carta_basic_pdf($solicitud) {
    $d = adm_carta_datos($solicitud);
    $commands = [];
    $y = 760;

    $addText = function($text, $x, $size = 10, $font = 'F1') use (&$commands, &$y) {
        $commands[] = 'BT /' . $font . ' ' . $size . ' Tf ' . $x . ' ' . $y . ' Td (' . adm_carta_pdf_escape($text) . ') Tj ET';
        $y -= ($size + 5);
    };
    $addLines = function($text, $x = 58, $size = 10, $max = 92) use (&$commands, &$y) {
        foreach (adm_carta_wrap($text, $max) as $line) {
            $commands[] = 'BT /F1 ' . $size . ' Tf ' . $x . ' ' . $y . ' Td (' . adm_carta_pdf_escape($line) . ') Tj ET';
            $y -= ($size + 5);
        }
    };
    $line = function($x1, $y1, $x2, $y2) use (&$commands) {
        $commands[] = '0.02 w ' . $x1 . ' ' . $y1 . ' m ' . $x2 . ' ' . $y2 . ' l S';
    };

    $commands[] = '0 0.43 0.38 rg 36 742 540 18 re f';
    $y = 747;
    $commands[] = 'BT /F2 12 Tf 250 747 Td (' . adm_carta_pdf_escape('USASJ') . ') Tj ET';
    $y = 718;
    $addText('Universidad Santa Ana San José', 58, 15, 'F2');
    $addText('Departamento de Admisiones', 58, 9, 'F1');
    $y -= 18;
    $addText('San José, ' . $d['fecha'], 390, 10, 'F1');
    $y -= 20;
    $addText($d['asunto'], 58, 10, 'F2');
    $y -= 18;
    $addText('Estimado(a) ' . $d['nombre'] . ':', 58, 10, 'F1');
    $y -= 6;
    $addLines($d['intro']);
    $y -= 6;
    $addLines($d['parrafo2']);
    $y -= 12;

    $addText('Datos de admisión', 58, 11, 'F2');
    $line(58, $y + 7, 555, $y + 7);
    $y -= 6;
    $addText('Solicitud: ' . $d['codigo'], 70, 10, 'F1');
    $addText('Código de validación: ' . $d['validacion'], 70, 10, 'F1');
    $addText('Estudiante: ' . $d['nombre'], 70, 10, 'F1');
    $addText('Identificación: ' . $d['identificacion'], 70, 10, 'F1');
    $addLines('Programa aprobado: ' . $d['carrera'], 70, 10, 80);
    if ($d['modalidad'] !== '') {
        $addText('Modalidad: ' . $d['modalidad'], 70, 10, 'F1');
    }
    $addText('Estado: ' . ucfirst($d['estado']), 70, 10, 'F1');
    $y -= 8;

    if ($d['condiciones'] !== '') {
        $addText('Condiciones u observaciones', 58, 11, 'F2');
        $addLines($d['condiciones']);
        $y -= 8;
    }

    if (!empty($d['pago_lineas'])) {
        $addText('Información de pago', 58, 11, 'F2');
        foreach ($d['pago_lineas'] as $pagoLinea) {
            $addLines($pagoLinea, 70, 10, 85);
        }
        $y -= 8;
    }

    $addText('Siguientes pasos', 58, 11, 'F2');
    $addLines($d['pasos']);
    $y -= 8;
    $addText('Verificación del documento', 58, 11, 'F2');
    $addLines($d['verificacion'], 58, 9, 100);
    $y -= 4;
    $addLines('Portal de seguimiento: ' . $d['seguimiento'], 58, 8, 105);

    $commands[] = '0.7 0.7 0.7 RG 58 48 m 555 48 l S';
    $commands[] = 'BT /F1 8 Tf 92 34 Td (' . adm_carta_pdf_escape('Documento generado por el Sistema Académico USASJ | Solicitud ' . $d['codigo'] . ' | Validación ' . $d['validacion']) . ') Tj ET';

    $content = implode("\n", $commands) . "\n";
    $objects = [];
    $objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
    $objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    $objects[] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>';
    $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
    $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
    $objects[] = "<< /Length " . strlen($content) . " >>\nstream\n" . $content . "endstream";

    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    foreach ($objects as $i => $obj) {
        $offsets[] = strlen($pdf);
        $pdf .= ($i + 1) . " 0 obj\n" . $obj . "\nendobj\n";
    }
    $xref = strlen($pdf);
    $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
    $pdf .= "0000000000 65535 f \n";
    for ($i = 1; $i <= count($objects); $i++) {
        $pdf .= sprintf('%010d 00000 n ', $offsets[$i]) . "\n";
    }
    $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";
    return $pdf;
}

function adm_carta_pdf_bytes($solicitud, $dest = 'S') {
    $fpdf = adm_carta_fpdf_path();
    if ($fpdf !== '') {
        require_once($fpdf);
        $d = adm_carta_datos($solicitud);
        $pdf = new FPDF('P', 'mm', 'Letter');
        $pdf->SetMargins(20, 16, 20);
        $pdf->AddPage();
        $pdf->SetFillColor(0, 110, 100);
        $pdf->Rect(20, 10, 176, 8, 'F');
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 8, adm_carta_latin('USASJ'), 0, 1, 'C');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(8);
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->Cell(0, 8, adm_carta_latin('Universidad Santa Ana San José'), 0, 1, 'L');
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, adm_carta_latin('Departamento de Admisiones'), 0, 1, 'L');
        $pdf->Ln(10);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 6, adm_carta_latin('San José, ' . $d['fecha']), 0, 1, 'R');
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->MultiCell(0, 6, adm_carta_latin($d['asunto']));
        $pdf->Ln(8);
        $pdf->SetFont('Arial', '', 10);
        $pdf->MultiCell(0, 6, adm_carta_latin('Estimado(a) ' . $d['nombre'] . ':'));
        $pdf->Ln(3);
        $pdf->MultiCell(0, 6, adm_carta_latin($d['intro']));
        $pdf->Ln(3);
        $pdf->MultiCell(0, 6, adm_carta_latin($d['parrafo2']));
        $pdf->Ln(7);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(0, 6, adm_carta_latin('Datos de admisión'), 0, 1);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(48, 6, adm_carta_latin('Solicitud:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin($d['codigo']), 0, 1);
        $pdf->Cell(48, 6, adm_carta_latin('Validación:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin($d['validacion']), 0, 1);
        $pdf->Cell(48, 6, adm_carta_latin('Estudiante:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin($d['nombre']), 0, 1);
        $pdf->Cell(48, 6, adm_carta_latin('Identificación:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin($d['identificacion']), 0, 1);
        $pdf->Cell(48, 6, adm_carta_latin('Programa aprobado:'), 0, 0); $pdf->MultiCell(0, 6, adm_carta_latin($d['carrera']));
        if ($d['modalidad'] !== '') { $pdf->Cell(48, 6, adm_carta_latin('Modalidad:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin($d['modalidad']), 0, 1); }
        $pdf->Cell(48, 6, adm_carta_latin('Estado:'), 0, 0); $pdf->Cell(0, 6, adm_carta_latin(ucfirst($d['estado'])), 0, 1);
        $pdf->Ln(5);
        if ($d['condiciones'] !== '') { $pdf->SetFont('Arial', 'B', 10); $pdf->Cell(0, 6, adm_carta_latin('Condiciones u observaciones'), 0, 1); $pdf->SetFont('Arial', '', 10); $pdf->MultiCell(0, 6, adm_carta_latin($d['condiciones'])); $pdf->Ln(4); }
        if (!empty($d['pago_lineas'])) {
            $pdf->SetFont('Arial', 'B', 10); $pdf->Cell(0, 6, adm_carta_latin('Información de pago'), 0, 1);
            $pdf->SetFont('Arial', '', 10);
            foreach ($d['pago_lineas'] as $pagoLinea) { $pdf->MultiCell(0, 6, adm_carta_latin('- ' . $pagoLinea)); }
            $pdf->Ln(3);
        }
        $pdf->SetFont('Arial', 'B', 10); $pdf->Cell(0, 6, adm_carta_latin('Siguientes pasos'), 0, 1);
        $pdf->SetFont('Arial', '', 10); $pdf->MultiCell(0, 6, adm_carta_latin($d['pasos']));
        $pdf->Ln(4);
        $pdf->SetFont('Arial', 'B', 10); $pdf->Cell(0, 6, adm_carta_latin('Verificación del documento'), 0, 1);
        $pdf->SetFont('Arial', '', 9); $pdf->MultiCell(0, 5, adm_carta_latin($d['verificacion']));
        $pdf->Ln(2); $pdf->SetTextColor(0, 80, 140); $pdf->MultiCell(0, 5, adm_carta_latin($d['seguimiento'])); $pdf->SetTextColor(0, 0, 0);
        $pdf->SetY(-22); $pdf->SetFont('Arial', '', 8); $pdf->Cell(0, 5, adm_carta_latin('Solicitud ' . $d['codigo'] . ' | Validación ' . $d['validacion']), 0, 1, 'C');
        return $pdf->Output('carta-admision-' . preg_replace('/[^A-Za-z0-9_-]/', '', $d['codigo']) . '.pdf', $dest);
    }
    return adm_carta_basic_pdf($solicitud);
}

