<?php
include "connection.php";
$id = $_GET['id'];
$sql->query("DELETE FROM usuario WHERE user_id = $id");
header("Location: ../html/lista_usuario.php");
exit();
?>