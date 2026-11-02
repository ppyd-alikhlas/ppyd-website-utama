<?php
/**
 * Konfigurasi koneksi database dashboard pesantren.
 *
 * Atur environment variables pada server:
 * DB_HOST, DB_NAME, DB_USER, DB_PASS.
 *
 * Fallback di bawah ditujukan untuk XAMPP lokal.
 * Jangan menyimpan password database produksi di repository.
 */

$readEnv = static function ($key, $default = '') {
    $value = getenv($key);
    return ($value !== false && $value !== '') ? $value : $default;
};

$host = $readEnv('DB_HOST', 'localhost');
$database = $readEnv('DB_NAME', 'siata_sistem4');
$username = $readEnv('DB_USER', 'root');
$password = $readEnv('DB_PASS', '');

$dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $database);

return new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_TIMEOUT => 3,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
