<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: text/plain');
//header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

$docRoot = $_SERVER['DOCUMENT_ROOT'];

require $docRoot.'/core/db/epsMySqlDataBase.php';

$sql = file_get_contents('php://input');
if($sql==''){
    if (isset($_POST["sql"])){
        $sql = $_POST['sql'];
    }
    if($sql==''){
        $sql = $_GET["sql"];
    }
}
if($sql == ''){

	return false;
}
//echo $sql;
$sql = urldecode($sql);

$sql = str_replace("|*|", "%", $sql);
$sql = str_replace("||", "+", $sql);
$sql = str_replace("|@|", "&#", $sql);
$sql = str_replace("|**|", "&", $sql);
$sql = str_replace("|@*|", "#", $sql);
$sql = str_replace("'NULL'", "NULL", $sql);
$sql = str_replace("undefined", "", $sql);

$sql = str_replace("%20", " ", $sql);
$sql = str_replace("%2C", ",", $sql);
$sql = str_replace("%3D", "=", $sql);
$sql = str_replace("%40", "@", $sql);
$sql = str_replace("%2F", "/", $sql);

$sql = str_replace("sql=", "", $sql);


$sql = str_replace("%C3%A1", "á", $sql);
$sql = str_replace("%C3%A9", "é", $sql);
$sql = str_replace("%C3%AD", "í", $sql);
$sql = str_replace("%C3%B3", "ó", $sql);
$sql = str_replace("%C3%BA", "ú", $sql);
$sql = str_replace("%C3%B1", "ñ", $sql);
$sql = str_replace("%25", "%", $sql);
$sql = str_replace("%7C*%7C", "%", $sql);
$sql = str_replace("%C3%93", "Ó", $sql);

$sql = str_replace("---", "%", $sql);



$showtime = "";
if (isset($_POST["showtime"])){
	$showtime = $_POST["showtime"];
}elseif(isset($_GET["showtime"])){
	$showtime = $_GET["showtime"];
}
$dateFormat = "";
if (isset($_POST["dateFormat"])){
	$dateFormat = $_POST["dateFormat"];
}
elseif(isset($_GET["dateFormat"])){
	$dateFormat = $_GET["dateFormat"];
}

//echo $sql."<br><br>";
$EpsDataBase = epsMySqlDatabase::GetInstance();
if($dateFormat != ""){
	$EpsDataBase->dateFormat = $dateFormat;
}
//$sql = "SET time_zone = '-6:00'; ".$sql;
$sql = str_replace("\\", "", $sql);


//echo $sql;
//return false;
$EpsDataBase->Execute($sql);
if ($EpsDataBase->success === "true"){
	if ($showtime){
		$EpsDataBase->showDateTime = true;
	}
	$data = $EpsDataBase->getJsonData();
	$data = preg_replace("/\n/i", '', $data);
	$data = preg_replace("([^A-Za-z0-9!@#$%^&*,./?:;{}[]])", '', $data);
	//echo utf8_encode($data);
	
	echo $data;
}else{
	echo '{"success": false,"error":"'.$EpsDataBase->error.'","sql":"'.$sql.'"}';
}
//echo '<pre>';
//print_r($EpsDataBase);

$EpsDataBase->closeConextion();
?>