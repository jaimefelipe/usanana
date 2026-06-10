<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$response = [
    'success' => false,
    'message' => 'Error desconocido',
    'url' => ''
];

try {
    if (empty($_FILES['archivo'])) {
        throw new Exception('No se recibio ningun archivo.');
    }

    $id_empresa = $_GET['id'] ?? $_POST['Id_Empresa'] ?? null;
    if (!$id_empresa || !preg_match('/^\d+$/', (string) $id_empresa)) {
        throw new Exception('Falta el ID de la empresa.');
    }

    $file = $_FILES['archivo'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new Exception('Error al recibir el archivo.');
    }

    $original_name = basename($file['name']);
    $file_tmp = $file['tmp_name'];
    $file_size = $file['size'];

    $max_size = 25 * 1024 * 1024;
    if ($file_size > $max_size) {
        throw new Exception('El archivo excede el tamano maximo permitido (25MB).');
    }

    $extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
    $allowed_types_by_extension = [
        'pdf'  => ['application/pdf'],
        'doc'  => ['application/msword'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'xls'  => ['application/vnd.ms-excel'],
        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        'ppt'  => ['application/vnd.ms-powerpoint'],
        'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        'jpg'  => ['image/jpeg', 'image/pjpeg'],
        'jpeg' => ['image/jpeg', 'image/pjpeg'],
        'png'  => ['image/png'],
        'gif'  => ['image/gif'],
        'webp' => ['image/webp']
    ];

    if (!isset($allowed_types_by_extension[$extension])) {
        throw new Exception('Tipo de archivo no permitido. Se aceptan imagenes JPG, PNG, WEBP, GIF y documentos PDF, Word, Excel o PowerPoint.');
    }

    $file_type = mime_content_type($file_tmp);
    $image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (in_array($extension, $image_extensions, true)) {
        $image_info = @getimagesize($file_tmp);
        $detected_type = $image_info['mime'] ?? $file_type;

        if (!in_array($detected_type, $allowed_types_by_extension[$extension], true)) {
            throw new Exception('La imagen no tiene un formato valido.');
        }
    } elseif (!in_array($file_type, $allowed_types_by_extension[$extension], true)) {
        throw new Exception('Tipo de archivo no permitido.');
    }

    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if (!$docRoot) {
        throw new Exception('No se pudo determinar el directorio publico.');
    }

    $target_dir = $docRoot . '/public/' . $id_empresa . '/';

    if (!file_exists($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            throw new Exception('No se pudo crear el directorio de destino.');
        }
    }

    $base_name = pathinfo($original_name, PATHINFO_FILENAME);
    $safe_base_name = preg_replace('/[^A-Za-z0-9_-]+/', '-', $base_name);
    $safe_base_name = trim($safe_base_name, '-_');
    if ($safe_base_name === '') {
        $safe_base_name = 'archivo';
    }

    $file_name = $safe_base_name . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($file_tmp, $target_file)) {
        $response['success'] = true;
        $response['message'] = 'Archivo subido correctamente';
        $response['url'] = '/public/' . $id_empresa . '/' . $file_name;
        $response['fileName'] = $file_name;
        $response['mimeType'] = $file_type;
    } else {
        throw new Exception('Error al mover el archivo subido.');
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
