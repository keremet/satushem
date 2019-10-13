<?
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
if ($_SERVER['REQUEST_METHOD']=='OPTIONS') {
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
	$h = getallheaders();
	header('Access-Control-Allow-Headers: ' . $h['Access-Control-Request-Headers']);
	exit;
}
?>
