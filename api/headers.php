<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2019 - Andrey Sokolov
 * Copyright (C) 2019 - Michail Kudryavtsev
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
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
if ($_SERVER['REQUEST_METHOD']=='OPTIONS') {
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
	$h = getallheaders();
	header('Access-Control-Allow-Headers: ' . $h['Access-Control-Request-Headers']);
	exit;
}
?>
