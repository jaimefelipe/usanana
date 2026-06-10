<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Headers: *');
header('Content-Type: text/plain');
//header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

$docRoot = $_SERVER['DOCUMENT_ROOT'];
require $docRoot.'/core/db/epsMySqlDataBase.php';


$sql = file_get_contents('php://input');
//echo $sql;
if($sql==''){
    if (isset($_POST["sql"])){
        $sql = $_POST['sql'];
    }
    if($sql==''){
        $sql = $_GET["sql"];
    }
}

$Id_Empresa = urldecode($sql);


function obtenerHijos($EpsDataBase,$Id_Empresa,$Padre) {
    $sql = 'Select Id_Cuenta_Contable,Cuenta,Balance,Descripcion,Deudora,Estado From Cge_Cuenta_Contable where Id_Empresa ='.$Id_Empresa.' and Padre = '.$Padre.' Order by Cuenta';
    $EpsDataBase->Execute($sql);
	$data = $EpsDataBase->getJsonData();
	$data = $EpsDataBase->getData();
	$keys = $EpsDataBase->getKeys();
    $retorno = '{';
    
    for ($i=0;$i < count($data);$i++){
        
        if ($i>0){
            $retorno = $retorno."},{";
        }
        $retorno = $retorno.'"Id_Cuenta_Contable":"'.$data[$i]['Id_Cuenta_Contable'].'",';
        $retorno = $retorno.'"Cuenta":"'.$data[$i]['Cuenta'].'",';
        $retorno = $retorno.'"Balance":"'.$data[$i]['Balance'].'",';
        $retorno = $retorno.'"Descripcion":"'.$data[$i]['Descripcion'].'",';
        $retorno = $retorno.'"Deudora":"'.$data[$i]['Deudora'].'",';
        $retorno = $retorno.'"Estado":"'.$data[$i]['Estado'].'",';
        $retorno = $retorno.'"Hijos":['.obtenerHijos($EpsDataBase,$Id_Empresa,$data[$i]['Cuenta']).']';
        //$retorno =  $retorno.'"'.$keys[$i].'":"'.$data[$i][$keys[$i]].'"';
       
    }  
    $retorno = $retorno.'}';  
    return $retorno;
}


$EpsDataBase = epsMySqlDatabase::GetInstance();

$a = obtenerHijos($EpsDataBase,$Id_Empresa,"''");

echo '{"success": "true","data":['.$a.'],"Total":"1"}';
$EpsDataBase->closeConextion();
?>