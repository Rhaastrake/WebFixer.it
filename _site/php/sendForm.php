<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Metodo non consentito');
}

// if ($_SERVER['HTTP_ORIGIN'] !== 'http://localhost') {
//     die('Fonte non consentita');
// }

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Usa percorso assoluto basato su __DIR__
require __DIR__ . '/phpmailer/vendor/autoload.php';
require __DIR__ . '/config.php';

$allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

// SANIFICAZIONE DATI FORM
$formType = htmlspecialchars($_POST['formType'] ?? '', ENT_QUOTES, 'UTF-8');

$fullName = htmlspecialchars($_POST['fullName'] ?? '', ENT_QUOTES, 'UTF-8');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phoneNumber = filter_var($_POST['phoneNumber'] ?? '', FILTER_SANITIZE_NUMBER_INT);
$location = htmlspecialchars($_POST['location'] ?? '', ENT_QUOTES, 'UTF-8');
$title = htmlspecialchars($_POST['title'] ?? '', ENT_QUOTES, 'UTF-8');
$details = htmlspecialchars($_POST['details'] ?? '', ENT_QUOTES, 'UTF-8');

$bugDetails = htmlspecialchars($_POST['bugDetails'] ?? '', ENT_QUOTES, 'UTF-8');

$pcType = htmlspecialchars($_POST['pcType'] ?? '', ENT_QUOTES, 'UTF-8');
$budget = filter_var($_POST['budget'] ?? '', FILTER_SANITIZE_NUMBER_INT);
$usedParts = htmlspecialchars($_POST['usedParts'] ?? '', ENT_QUOTES, 'UTF-8');
$withScreen = htmlspecialchars($_POST['withScreen'] ?? '', ENT_QUOTES, 'UTF-8');

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mgpcbari@gmail.com';
    $mail->Password = MAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('mgpcbari@gmail.com', 'MGPCBARI');
    $mail->addAddress('mgpcbari@gmail.com', 'Michele Garofalo');

    $mail->isHTML(true);

    switch ($formType) {
        case 'assistanceForm':
            $body = sendAssistanceRequest($fullName, $email, $phoneNumber, $location, $title, $details);
            $mail->Subject = 'Richiesta assistenza | MGPCBARI';
            break;
        case 'newPCForm':
            $body = sendNewPCRequest($fullName, $email, $phoneNumber, $location, $details, $pcType, $budget, $usedParts, $withScreen);
            $mail->Subject = 'Richiesta nuovo PC | MGPCBARI';
            break;
        case 'bugReportForm':
            $body = sendBugReport($email, $bugDetails);
            $mail->Subject = 'Segnalazione di un bug | MGPCBARI';
            break;
        default:
            http_response_code(400);
            exit('Tipo di form non riconosciuto');
    }

    if (!empty($_FILES['image']) && is_array($_FILES['image']['tmp_name'])) {
        foreach ($_FILES['image']['tmp_name'] as $key => $tmp_name) {
            if (is_uploaded_file($tmp_name)) {
                $fileName = $_FILES['image']['name'][$key];
                $check = getimagesize($tmp_name);
                if ($check !== false) {
                    $cid = md5(uniqid(time()));
                    $mail->addEmbeddedImage($tmp_name, $cid, $fileName);
                    $body .= '<img src="cid:' . $cid . '" style="max-width:300px; margin:10px 0;" /><br>';
                }
            }
        }
    }

    $mail->Body = $body;
    $mail->AltBody = 'Dettagli inviati con immagini.';

    $mail->send();
    echo "I dati sono stati inviati con successo";

} catch (Exception $e) {
    http_response_code(500);
    echo "Problema con l'invio dei dati: {$mail->ErrorInfo}";
}

function sendAssistanceRequest($fullName, $email, $phoneNumber, $location, $title, $details) {
    return '
    <h2>Nome e cognome: </h2>' . $fullName . '
    <h2>Email: </h2>' . $email . '
    <h2>Numero di telefono: </h2>' . $phoneNumber . '
    <h2>Città: </h2>' . $location . '
    <h2>Titolo: </h2>' . $title . '
    <h2>Dettagli: </h2>' . $details . '
    <h2>Foto allegate: </h2>';
}

function sendNewPCRequest($fullName, $email, $phoneNumber, $location, $details, $pcType, $budget, $usedParts, $withScreen) {
    return '
    <h2>Nome e cognome: </h2>' . $fullName . '
    <h2>Email: </h2>' . $email . '
    <h2>Numero di telefono: </h2>' . $phoneNumber . '
    <h2>Città: </h2>' . $location . '
    <h2>Dettagli: </h2>' . $details . '
    <h2>Tipologia di PC: </h2>' . $pcType . '
    <h2>Budget: €</h2>' . $budget . '
    <h2>Acquisto di parti usate: </h2>' . $usedParts . '
    <h2>Bisogno di uno schermo: </h2>' . $withScreen;
}

function sendBugReport($email, $bugDetails) {
    return '
    <h2>Email: </h2>' . $email . '
    <h2>Dettagli: </h2>' . $bugDetails;
}

?>
