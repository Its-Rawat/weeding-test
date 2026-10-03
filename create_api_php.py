import json

with open('live_config_backup.json', 'r', encoding='utf-8-sig') as f:
    config_data = json.load(f)

# Format seeds safely using json_decode in PHP
config_json_str = json.dumps(config_data, ensure_ascii=False)

php_template = f'''<?php
/**
 * Native Hostinger Backend for Chandrika & Xudong Wedding
 * Connected directly to Hostinger MySQL (u423951430_wedding_db) on localhost
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Key');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {{
    http_response_code(200);
    exit;
}}

// 1. Database Connection (Hostinger MySQL on localhost)
$dbHost = 'localhost';
$dbName = 'u423951430_wedding_db';
$dbUser = 'u423951430_wedding_user';
$dbPass = 'RawatDollar1234#';

try {{
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}} catch (PDOException $e) {{
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}}

// 2. Auto-Initialize Tables if they don't exist
$pdo->exec("
    CREATE TABLE IF NOT EXISTS config (
        config_key VARCHAR(100) PRIMARY KEY,
        config_value LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS rsvps (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        guest_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        attendance VARCHAR(50) DEFAULT 'hadir',
        guest_count INT DEFAULT 1,
        message TEXT DEFAULT NULL,
        created_at VARCHAR(100) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS wishes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at VARCHAR(100) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS guest_invitations (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        token VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        events TEXT DEFAULT NULL,
        plus_ones INT DEFAULT 0,
        created_at VARCHAR(100) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// 3. Seed Default Configurations if config table is empty
$chkStmt = $pdo->query("SELECT COUNT(*) FROM config");
if ($chkStmt->fetchColumn() == 0) {{
    $seedJson = <<<'SEEDJSON'
{config_json_str}
SEEDJSON;
    $seeds = json_decode($seedJson, true);
    if (is_array($seeds)) {{
        $insStmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
        foreach ($seeds as $k => $v) {{
            $insStmt->execute([$k, is_string($v) ? $v : json_encode($v)]);
        }}
    }}
}}

// 4. Helper Authentication Functions
function isAdmin() {{
    if (isset($_SERVER['HTTP_X_ADMIN_KEY']) && $_SERVER['HTTP_X_ADMIN_KEY'] === 'wedding2027') {{
        return true;
    }}
    return isset($_COOKIE['wedding_admin_auth']) && $_COOKIE['wedding_admin_auth'] === 'true';
}}

function getJsonInput() {{
    $raw = file_get_contents('php://input');
    return !empty($raw) ? json_decode($raw, true) : [];
}}

// 5. Parse Request Route
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
if (empty($route)) {{
    // Fallback: parse from REQUEST_URI
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (strpos($uri, '/api/') !== false) {{
        $route = trim(substr($uri, strpos($uri, '/api/') + 5), '/');
    }}
}}

$method = $_SERVER['REQUEST_METHOD'];

// -------------------------------------------------------------
// ROUTE HANDLERS
// -------------------------------------------------------------

// --- AUTH: Login ---
if ($route === 'auth/login' && $method === 'POST') {{
    header('Content-Type: application/json');
    $body = getJsonInput();
    $cred = $body['credential'] ?? ($body['password'] ?? '');
    if ($cred === 'RawatDollar1234#') {{
        setcookie('wedding_admin_auth', 'true', time() + 86400 * 7, '/', '', true, true);
        echo json_encode(['success' => true]);
    }} else {{
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credential']);
    }}
    exit;
}}

// --- AUTH: Logout ---
if ($route === 'auth/logout' && $method === 'POST') {{
    header('Content-Type: application/json');
    setcookie('wedding_admin_auth', '', time() - 3600, '/', '', true, true);
    echo json_encode(['success' => true]);
    exit;
}}

// --- AUTH: Status ---
if ($route === 'auth/status' && $method === 'GET') {{
    header('Content-Type: application/json');
    echo json_encode(['authenticated' => isAdmin()]);
    exit;
}}

// --- CONFIG: GET & POST ---
if ($route === 'config') {{
    header('Content-Type: application/json');
    if ($method === 'GET') {{
        $stmt = $pdo->query("SELECT config_key, config_value FROM config");
        $results = [];
        while ($row = $stmt->fetch()) {{
            $results[$row['config_key']] = $row['config_value'];
        }}
        echo json_encode($results);
        exit;
    }} elseif ($method === 'POST') {{
        if (!isAdmin()) {{
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }}
        $body = getJsonInput();
        $insStmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
        foreach ($body as $k => $v) {{
            $insStmt->execute([$k, is_string($v) ? $v : json_encode($v)]);
        }}
        echo json_encode(['success' => true]);
        exit;
    }}
}}

// --- RSVP: GET & POST ---
if ($route === 'rsvp' || preg_match('/^rsvp\\/?$/', $route)) {{
    header('Content-Type: application/json');
    if ($method === 'GET') {{
        $stmt = $pdo->query("SELECT * FROM rsvps ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }} elseif ($method === 'POST') {{
        $body = getJsonInput();
        $guestName = trim($body['guest_name'] ?? ($body['name'] ?? ''));
        if (empty($guestName)) {{
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Guest name is required']);
            exit;
        }}
        $phone = $body['phone'] ?? '';
        $attendance = $body['attendance'] ?? 'hadir';
        $guestCount = intval($body['guest_count'] ?? 1);
        $message = $body['message'] ?? '';
        $createdAt = date('c');

        $stmt = $pdo->prepare("INSERT INTO rsvps (guest_name, phone, attendance, guest_count, message, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$guestName, $phone, $attendance, $guestCount, $message, $createdAt]);
        $newId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'id' => $newId,
            'guest_name' => $guestName,
            'phone' => $phone,
            'attendance' => $attendance,
            'guest_count' => $guestCount,
            'message' => $message,
            'created_at' => $createdAt
        ]);
        exit;
    }}
}}

// --- PERSONALIZED RSVP: /api/rsvp/{{token}} ---
if (preg_match('/^rsvp\\/([^\\/]+)$/', $route, $m)) {{
    header('Content-Type: application/json');
    $token = $m[1];
    if ($method === 'GET') {{
        $stmt = $pdo->prepare("SELECT * FROM guest_invitations WHERE token = ?");
        $stmt->execute([$token]);
        $inv = $stmt->fetch();
        if ($inv) {{
            echo json_encode($inv);
        }} else {{
            http_response_code(404);
            echo json_encode(['error' => 'Invitation not found']);
        }}
        exit;
    }} elseif ($method === 'POST') {{
        $body = getJsonInput();
        $status = $body['status'] ?? 'CONFIRMED';
        $plusOnes = intval($body['plus_ones'] ?? 0);
        $events = isset($body['events']) ? (is_string($body['events']) ? $body['events'] : json_encode($body['events'])) : null;

        $stmt = $pdo->prepare("UPDATE guest_invitations SET status = ?, plus_ones = ?, events = ? WHERE token = ?");
        $stmt->execute([$status, $plusOnes, $events, $token]);

        $fetchStmt = $pdo->prepare("SELECT * FROM guest_invitations WHERE token = ?");
        $fetchStmt->execute([$token]);
        echo json_encode($fetchStmt->fetch());
        exit;
    }}
}}

// --- WISHES: GET & POST ---
if ($route === 'wishes') {{
    header('Content-Type: application/json');
    if ($method === 'GET') {{
        $stmt = $pdo->query("SELECT * FROM wishes ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }} elseif ($method === 'POST') {{
        $body = getJsonInput();
        $name = trim($body['name'] ?? '');
        $message = trim($body['message'] ?? '');
        if (empty($name) || empty($message)) {{
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Name and message are required']);
            exit;
        }}
        $createdAt = date('c');
        $stmt = $pdo->prepare("INSERT INTO wishes (name, message, created_at) VALUES (?, ?, ?)");
        $stmt->execute([$name, $message, $createdAt]);
        $newId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'id' => $newId,
            'name' => $name,
            'message' => $message,
            'created_at' => $createdAt
        ]);
        exit;
    }}
}}

// --- FILE UPLOADS: /api/upload/audio, /api/upload/image, /api/upload ---
if (strpos($route, 'upload') === 0) {{
    header('Content-Type: application/json');
    if (!isAdmin()) {{
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }}

    if ($method === 'DELETE') {{
        $url = $_GET['url'] ?? '';
        if (empty($url)) {{
            $body = getJsonInput();
            $url = $body['url'] ?? '';
        }}
        if (!empty($url) && strpos($url, '/uploads/') === 0) {{
            $rel = substr($url, strlen('/uploads/'));
            $filePath = __DIR__ . '/uploads/' . $rel;
            $realPath = realpath($filePath);
            $uploadsRoot = realpath(__DIR__ . '/uploads');
            if ($realPath && strpos($realPath, $uploadsRoot) === 0 && file_exists($realPath)) {{
                @unlink($realPath);
            }}
        }}
        echo json_encode(['success' => true, 'message' => 'Deleted']);
        exit;
    }}

    if ($method === 'POST') {{
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {{
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No file uploaded or upload error']);
            exit;
        }}

        $file = $_FILES['file'];
        $origName = $file['name'];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        $audioExts = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'];
        $imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

        $subDir = 'audio';
        if (in_array($ext, $imageExts)) {{
            $subDir = 'images';
        }} elseif (in_array($ext, $audioExts)) {{
            $subDir = 'audio';
        }} else {{
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Unsupported file extension: .' . $ext]);
            exit;
        }}

        $targetDir = __DIR__ . '/uploads/' . $subDir;
        if (!is_dir($targetDir)) {{
            mkdir($targetDir, 0755, true);
        }}

        $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $origName);
        $uniqueName = time() . '_' . substr(md5(uniqid()), 0, 8) . '_' . $cleanName;
        $destPath = $targetDir . '/' . $uniqueName;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {{
            $publicUrl = '/uploads/' . $subDir . '/' . $uniqueName;
            echo json_encode([
                'success' => true,
                'url' => $publicUrl,
                'fileName' => $origName,
                'storedName' => $uniqueName,
                'size' => $file['size'],
                'type' => $subDir
            ]);
            exit;
        }} else {{
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to save file to uploads directory']);
            exit;
        }}
    }}
}}

// Fallback: 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Endpoint not found', 'route' => $route]);
'''

with open('src/main/resources/static/api.php', 'w', encoding='utf-8') as f:
    f.write(php_template)

with open('backend/src/main/resources/static/api.php', 'w', encoding='utf-8') as f:
    f.write(php_template)

with open('frontend/public/api.php', 'w', encoding='utf-8') as f:
    f.write(php_template)

print("Generated standalone native Hostinger api.php successfully!")
