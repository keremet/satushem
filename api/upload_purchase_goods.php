<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2020 - Andrey Sokolov
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
header('Access-Control-Allow-Credentials: true');
include('headers.php');
include('connect.php');

$f = fopen($_FILES['file']['tmp_name'], "r");
if ($f) {
	$stmtUnit = $db->prepare("SELECT id FROM unit WHERE name = ?");
    $stmtGoods = $db->prepare("INSERT INTO purchase_goods(purchase_id, name, price, unit_id) VALUES (?, ?, ?, ?)");
    while (($buffer = fgets($f)) !== false) {
        list($name, $price, $unit) = explode(';', trim($buffer));
		echo "$name - $price - $unit\n";

		$stmtUnit->execute(array($unit));
		if ($unit_id = $stmtUnit->fetchColumn()) {
			echo "$unit_id\n";
			if (!$stmtGoods->execute(array($_GET['purchase_id'], $name, $price, $unit_id))) {
				echo "Ошибка вставки $name - $price - $unit\n";
			}
		} else {
			echo "Единица измерения $unit не найдена\n";
		}
    }
    if (!feof($f)) {
        echo "Ошибка: fgets() неожиданно потерпел неудачу\n";
    }
    fclose($f);
}
?>
