<?php
// Hostinger Proxy to Render Spring Boot Backend
@ini_set('upload_max_filesize', '64M');
@ini_set('post_max_size', '70M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', '300');

$backendHost = 'https://weeding-test.onrender.com';
$requestUri = $_SERVER['REQUEST_URI'];
$targetUrl = $backendHost . $requestUri;

$ch = curl_init($targetUrl);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

$headers = [];
$hasFiles = !empty($_FILES);

if (function_exists('getallheaders')) {
    foreach (getallheaders() as $key => $value) {
        $lower = strtolower($key);
        if ($lower === 'host') continue;
        if ($hasFiles && $lower === 'content-type') continue;
        if ($lower === 'content-length') continue;
        $headers[] = "$key: $value";
    }
}

// Always ensure admin key is present for admin and upload operations
if (strpos($requestUri, '/api/upload') !== false || strpos($requestUri, '/api/config') !== false) {
    $headers[] = 'X-Admin-Key: wedding2027';
}

// Forward cookies
if (!empty($_SERVER['HTTP_COOKIE'])) {
    curl_setopt($ch, CURLOPT_COOKIE, $_SERVER['HTTP_COOKIE']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
    if ($hasFiles) {
        $postData = $_POST;
        foreach ($_FILES as $key => $file) {
            if (!empty($file['tmp_name']) && is_uploaded_file($file['tmp_name'])) {
                $postData[$key] = new CURLFile(
                    $file['tmp_name'],
                    !empty($file['type']) ? $file['type'] : 'application/octet-stream',
                    $file['name']
                );
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    } else {
        $input = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
        if (!empty($_SERVER['CONTENT_TYPE']) && !$hasFiles) {
            $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
        }
    }
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 180);

$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unable to reach backend server']);
    exit;
}

$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

http_response_code($httpCode);

foreach (explode("\r\n", $responseHeaders) as $header) {
    if (!empty($header)) {
        $lower = strtolower($header);
        if (!str_starts_with($lower, 'transfer-encoding:') && !str_starts_with($lower, 'content-length:')) {
            header($header, false);
        }
    }
}

echo $responseBody;
