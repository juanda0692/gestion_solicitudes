<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route API requests to the backend index
if (preg_match('#^/api#', $uri)) {
    require __DIR__ . '/public/index.php';
    return true;
}

// Serve existing files as usual
$fullPath = __DIR__ . '/../' . ltrim($uri, '/');
if ($uri !== '/' && file_exists($fullPath)) {
    return false; // let built-in server serve the file
}

// Fallback to front-end index if present
$frontIndex = __DIR__ . '/../public/index.html';
if (file_exists($frontIndex)) {
    require $frontIndex;
    return true;
}

return false;
