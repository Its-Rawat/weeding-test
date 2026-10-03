<?php
/**
 * Native Hostinger Backend for Chandrika & Xudong Wedding
 * Connected directly to Hostinger MySQL (u423951430_wedding_db) on localhost
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Key');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Database Connection (Hostinger MySQL on localhost)
$dbHost = 'localhost';
$dbName = 'u423951430_wedding_db';
$dbUser = 'u423951430_wedding_user';
$dbPass = 'RawatDollar1234#';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

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
if ($chkStmt->fetchColumn() == 0) {
    $seedJson = <<<'SEEDJSON'
{"BRIDE_NICKNAME": "Chandrika", "BRIDE_FULLNAME": "Chandrika", "BRIDE_PARENTS": "Beloved daughter of Mr. & Mrs. Sharma", "BRIDE_INSTAGRAM": "chandrika_c", "BRIDE_IMAGE": "/couple/formal_portrait.jpg", "GROOM_NICKNAME": "Xudong", "GROOM_FULLNAME": "Xudong", "GROOM_PARENTS": "Beloved son of Mr. & Mrs. Wang", "GROOM_INSTAGRAM": "xudong_w", "GROOM_IMAGE": "/couple/formal_portrait.jpg", "VENUE_NAME": "The Club International", "VENUE_ADDRESS": "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)", "VENUE_LAT": "28.5134", "VENUE_LNG": "77.0275", "AKAD_TITLE": "Wedding Ceremony (Baraat & Pheras)", "AKAD_DAY": "Monday", "AKAD_DATE": "15 February 2027", "AKAD_START": "19:00", "AKAD_END": "22:00", "AKAD_ISO_START": "2027-02-15T19:00:00+05:30", "AKAD_ISO_END": "2027-02-15T22:00:00+05:30", "HERO_IMAGE": "/couple/formal_portrait.jpg", "HERO_CITY": "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)", "MUSIC_URL": "https://www.bensound.com/bensound-music/bensound-forever.mp3", "RSVP_MAX_GUESTS": "10", "BANK_ACCOUNTS": "[{\"bank\":\"DBS / POSB\",\"number\":\"123-45678-9\",\"name\":\"Chandrika & Xudong\"},{\"bank\":\"Bank Transfer / Zelle\",\"number\":\"chandrika.xudong.wedding@gmail.com\",\"name\":\"Chandrika & Xudong\"}]", "LOVE_STORY": "[{\"date\":\"2021\",\"title\":\"The Serendipitous Meeting\",\"desc\":\"Our paths crossed on a breezy autumn afternoon, sparking an effortless connection filled with laughter, shared values, and endless conversations.\"},{\"date\":\"2023\",\"title\":\"Growing Together\",\"desc\":\"Through journeys near and far, we discovered that true happiness lies in understanding, gentle support, and quiet joy together.\"},{\"date\":\"2025\",\"title\":\"A Lifetime Promise\",\"desc\":\"Under starlight, we promised to walk hand in hand through every season of life, choosing each other with all our hearts.\"} ]", "GALLERY_IMAGES": "[\"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop\",\"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop\",\"https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop\",\"https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop\",\"https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop\",\"https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop\"]", "TEXT_SALAM_OPENING": "Together with our families, we warmly invite you", "TEXT_QUOTE_AR_RUM": "\"Two souls with but a single thought, two hearts that beat as one. In love, kindness, and devotion, we begin our new journey together.\"", "TEXT_QUOTE_SOURCE": "A Celebration of Love & Unity", "TEXT_INVITATION": "With immense joy and grateful hearts, we invite you to share in our happiness as we unite in marriage.", "TEXT_CLOSING": "Your blessings, presence, and prayers mean everything to us as we begin this beautiful chapter of our lives.", "TEXT_SALAM_CLOSING": "With warm regards and heartfelt gratitude,", "TEXT_SIGNATURE": "Happily Ever After,", "TEXT_FAMILY": "The Families of Chandrika & Xudong", "TEXT_GIFT_TITLE": "Wedding Blessings", "TEXT_GIFT_DESC": "Your presence and warm wishes are the greatest gift we could ever ask for. For friends and family who have kindly inquired about gifts, contributions toward our new journey together are gratefully appreciated.", "CELEBRATIONS": "[{\"id\":1,\"key\":\"MEHENDI\",\"title\":\"Mehendi Ceremony\",\"subtitle\":\"Adorning hands with henna, music & sweet celebration\",\"dayDate\":\"Sunday, 14 February 2027\",\"time\":\"04:00 PM onwards\",\"venueName\":\"Royal Courtyard, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Vibrant Mehndi Greens & Pastel Florals\",\"desc\":\"Welcoming our beloved guests as Chandrika adorns bridal henna, accompanied by live folk rhythms, traditional bangles artisan, and gourmet chaat stations.\",\"illustration\":\"🌿\",\"startIso\":\"2027-02-14T16:00:00+05:30\",\"endIso\":\"2027-02-14T20:00:00+05:30\"},{\"id\":2,\"key\":\"HALDI\",\"title\":\"Haldi Ceremony\",\"subtitle\":\"A splash of sunshine, laughter & turmeric blessings\",\"dayDate\":\"Monday, 15 February 2027\",\"time\":\"10:00 AM onwards\",\"venueName\":\"Poolside Pavilion, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Sunny Yellows, Ochre & Marigold Orange\",\"desc\":\"An auspicious ceremony of turmeric paste blessings for Chandrika & Xudong, accompanied by celebratory dhol beats and a shower of fresh marigold and rose petals.\",\"illustration\":\"🌼\",\"startIso\":\"2027-02-15T10:00:00+05:30\",\"endIso\":\"2027-02-15T13:00:00+05:30\"},{\"id\":3,\"key\":\"WEDDING\",\"title\":\"Wedding Ceremony (Baraat & Sacred Pheras)\",\"subtitle\":\"The sacred vows of love under the holy mandap\",\"dayDate\":\"Monday, 15 February 2027\",\"time\":\"Baraat: 07:00 PM ÔÇó Pheras: 08:30 PM\",\"venueName\":\"The Grand Mandap, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Traditional Banarasi Silks & Regal Sherwanis\",\"desc\":\"Xudong arrives with joyful baraat procession, followed by Chandrika's grand bridal entrance and the sacred seven pheras around the holy agni.\",\"illustration\":\"🔥\",\"startIso\":\"2027-02-15T19:00:00+05:30\",\"endIso\":\"2027-02-15T22:00:00+05:30\"}]", "STORY_SLIDES": "[{\"image\":\"/couple/snow_winter.jpg\",\"chapter\":\"Chapter 01\",\"title\":\"The Snowy Trails\",\"subtitle\":\"Where our journey began\",\"caption\":\"Wrapped in winter warmth, shared laughter, and quiet pine trees that witnessed the start of our story.\"},{\"image\":\"/couple/tuktuk_candid.jpg\",\"chapter\":\"Chapter 02\",\"title\":\"Joy & Sweet Laughter\",\"subtitle\":\"Finding magic in simple moments\",\"caption\":\"From fun rickshaw rides to late-night chats, every ordinary day turned into an extraordinary memory.\"},{\"image\":\"/couple/travel_fun.jpg\",\"chapter\":\"Chapter 03\",\"title\":\"Adventures Near & Far\",\"subtitle\":\"Exploring the world together\",\"caption\":\"Hand in hand through sunny skies and new horizons, discovering that home is wherever we are together.\"},{\"image\":\"/couple/proposal_story.jpg\",\"chapter\":\"Chapter 04\",\"title\":\"Under Tropical Stars\",\"subtitle\":\"The proposal on the bridge\",\"caption\":\"A knee on the wooden bridge, a box opened under the palms, and a question straight from the heart.\"},{\"image\":\"/couple/ring_reveal.jpg\",\"chapter\":\"Chapter 05\",\"title\":\"She Said YES!\",\"subtitle\":\"A lifetime promise begins\",\"caption\":\"With tears of pure happiness, glowing lanterns, and full hearts ready to spend forever as one.\"},{\"image\":\"/couple/formal_portrait.jpg\",\"chapter\":\"Chapter 06\",\"title\":\"Stepping Into Forever\",\"subtitle\":\"Under the Holy Mandap\",\"caption\":\"Chandrika & Xudong warmly welcome you to celebrate their wedding nuptials on February 14 & 15, 2027 in Gurugram.\"}]", "PLAYLIST_TRACKS": "[{\"id\":\"track-1\",\"title\":\"Kudmayi ÔÇó Royal Symphony\",\"shortLabel\":\"Kudmayi ÔÇó Royal Symphony\",\"artist\":\"Shahid Mallya ÔÇó Traditional Sitar\",\"poster\":\"/couple/formal_portrait.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#D4AF37\",\"tag\":\"Formal Portrait\"},{\"id\":\"track-2\",\"title\":\"Din Shagna Da ÔÇó Bridal Walk\",\"shortLabel\":\"Din Shagna Da ÔÇó Bridal Walk\",\"artist\":\"Jasleen Royal ÔÇó Shenai Melody\",\"poster\":\"/couple/proposal_story.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#8C1D24\",\"tag\":\"The Proposal\"},{\"id\":\"track-3\",\"title\":\"Kesariya ÔÇó Sacred Promise\",\"shortLabel\":\"Kesariya ÔÇó Sacred Promise\",\"artist\":\"Arijit Singh ÔÇó Flute & Acoustic\",\"poster\":\"/couple/ring_reveal.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#B38E38\",\"tag\":\"Ring Reveal\"},{\"id\":\"track-4\",\"title\":\"Mast Magan ÔÇó Wanderlust\",\"shortLabel\":\"Mast Magan ÔÇó Wanderlust\",\"artist\":\"Arijit Singh ÔÇó Rhythmic Tabla\",\"poster\":\"/couple/travel_fun.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#D9822B\",\"tag\":\"Travel Memories\"},{\"id\":\"track-5\",\"title\":\"Tum Se Hi ÔÇó Snowy Pines\",\"shortLabel\":\"Tum Se Hi ÔÇó Snowy Pines\",\"artist\":\"Mohit Chauhan ÔÇó Serene Chords\",\"poster\":\"/couple/snow_winter.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#3B82F6\",\"tag\":\"Winter Trails\"},{\"id\":\"track-6\",\"title\":\"Gallan Goodiyaan ÔÇó Street Joy\",\"shortLabel\":\"Gallan Goodiyaan ÔÇó Street Joy\",\"artist\":\"Shankar Mahadevan ÔÇó Dhol Folk\",\"poster\":\"/couple/tuktuk_candid.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#E11D48\",\"tag\":\"TukTuk Candid\"}]"}
SEEDJSON;
    $seeds = json_decode($seedJson, true);
    if (is_array($seeds)) {
        $insStmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
        foreach ($seeds as $k => $v) {
            $insStmt->execute([$k, is_string($v) ? $v : json_encode($v)]);
        }
    }
}

// 4. Helper Authentication Functions
function isAdmin() {
    if (isset($_SERVER['HTTP_X_ADMIN_KEY']) && $_SERVER['HTTP_X_ADMIN_KEY'] === 'wedding2027') {
        return true;
    }
    return isset($_COOKIE['wedding_admin_auth']) && $_COOKIE['wedding_admin_auth'] === 'true';
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    return !empty($raw) ? json_decode($raw, true) : [];
}

// 5. Parse Request Route
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
if (empty($route)) {
    // Fallback: parse from REQUEST_URI
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (strpos($uri, '/api/') !== false) {
        $route = trim(substr($uri, strpos($uri, '/api/') + 5), '/');
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// -------------------------------------------------------------
// ROUTE HANDLERS
// -------------------------------------------------------------

// --- AUTH: Login ---
if ($route === 'auth/login' && $method === 'POST') {
    header('Content-Type: application/json');
    $body = getJsonInput();
    $cred = $body['credential'] ?? ($body['password'] ?? '');
    if ($cred === 'RawatDollar1234#') {
        setcookie('wedding_admin_auth', 'true', time() + 86400 * 7, '/', '', true, true);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credential']);
    }
    exit;
}

// --- AUTH: Logout ---
if ($route === 'auth/logout' && $method === 'POST') {
    header('Content-Type: application/json');
    setcookie('wedding_admin_auth', '', time() - 3600, '/', '', true, true);
    echo json_encode(['success' => true]);
    exit;
}

// --- AUTH: Status ---
if ($route === 'auth/status' && $method === 'GET') {
    header('Content-Type: application/json');
    echo json_encode(['authenticated' => isAdmin()]);
    exit;
}

// --- CONFIG: GET & POST ---
if ($route === 'config') {
    header('Content-Type: application/json');
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT config_key, config_value FROM config");
        $results = [];
        while ($row = $stmt->fetch()) {
            $results[$row['config_key']] = $row['config_value'];
        }
        echo json_encode($results);
        exit;
    } elseif ($method === 'POST') {
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
        $body = getJsonInput();
        $insStmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
        foreach ($body as $k => $v) {
            $insStmt->execute([$k, is_string($v) ? $v : json_encode($v)]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
}

// --- RSVP: GET & POST ---
if ($route === 'rsvp' || preg_match('/^rsvp\/?$/', $route)) {
    header('Content-Type: application/json');
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM rsvps ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    } elseif ($method === 'POST') {
        $body = getJsonInput();
        $guestName = trim($body['guest_name'] ?? ($body['name'] ?? ''));
        if (empty($guestName)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Guest name is required']);
            exit;
        }
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
    }
}

// --- PERSONALIZED RSVP: /api/rsvp/{token} ---
if (preg_match('/^rsvp\/([^\/]+)$/', $route, $m)) {
    header('Content-Type: application/json');
    $token = $m[1];
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM guest_invitations WHERE token = ?");
        $stmt->execute([$token]);
        $inv = $stmt->fetch();
        if ($inv) {
            echo json_encode($inv);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Invitation not found']);
        }
        exit;
    } elseif ($method === 'POST') {
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
    }
}

// --- WISHES: GET & POST ---
if ($route === 'wishes') {
    header('Content-Type: application/json');
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM wishes ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    } elseif ($method === 'POST') {
        $body = getJsonInput();
        $name = trim($body['name'] ?? '');
        $message = trim($body['message'] ?? '');
        if (empty($name) || empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Name and message are required']);
            exit;
        }
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
    }
}

// --- FILE UPLOADS: /api/upload/audio, /api/upload/image, /api/upload ---
if (strpos($route, 'upload') === 0) {
    header('Content-Type: application/json');
    if (!isAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if ($method === 'DELETE') {
        $url = $_GET['url'] ?? '';
        if (empty($url)) {
            $body = getJsonInput();
            $url = $body['url'] ?? '';
        }
        if (!empty($url) && strpos($url, '/uploads/') === 0) {
            $rel = substr($url, strlen('/uploads/'));
            $filePath = __DIR__ . '/uploads/' . $rel;
            $realPath = realpath($filePath);
            $uploadsRoot = realpath(__DIR__ . '/uploads');
            if ($realPath && strpos($realPath, $uploadsRoot) === 0 && file_exists($realPath)) {
                @unlink($realPath);
            }
        }
        echo json_encode(['success' => true, 'message' => 'Deleted']);
        exit;
    }

    if ($method === 'POST') {
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No file uploaded or upload error']);
            exit;
        }

        $file = $_FILES['file'];
        $origName = $file['name'];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        $audioExts = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'];
        $imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

        $subDir = 'audio';
        if (in_array($ext, $imageExts)) {
            $subDir = 'images';
        } elseif (in_array($ext, $audioExts)) {
            $subDir = 'audio';
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Unsupported file extension: .' . $ext]);
            exit;
        }

        $targetDir = __DIR__ . '/uploads/' . $subDir;
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $origName);
        $uniqueName = time() . '_' . substr(md5(uniqid()), 0, 8) . '_' . $cleanName;
        $destPath = $targetDir . '/' . $uniqueName;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {
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
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to save file to uploads directory']);
            exit;
        }
    }
}

// Fallback: 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Endpoint not found', 'route' => $route]);
