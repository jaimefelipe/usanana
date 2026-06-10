<?php
date_default_timezone_set('America/Costa_Rica');
class epsMySqlDatabase {
	private $DataBaseServer;
	private $DataBaseUser;
	private $DataBasePassword;
	private $DataBaseName;
	private $conexion;
	private $pagin = false;
	private $index;
	private $table;
	public $TotalRows = 0;
	private $recordSet;
	private $data;
	private $start;
	static $_instance;
	private $where = '';
	public $success = "true";
	public $error;
	public $errno;
	public $showDateTime = false;
	public $json;
	public $keys;
	public $dateFormat = "m/d/Y h:i:s";
	public $sql;
	public $last_id = '';
	private function __construct(){		
		$this->SetConexion();
		$this->Conect();		
	}

	public static function GetInstance(){
		if (!(self::$_instance instanceof self)){
	   	self::$_instance=new self();
		}
		return self::$_instance;
	}
	private function SetConexion(){
		//$this->DataBaseServer="jaimebrenes.com";
		$this->DataBaseServer="localhost:3306";
		$this->DataBaseUser="toxoqfbh_jbrenes";
		$this->DataBasePassword="Nonpass!8Nonpass!8";
		$this->DataBaseName="toxoqfbh_eps_Ibo";
	}
	private function Conect(){		
		$this->conexion = mysqli_connect($this->DataBaseServer,$this->DataBaseUser,$this->DataBasePassword,$this->DataBaseName);
		
		if(!$this->conexion){
			$this->success = "false";
			$this->error = "Error Selecting Data Base | ".mysqli_connect_error();
		}

		mysqli_autocommit($this->conexion, TRUE);
	}
	public function setStart($start){
		$this->start = $start;
	}
	public function getKeys(){
		return $this->keys;
	}
	public function roolRack(){
		odbc_rollback($this->conexion);
	}
	public function commit(){
		odbc_commit($this->conexion);
	}
	public function setPagin($pagin){
		$this->pagin = $pagin;
	}
	public function setIndex($index){
		$this->index = $index;
	}
	public function setTable($table){
		$this->table = $table;
	}
	public function setWhere($where){
		$this->where = $where;
	}
	public function getData(){
		return $this->data;
	}
	public function Execute($sql){	
		$this->data = array();
		//echo $sql;	
		$this->last_id = '';
		$this->error = '';
		$this->success = 'true';
		$this->sql = $sql;
		$this->recordSet = $this->conexion->query("SET NAMES 'utf8'");
		$this->recordSet = $this->conexion->query("SET time_zone = '-6:00'");
		$this->recordSet = $this->conexion->query($sql);	
		if ($this->conexion->errno !=0) {
			$this->errno = $this->conexion->errno;
			$this->success = "false";
			$this->error = $this->conexion->error;
			$this->error = str_replace("'","", $this->error);
			if($this->error ==""){
				$this->error = 'Error no espcificado';
				$this->conexion->rollback();				
			}			
		}else{	
			//echo '<pre>';
			//print_r($this->conexion);
			//echo '</pre>';
			if( $this->conexion->field_count>0){
				$this->last_id = $this->conexion->insert_id;
				$this->setData();
			} 
			if($this->conexion->insert_id>0){
				$this->last_id = $this->conexion->insert_id;
			}
		}
		$this->closeConextion();
		$this->Conect();
	}
	public function setData(){		
		
		if ($this->pagin == true){
			$this->data = array();
			$i=0;
			$j=0;
			while( $row = $this->recordSet->fetch_array() ) {
				foreach ($row as $k => $v) {
					$row[$k] = $this->sanitizeTexto($v);
				}						
				$this->data[$i] = $row;
				$this->data[$i] = str_replace('"', '&quot;', $this->data[$i]);
				
				$this->data[$i]["rowid"] = $i;
				$i++;			
			}
			//$this->TotalRows = $this->getTotals();
		}else{
			$this->data = array();
			$i=0;
			$j=0;		
			while( $row = $this->recordSet->fetch_array(MYSQLI_ASSOC) ) {
				//preguntar si start entonces ir de start + 100
				if($this->start == ""){		
					foreach ($row as $k => $v) {
						$row[$k] = $this->sanitizeTexto($v);
					}		
					$this->data[$i] = $row;
					$this->data[$i] = str_replace('"', '&quot;', $this->data[$i]);
					$this->data[$j]["rowid"] = $j;
				}else{
					//echo "start =".$this->start."<br>";
					if ($i >= $this->start){
						if ($j < 100){
							foreach ($row as $k => $v) {
								$row[$k] = $this->sanitizeTexto($v);
							}
							$this->data[$j] = $row;	
							$this->data[$j] = str_replace('"', '&quot;', $this->data[$j]);					
							$this->data[$j]["rowid"] = $j;
						}
						$j++;
					}
				}			
				$i++;			
			} 				
			$this->TotalRows = $i;
		}
	}
	public function getJsonData(){			
		$jsonArray = array();
		if(is_array($this->data)){
			if(count($this->data) == 0){
				if($this->last_id == 0){
					$this->TotalRows = 0;
				}else{
					$this->json = '{"Identity":"'.$this->last_id.'"}';
					$this->TotalRows = 1;
				}

			}else{
				foreach ($this->data as $rs) {
					$jsonData = array();
					$keys = array();
					$i = 0;
					foreach ($rs as $key => $value) {
						//$value = str_replace('"', '&quot;', $value);
						$value = $this->sanitizeTexto($value); // 🧼 Limpieza general
						$value = str_replace('"', '&quot;', $value); // Codifica comillas dobles
						if (strlen($value) == 23){					
							if(strtotime($value)){
								//jaime
								if ($this->showDateTime == true){
									$value = date($this->dateFormat,strtotime($value));
									$value = str_replace("\EST", 'T', $value);
									$value = str_replace("\EDT", 'T', $value);							
								}else{
									$value = date("d/m/Y",strtotime($value));
								}
							}
						}
						//$value = str_replace(",", "", $value);
						//$value = str_replace('"', '', $value);
						$keys[] = $key;
						//$jsonData[] = '"'.$key.'":"'.iconv('ISO-8859-1', 'UTF-8', $value).'"'; 
						$jsonData[] = '"'.$key.'":"'. $value.'"'; 
						
					}
					$jsonArray[] = "{".implode(",", $jsonData)."}";
				}
				$this->json = implode(",", $jsonArray);
				$this->keys = $keys;
			}
		}else{
			$this->json = '{"Identity":"'.$this->last_id.'"}';
			$this->TotalRows = 1;
		}
		
		if($this->TotalRows == 0){
			return '{"total":0,"data":[{"Error":"No results found for your query"}], "success": "true"}';
			//return "{total:0,data:'', success: true,'Error':'No results found for your query'}";
		}else{

			if($this->last_id == ''){
				return '{"total":'.$this->TotalRows.',"data":['.$this->json.'], "success": "true"}';
			}else{
				return '{"total":'.$this->TotalRows.',"data":['.$this->json.'], "success": "true","Identity":'.$this->last_id.'}';
			}	
			//return '{"total":'.$this->TotalRows.',"data":['.$this->json.'], "success": true, "sql":"'.$this->sql.'" }';
			
		}
	}
	public function getXmlDAta(){
		$xml = new SimpleXMLElement('<?xml version="1.0"?><root/>');
		array_walk_recursive($this->data, array ($xml, 'addChild'));
		return $xml->asXML();
	}	
	public function closeConextion(){
		$this->conexion->commit();		
		$this->conexion->close();		
	}
	private function sanitizeTexto($texto) {
		if (!mb_detect_encoding($texto, 'UTF-8', true)) {
			$texto = utf8_encode($texto);
		}
		// Reemplazar caracteres especiales problemáticos
		$texto = str_replace(['×', '–', '‘', '’', '“', '”'], ['x', '-', "'", "'", '"', '"'], $texto);
		// Eliminar cualquier carácter de control no imprimible (excepto salto de línea)
		return preg_replace('/[^\P{C}\n]+/u', '', $texto);
	}		
}
?>