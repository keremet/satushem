/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2019
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
 
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `id_hi` int(11),
  CONSTRAINT `category_id` FOREIGN KEY (`id_hi`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `state` (
  `id` int(11) NOT NULL PRIMARY KEY,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `payment_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `login` text COLLATE utf8_unicode_ci NOT NULL,
  `password` text COLLATE utf8_unicode_ci NOT NULL,
  `visible_name` text COLLATE utf8_unicode_ci,
  `contacts` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `who_add_id` int(11),
  `photo` text COLLATE utf8_unicode_ci,
   CONSTRAINT `member__who_add_id` FOREIGN KEY (`who_add_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `member_id` int(11),
  `date_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `unit__member_id` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `payment_method_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `img` text COLLATE utf8_unicode_ci,
  `description` text COLLATE utf8_unicode_ci,
  `issue_place` text COLLATE utf8_unicode_ci,
  `deadline` date,
  `amount` decimal(30, 10),
  `price` decimal(20, 2),
  `min_volume` decimal(30, 10) not null default 1,
  `is_public` boolean not null default true,
  `payment_info` text COLLATE utf8_unicode_ci,
  CONSTRAINT `purchase__category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase__statement_id` FOREIGN KEY (`state_id`) REFERENCES `state` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase__payment_method_id` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase__creator_id` FOREIGN KEY (`creator_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase__unit_id` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `black_list` (
  `purchase_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `d` date NOT NULL,
  `comment` text COLLATE utf8_unicode_ci,
  CONSTRAINT `black_list__purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `black_list__member_id` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `token` (
  `id` varchar(64) NOT NULL PRIMARY KEY,
  `member_id` int(11) NOT NULL,
  `date_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `token__member_id` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `request` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `purchase_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `d` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(30, 10) NOT NULL,
  CONSTRAINT `request__purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `request__member_id` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `issue` (
  `request_id` int(11) NOT NULL,
  `d` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(30, 10) NOT NULL,
   CONSTRAINT `issue__request_id` FOREIGN KEY (`request_id`) REFERENCES `request` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `payment` (
  `request_id` int(11) NOT NULL,
  `d` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `value` decimal(20, 2) NOT NULL,
   CONSTRAINT `payment__request_id` FOREIGN KEY (`request_id`) REFERENCES `request` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `payment_method` (`id`, `name`) VALUES
(1, 'Предоплата напрямую организатору'),
(2, 'В момент выдачи товара');

INSERT INTO `state` (`id`, `name`) VALUES
(0, 'Сбор заказов'),
(1, 'Сбор заказов завершен'),
(2, 'Закрыта');

INSERT INTO `unit` (`name`) VALUES
('кг'),
('л'),
('шт');
