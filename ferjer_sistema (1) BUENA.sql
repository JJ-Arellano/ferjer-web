-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2026 at 09:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ferjer_sistema`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`, `revoked_at`) VALUES
(90, 15, '1f48c2e64b78f25973745b6080cf4ea679d860550864d0f17ecacf16b86df114', '2026-03-08 11:50:53', '2026-03-01 11:50:53', NULL),
(91, 1, '79ba4ca3483d2e200e941cf9968a35ee539bc9b2a16167b2828b0e3c99fe03d4', '2026-03-09 07:59:25', '2026-03-02 07:59:25', NULL),
(92, 1, '5fd7fe16d0a7521317f4c44fef3ecb065ad09127d602d0bdb0198389bdc8a59f', '2026-03-09 08:01:18', '2026-03-02 08:01:18', NULL),
(94, 1, '6984e022c9d7b966b7726047b49868a01ba022d487d4c2c87e8d8792d95e9e2e', '2026-03-09 08:17:35', '2026-03-02 08:17:35', NULL),
(95, 15, '5444478dbf8df0f8b810b7b0e22eea862f811e873bbc75b320f3d492271d23ef', '2026-03-09 10:01:02', '2026-03-02 10:01:02', '2026-03-02 10:45:05'),
(96, 16, 'a3b469312424dfd21527baf5643218dde1fd36f598bca9a9533903bee6e45d13', '2026-03-09 10:06:24', '2026-03-02 10:06:24', NULL),
(97, 16, 'adc00ef45f7b942bfd32655ca7327eba9e5c13f05a7a9aacd0eb3bc498a0b470', '2026-03-09 10:06:24', '2026-03-02 10:06:24', NULL),
(98, 16, '607a190deeb92061ef4d9c74d0b9ce6d6553dbc4e362f1407091e5e697d83a5b', '2026-03-09 10:10:53', '2026-03-02 10:10:53', NULL),
(100, 20, '4bd4325c0f200de3a1c1ecdcf20e9a06b73f1312a8cd3e9e55c27db27f368a4a', '2026-03-09 11:32:17', '2026-03-02 11:32:17', NULL),
(101, 16, 'b7747435248e2f5f0a79ce68d1bbd7d6470102661a794d627a0818f66e35cf11', '2026-03-09 12:53:08', '2026-03-02 12:53:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `email`, `telefono`, `fecha_registro`, `password_hash`) VALUES
(1, 'Camilo Gonzalez', 'cam800@gmail.com', NULL, '2026-02-22 19:34:18', ''),
(2, 'Alejandro Solis', 'alex@gmail.com', NULL, '2026-02-24 10:17:55', ''),
(4, 'Alex Rodriguez', 'therichy@gmail.com', NULL, '2026-02-24 11:24:45', ''),
(5, 'Juan Pérez', 'juan@ejemplo.com', NULL, '2026-02-25 20:18:22', ''),
(6, 'Nombre del cliente', 'cliente@ejemplo.com', NULL, '2026-02-26 01:30:32', ''),
(7, 'Juan Villacobos', 'villa@gmail.com', NULL, '2026-02-27 10:48:12', ''),
(8, 'The Gichy', 'thegichy123@gmail.com', NULL, '2026-02-27 14:17:12', ''),
(9, 'Juan Villacobos', 'villa123@gmail.com', NULL, '2026-02-27 14:34:06', ''),
(10, 'alex', 'therichy32145@gmail.com', NULL, '2026-02-28 16:36:46', ''),
(11, 'EMMANUEL', 'ema@gmail.com', NULL, '2026-02-28 17:23:37', ''),
(12, 'Fabian Ovalle', 'ovalle@gmail.com', NULL, '2026-03-02 10:01:37', ''),
(13, 'alex', 'therichy32145@outlook.com', NULL, '2026-03-02 10:06:54', ''),
(15, 'Mariana', 'mari@gmail.com', '1234567890', '2026-03-02 11:30:08', '$2y$10$ISAIPQbJZpKVBtQaIH7QWetfeENunKrcFIUwNMWEv.j.IOE44JMPG');

-- --------------------------------------------------------

--
-- Table structure for table `equipos`
--

CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL,
  `folio` int(11) DEFAULT NULL,
  `id_cliente` int(11) NOT NULL,
  `tipo_equipo` varchar(50) NOT NULL,
  `modelo` varchar(120) NOT NULL,
  `falla` text NOT NULL,
  `id_estado` int(11) NOT NULL DEFAULT 1,
  `fecha_ingreso` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipos`
--

INSERT INTO `equipos` (`id_equipo`, `folio`, `id_cliente`, `tipo_equipo`, `modelo`, `falla`, `id_estado`, `fecha_ingreso`) VALUES
(2, 2, 2, 'Laptop', 'Lenovo', 'No carga', 3, '2026-02-24 10:17:55'),
(4, 4, 4, 'Laptop', 'hp', 'cambio pantalla', 3, '2026-02-24 11:24:45'),
(5, 5, 5, 'Laptop', 'HP Pavilion', 'No enciende', 2, '2026-02-25 20:18:22'),
(6, 6, 6, 'Laptop', 'HP Pavilion', 'No enciende', 5, '2026-02-26 01:30:32'),
(7, 7, 7, 'Monitor', 'Samsung', 'No enciende', 4, '2026-02-27 10:48:12'),
(8, 8, 8, 'Laptop', 'HP', 'Le cayo jugo', 1, '2026-02-27 14:17:12'),
(9, 9, 9, 'Laptop', 'HP', 'Cambio Pantalla', 5, '2026-02-27 14:34:06'),
(10, 10, 10, 'PC Escritorio', 'hp', 'laptop hp', 1, '2026-02-28 16:36:46'),
(11, 11, 10, 'PC Escritorio', 'hp', 'pantalla', 1, '2026-02-28 16:49:03'),
(12, 12, 10, 'PC Escritorio', 'hp', 'pantalla dañada', 1, '2026-02-28 17:10:32'),
(14, 14, 12, 'Monitor', 'nose', 'nose', 1, '2026-03-02 10:01:37'),
(15, 15, 13, 'PC Escritorio', 'hp modelo uwu', 'pantalla dañana', 1, '2026-03-02 10:06:54');

-- --------------------------------------------------------

--
-- Table structure for table `estados`
--

CREATE TABLE `estados` (
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estados`
--

INSERT INTO `estados` (`id_estado`, `nombre`) VALUES
(2, 'Diagnóstico'),
(5, 'Entregado'),
(4, 'Listo'),
(1, 'Recibido'),
(3, 'Reparación');

-- --------------------------------------------------------

--
-- Table structure for table `historial_orden`
--

CREATE TABLE `historial_orden` (
  `id_historial` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historial_orden`
--

INSERT INTO `historial_orden` (`id_historial`, `id_equipo`, `id_estado`, `id_usuario`, `comentario`, `fecha_movimiento`) VALUES
(23, 4, 5, NULL, 'SE ENTREGO', '2026-02-24 21:28:44'),
(25, 5, 1, NULL, 'Equipo registrado', '2026-02-25 20:18:22'),
(27, 6, 1, NULL, 'Equipo registrado', '2026-02-26 01:30:32'),
(28, 6, 5, NULL, 'Cambio de estatus', '2026-02-26 11:28:39'),
(29, 5, 5, NULL, 'dejo anticipo', '2026-02-26 11:29:51'),
(30, 5, 2, NULL, 'Tiene problemas', '2026-02-27 10:45:31'),
(31, 7, 1, NULL, 'Equipo registrado', '2026-02-27 10:48:12'),
(32, 7, 5, NULL, 'Cambio de estatus', '2026-02-27 14:13:04'),
(33, 7, 3, NULL, 'jajajajajajja', '2026-02-27 14:13:49'),
(34, 7, 4, NULL, 'Entregado', '2026-02-27 14:16:06'),
(35, 8, 1, NULL, 'Equipo registrado', '2026-02-27 14:17:12'),
(36, 8, 4, NULL, 'no fue culpa de juan', '2026-02-27 14:17:34'),
(37, 9, 1, NULL, 'Equipo registrado', '2026-02-27 14:34:06'),
(38, 8, 1, NULL, 'OK', '2026-02-27 19:47:44'),
(39, 9, 5, NULL, 'Cambio de estatus', '2026-02-27 19:48:42'),
(40, 10, 1, NULL, 'Equipo registrado', '2026-02-28 16:36:46'),
(41, 11, 1, NULL, 'Equipo registrado', '2026-02-28 16:49:03'),
(42, 12, 1, NULL, 'Equipo registrado', '2026-02-28 17:10:32'),
(45, 14, 1, NULL, 'Equipo registrado', '2026-03-02 10:01:37'),
(46, 15, 1, NULL, 'Equipo registrado', '2026-03-02 10:06:54');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(10) UNSIGNED NOT NULL,
  `ip` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `estatus` enum('Pendiente','Pagado','Listo','Entregado') NOT NULL DEFAULT 'Pendiente',
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` datetime DEFAULT NULL,
  `notas` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `estatus`, `total`, `fecha_pedido`, `fecha_entrega`, `notas`) VALUES
(1, 1, 'Entregado', 4950.00, '2026-02-25 20:58:38', NULL, ''),
(2, 1, 'Entregado', 8650.00, '2026-02-26 01:53:51', NULL, ''),
(6, 14, 'Entregado', 450.00, '2026-02-27 13:13:44', NULL, ''),
(7, 14, 'Entregado', 550.00, '2026-02-27 14:21:25', NULL, ''),
(8, 14, 'Entregado', 1000.00, '2026-02-27 14:27:18', NULL, ''),
(9, 14, 'Entregado', 450.00, '2026-02-27 18:09:30', NULL, ''),
(10, 14, 'Entregado', 450.00, '2026-02-27 18:13:49', NULL, ''),
(11, 14, 'Pagado', 450.00, '2026-02-27 19:24:12', NULL, ''),
(12, 20, 'Pendiente', 0.00, '2026-03-02 11:31:08', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pedido_items`
--

CREATE TABLE `pedido_items` (
  `id_item` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unit` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pedido_items`
--

INSERT INTO `pedido_items` (`id_item`, `id_pedido`, `id_producto`, `cantidad`, `precio_unit`) VALUES
(1, 1, 1, 9, 550.00),
(2, 2, 1, 1, 550.00),
(3, 2, 4, 18, 450.00),
(10, 6, 2, 1, 450.00),
(11, 7, 1, 1, 550.00),
(12, 8, 1, 1, 550.00),
(13, 8, 2, 1, 450.00),
(14, 9, 4, 1, 450.00),
(15, 10, 4, 1, 450.00),
(16, 11, 2, 1, 450.00);

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `precio`, `stock`, `imagen`, `fecha_alta`) VALUES
(1, 'Bocina', 550.00, 7, NULL, '2026-02-24 10:23:54'),
(2, 'Mouse Gamer', 450.00, 4, '', '2026-02-26 03:48:15'),
(4, 'Teclado', 450.00, 39, '', '2026-02-26 08:46:29'),
(7, 'PANTALLA', 10000.00, 1, '', '2026-02-28 02:46:52');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('Cliente','Administrador','Tecnico','Empleado') NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password_hash`, `rol`, `fecha_registro`) VALUES
(1, 'carolina', 'caromtz@gmail.com', '$2y$10$AkbRxvc9IHJ3PS4BUxmuS.fKTDUb6LjzXEspdEd0CPP7izBrCjPdq', 'Administrador', '2026-02-22 19:31:37'),
(14, 'Juan Villacobos', 'villa123@gmail.com', '$2y$10$Y0Gy5bSsTwpQ1vXx1vPBSemtxgmluxD49cyshIDIF5Pte1byp0oem', 'Cliente', '2026-02-27 13:13:01'),
(15, 'Juan Arellano', 'juan@gmail.com', '$2y$10$Gpp2Pp.FxcZAqvULUwmA.euzZTWGPuqW4KMyvnyj8hHlR9q4Ae8Ai', 'Empleado', '2026-02-27 13:17:29'),
(16, 'Alex Rodriguez', 'alex123@gmail.com', '$2y$10$RhwuSLb0nPfIU6s9fdafUeqMf/XcPQC1SP52S/rby7XVRvfOl/Z66', 'Tecnico', '2026-02-27 13:21:49'),
(20, 'Mariana', 'mari@gmail.com', '$2y$10$ISAIPQbJZpKVBtQaIH7QWetfeENunKrcFIUwNMWEv.j.IOE44JMPG', 'Cliente', '2026-03-02 11:30:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indexes for table `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id_equipo`),
  ADD UNIQUE KEY `folio` (`folio`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indexes for table `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `historial_orden`
--
ALTER TABLE `historial_orden`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `idx_hist_equipo` (`id_equipo`),
  ADD KEY `fk_hist_usuario` (`id_usuario`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip` (`ip`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `pedido_items`
--
ALTER TABLE `pedido_items`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `historial_orden`
--
ALTER TABLE `historial_orden`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pedido_items`
--
ALTER TABLE `pedido_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `fk_api_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `equipos_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`);

--
-- Constraints for table `historial_orden`
--
ALTER TABLE `historial_orden`
  ADD CONSTRAINT `fk_hist_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `historial_orden_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`),
  ADD CONSTRAINT `historial_orden_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`);

--
-- Constraints for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `pedido_items`
--
ALTER TABLE `pedido_items`
  ADD CONSTRAINT `pedido_items_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `pedido_items_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
