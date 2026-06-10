<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: text/plain');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

$docRoot = $_SERVER['DOCUMENT_ROOT'];
require $docRoot.'/core/db/epsMySqlDataBase.php';

// 🔹 Obtener SQL desde diferentes fuentes
$sql = file_get_contents('php://input') ?: $_SERVER["QUERY_STRING"] ?: ($_POST["sql"] ?? ($_GET["sql"] ?? ''));

if (empty($sql)) {
    echo json_encode(["success" => false, "error" => "No se recibió ninguna consulta SQL"]);
    exit;
}

// 🔹 Decodificar y limpiar el SQL recibido
$sql = urldecode($sql);
echo $sql;
// 🔹 Establecer conexión con la base de datos
$EpsDataBase = epsMySqlDatabase::GetInstance();

// 🔹 Establecer formato de fecha si se recibe
if (!empty($_POST["dateFormat"]) || !empty($_GET["dateFormat"])) {
    $EpsDataBase->dateFormat = $_POST["dateFormat"] ?? $_GET["dateFormat"];
}
$sql = str_replace("sql=", "", $sql);
$sql = stripslashes($sql); // Elimina caracteres de escape innecesarios
// 🔹 Ejecutar consulta
$EpsDataBase->Execute($sql);

// 🔹 Validar resultado
if ($EpsDataBase->success === "true") {
    if (!empty($_POST["showtime"]) || !empty($_GET["showtime"])) {
        $EpsDataBase->showDateTime = true;
    }
	$data = $EpsDataBase->getJsonData();
	//$data = htmlspecialchars_decode($data, ENT_QUOTES);
    echo $data;
} else {
    error_log("Error en SQL: " . $EpsDataBase->error);
    echo json_encode([
        "success" => false,
        "error" => $EpsDataBase->error,
        "sql" => $sql
    ]);
}

// 🔹 Cerrar conexión
$EpsDataBase->closeConextion();
?>
