<?php
date_default_timezone_set('America/Costa_Rica');

class epsMySqlDatabase {
    private $DataBaseServer;
    private $DataBaseUser;
    private $DataBasePassword;
    private $DataBaseName;
    private $conexion;
    public $success = "true";
    public $error;
    public $errno;
    public $showDateTime = false;
    public $json;
    public $keys;
    public $dateFormat = "m/d/Y h:i:s";
    public $sql;
    public $last_id = '';
    public $TotalRows = 0;
    private $recordSet;
    private $data;
    private $start;
    static $_instance;

    private function __construct() {
        $this->SetConexion();
        $this->Conect();
    }

    public static function GetInstance() {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function SetConexion() {
        $this->DataBaseServer = "localhost:3306";
        $this->DataBaseUser = "usanwoig_santana";
        $this->DataBasePassword = "Nonpass!8Nonpass!8";
        $this->DataBaseName = "usanwoig_santana";
    }

    private function Conect() {
        $this->conexion = mysqli_connect($this->DataBaseServer, $this->DataBaseUser, $this->DataBasePassword, $this->DataBaseName);
        if (!$this->conexion) {
            $this->success = "false";
            $this->error = "Error de conexión: " . mysqli_connect_error();
        }
        mysqli_set_charset($this->conexion, "utf8mb4");
        mysqli_autocommit($this->conexion, true);
    }

    public function Execute($sql) {
        $this->data = array();
        $this->last_id = '';
        $this->error = '';
        $this->success = 'true';
        $this->sql = $sql;

        $comandoSQL = strtoupper(trim(strtok($sql, " ")));
        $prohibidos = ['DROP', 'TRUNCATE', 'ALTER', 'RENAME', 'GRANT', 'REVOKE'];
        if (in_array($comandoSQL, $prohibidos)) {
            $this->success = "false";
            $this->error = "❌ Comando SQL no permitido: $comandoSQL";
            $this->writeLog("❌ Bloqueado comando prohibido: $comandoSQL | SQL: $sql");
            return;
        }

        if ($comandoSQL === 'DELETE' && stripos($sql, 'WHERE') === false) {
            $this->success = "false";
            $this->error = "❌ DELETE sin cláusula WHERE no permitido.";
            $this->writeLog("❌ DELETE sin WHERE bloqueado | SQL: $sql");
            return;
        }

        $this->conexion->query("SET time_zone = '-6:00'");

        $start = microtime(true);
        $this->recordSet = $this->conexion->query($sql);
        $end = microtime(true);
        $elapsed = round(($end - $start) * 1000, 2);

        if ($elapsed > 1000) {
            $this->writeLog("Consulta lenta ({$elapsed}ms): {$sql}");
        }

        if ($this->conexion->errno != 0) {
            $this->errno = $this->conexion->errno;
            $this->success = "false";
            $this->error = str_replace("'", "", $this->conexion->error);
            $this->conexion->rollback();
            $this->writeLog("ERROR {$this->errno}: {$this->error} | SQL: {$sql}");
        } else {
            if ($this->conexion->field_count > 0) {
                $this->last_id = $this->conexion->insert_id;
                $this->setData();
            } elseif ($this->conexion->insert_id > 0) {
                $this->last_id = $this->conexion->insert_id;
            }
        }
    }

    private function writeLog($mensaje) {
        $logFile = __DIR__ . '/query_log_v2.txt';
        $timestamp = date("Y-m-d H:i:s");
        $contenido = "[$timestamp] $mensaje\n";
        file_put_contents($logFile, $contenido, FILE_APPEND);
    }

    private function setData() {
        $this->data = array();
        $i = 0;
        $j = 0;
        while ($row = $this->recordSet->fetch_array(MYSQLI_ASSOC)) {
            if ($this->start == "") {
                $this->data[$i] = str_replace('"', '&quot;', $row);
                $this->data[$i]["rowid"] = $i;
            } else {
                if ($i >= $this->start && $j < 100) {
                    $this->data[$j] = str_replace('"', '&quot;', $row);
                    $this->data[$j]["rowid"] = $j;
                    $j++;
                }
            }
            $i++;
        }
        $this->TotalRows = $i;
    }

    public function getJsonData() {
        $jsonArray = [];
        if (is_array($this->data)) {
            foreach ($this->data as $rs) {
                $jsonData = [];
                foreach ($rs as $key => $value) {
                    $value = $this->sanitizeTexto($value); // ✅ Aplicar limpieza
                    if (strlen($value) == 23 && strtotime($value)) {
                        $value = $this->showDateTime
                            ? date($this->dateFormat, strtotime($value))
                            : date("d/m/Y", strtotime($value));
                    }
                    $jsonData[] = '"' . $key . '":"' . str_replace('"', '&quot;', $value) . '"';
                }
                $jsonArray[] = '{' . implode(",", $jsonData) . '}';
            }
            $this->json = implode(",", $jsonArray);
        }
    
        $response = '{"total":' . $this->TotalRows . ',"data":[' . ($this->json ?? '') . '],"success":"true"';
        if ($this->last_id !== '') {
            $response .= ',"Identity":' . $this->last_id;
        }
        return $response . '}';
    }

    public function closeConextion() {
        if ($this->conexion) {
            $this->conexion->commit();
            $this->conexion->close();
        }
    }

    private function sanitizeTexto($texto) {
        if (!mb_detect_encoding($texto, 'UTF-8', true)) {
            $texto = utf8_encode($texto);
        }
        // Reemplazar caracteres raros visibles
        $texto = str_replace(['×', '–', '‘', '’', '“', '”'], ['x', '-', "'", "'", '"', '"'], $texto);
    
        // Reemplazar saltos de línea, retorno de carro y tabulaciones por espacio
        $texto = str_replace(["\r", "\n", "\t"], ' ', $texto);
    
        // Opcional: eliminar caracteres invisibles de control
        return preg_replace('/[^\P{C}\n]+/u', '', $texto);
    }
    public function getData(){
		return $this->data;
	}
}
?>
