<?php
include "connection.php";
$id = $_GET['id'];
$sql->query("DELETE FROM usuario WHERE user_id = $id AND user_cargo = 'scan'");
header("Location: ../html/lista_scan.php");
exit();
?>
