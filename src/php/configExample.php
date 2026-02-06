<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

// Configurazione SMTP
define('MAIL_USERNAME', '? ? ?'); // account Gmail
define('MAIL_PASSWORD', '? ? ?');               // App Password Gmail
define('MAIL_HOST', 'smtp.gmail.com');                     // host SMTP
define('MAIL_PORT', 587);                                  // porta SMTP
define('MAIL_FROM_NAME', '? ? ?');                // nome mittente
?>
