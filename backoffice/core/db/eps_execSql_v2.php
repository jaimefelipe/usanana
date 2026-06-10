<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");
ini_set('default_charset', 'UTF-8');


require_once 'epsMySqlDataBase_v2.php';

$sql = $_POST["sql"] ?? $_GET["sql"] ?? '';
if (empty($sql)) {
    $input = file_get_contents('php://input');
    if (strpos($input, 'sql=') === 0) {
        $sql = substr($input, 4);
    } else {
        $sql = $input;
    }
}

if (empty($sql)) {
    echo json_encode(["success" => false, "error" => "No se recibió ninguna instrucción SQL"]);
    return;
}

// Decodificamos si viene como urlencoded desde Angular


$sql = str_replace('%C', 'C%', $sql);
$sql = str_replace('%c', 'c%', $sql);
$sql = str_replace('%C', 'C%', $sql);

$sql = str_replace('%Fa', 'Fa%', $sql);
$sql = str_replace('%fa', 'fa%', $sql);
$sql = str_replace('%FA', 'FA%', $sql);

$sql = str_replace('%', '####', $sql);
$sql = urldecode($sql);

$sql = str_replace('####', '%', $sql);
$sql = str_replace('---', '%', $sql);
$sql = str_replace("`'`'", "''", $sql);


$sql = str_replace('C%', '%C', $sql);
$sql = str_replace('c%', '%c', $sql);
$sql = str_replace('C%', '%C', $sql);

$sql = str_replace('Fa%', '%Fa', $sql);
$sql = str_replace('fa%', '%fa', $sql);
$sql = str_replace('FA%', '%FA', $sql);

$sql = str_replace('%2B', '+', $sql);



// Si no está en UTF-8, convertirlo
if (!mb_check_encoding($sql, 'UTF-8')) {
    $sql = utf8_encode($sql); // Convierte desde Latin1 a UTF-8
}


// Parámetros opcionales
$showtime = $_POST["showtime"] ?? $_GET["showtime"] ?? '';
$dateFormat = $_POST["dateFormat"] ?? $_GET["dateFormat"] ?? '';

$EpsDataBase = epsMySqlDatabase::GetInstance();

if (!empty($dateFormat)) {
    $EpsDataBase->dateFormat = $dateFormat;
}

$EpsDataBase->Execute($sql);

if ($EpsDataBase->success === "true") {
    if ($showtime) {
        $EpsDataBase->showDateTime = true;
    }
    echo $EpsDataBase->getJsonData();
} else {
    echo json_encode([
        "success" => false,
        "error" => $EpsDataBase->error,
        "sql" => $sql
    ]);
}

$EpsDataBase->closeConextion();
?>
