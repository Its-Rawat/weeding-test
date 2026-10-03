<?php
// Hostinger Proxy to Render Spring Boot Backend
$backendHost = 'https://weeding-test.onrender.com';
$requestUri = $_SERVER['REQUEST_URI'];
$targetUrl = $backendHost . $requestUri;

$ch = curl_init($targetUrl);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
    $input = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

$headers = [];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $key => $value) {
        if (strtolower($key) !== 'host') {
            $headers[] = "$key: $value";
        }
    }
}
if (!empty($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

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
