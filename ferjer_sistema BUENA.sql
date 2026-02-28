-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2026 at 02:53 AM
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
(1, 1, '15e761644ffb5d15ce5645163625c6148854784e75dbb463d1dc436ffff9bb44', '2026-03-04 13:09:37', '2026-02-25 13:09:37', NULL),
(2, 1, 'f1a3e1c42d9868bdd11a5130ce33f1bc9d088777446f9c39f42174a634477f23', '2026-03-04 13:38:32', '2026-02-25 13:38:32', NULL),
(3, 1, 'b490fb112a7710bb87e3de85cfc5de47b4efcacfc5c6028f42d7f01ec6d4405f', '2026-03-04 18:06:12', '2026-02-25 18:06:12', NULL),
(4, 1, '45929792fee909884c9f3e2a285421a0edc84c783c3089cb768a451012c4a897', '2026-03-04 20:07:52', '2026-02-25 20:07:52', NULL),
(6, 1, '653ccdb43f8012cb61cb7e89c9242cec4cf4d4c8a1d53689a55c455d45199ce3', '2026-03-04 23:22:33', '2026-02-25 23:22:33', NULL),
(7, 1, '3162bc2bea1756f202607855dc5190d640d470fe7c680cbb705c3d476c782a9e', '2026-03-04 23:39:33', '2026-02-25 23:39:33', NULL),
(8, 1, '10ece281ce46d3d6f88544b3f2cb84c2548c249485ea7a1f2d3e80c53cfa06c4', '2026-03-04 23:52:48', '2026-02-25 23:52:48', NULL),
(9, 1, 'cb106936f510b819d1c00f6f9e6cd49298a154df25876a9655b47e1240762b85', '2026-03-05 00:12:02', '2026-02-26 00:12:02', NULL),
(11, 1, '4a3ac2930371d6dcd9d8af7f1e7b96c81dfd4d43356fa6fe7d3d922887599f15', '2026-03-05 01:08:42', '2026-02-26 01:08:42', NULL),
(12, 1, '90acda85b9839776fa931244db61ee42b6faa05395ce7d9a57fd81ed4a54677c', '2026-03-05 07:53:29', '2026-02-26 07:53:29', NULL),
(16, 1, '03009010ff7c8600d10e37f3354a533abd0d795ec74e417733675af39d898fec', '2026-03-05 10:17:33', '2026-02-26 10:17:33', NULL),
(19, 1, '92cf30584457789324de24600aa4b542de49a6c5308f4946ae25e655f2477eb7', '2026-03-05 11:59:16', '2026-02-26 11:59:16', NULL),
(25, 1, 'a39ce009bb7f41a73b6cf3c2935c66d00a00f6b3ccf07b4fa65e522ec6923543', '2026-03-05 19:30:19', '2026-02-26 19:30:19', NULL),
(31, 1, '027646c482debfe0f4f75775088818fad52b2ef3b8084d0734f0dc91afb1ee4b', '2026-03-06 10:44:56', '2026-02-27 10:44:56', NULL),
(34, 1, '0c75cc32400b137eb833873d316fa85e6facbb6a69e9e16321a9675e8d0780ce', '2026-03-06 10:58:33', '2026-02-27 10:58:33', NULL),
(36, 14, '38eb1b6a52cbee64679129e0fa69ab80fccad060c46b8a4344456ab3d09df7bc', '2026-03-06 13:13:04', '2026-02-27 13:13:04', NULL),
(37, 1, 'd75ec6027c577443782c404048ae016ecc6933996af0756851ce963c7f4ae975', '2026-03-06 13:14:38', '2026-02-27 13:14:38', NULL),
(38, 15, 'e177369309e24c490613746883b1bcf1cd66687c68a2e964380a8ee7f5a8256e', '2026-03-06 14:12:47', '2026-02-27 14:12:47', NULL),
(39, 16, 'f8a20eed11760a8a98e41d9b286fa64bcf52fae7fbd6c77b2576c51c19867d73', '2026-03-06 14:13:29', '2026-02-27 14:13:29', NULL),
(40, 14, '7d934a1441582b4fb12007cf36d128b4ddd091bafb0e47cf563adafcbeb2bb30', '2026-03-06 14:14:30', '2026-02-27 14:14:30', NULL),
(41, 1, 'eef016609f2e3dc4879049c32a2fb0d07044bd2a642171e99f1d25589c1f9bd0', '2026-03-06 14:15:34', '2026-02-27 14:15:34', NULL),
(42, 15, '73cfad95ce2b87a8caba3f2f93fd45c77db1266e90740990c92c7545a6499f9b', '2026-03-06 14:18:24', '2026-02-27 14:18:24', NULL),
(43, 14, 'c0e43f9d89f2f04e8b63225d88547a02dad8c2c8f9ff492eb8af2d56d7374769', '2026-03-06 14:20:57', '2026-02-27 14:20:57', NULL),
(44, 1, 'b94e2a5cadb39ad6721edc338f68a6f82700f8155ca8180fd26666cfeaaa69fd', '2026-03-06 14:29:02', '2026-02-27 14:29:02', NULL),
(45, 1, 'e4f5eead9a8a867cafed4c5a48180c01be6243d78dcc0a75d1614f17ddd05249', '2026-03-06 14:31:48', '2026-02-27 14:31:48', NULL),
(46, 14, '13a9e17e711a365ced490f76c8cb9e9d393b6e3fc4e84bcadef5fe651b2b4b40', '2026-03-06 14:32:31', '2026-02-27 14:32:31', NULL),
(47, 1, '73c25c0ad94943d580184531944e58a180d41911236cdcfd804d6648c781feb5', '2026-03-06 14:32:55', '2026-02-27 14:32:55', NULL),
(48, 14, '07076cad5109aa73b3dead6b2d7b57f0b39bd3b056eac970d0ba2062f66b28cf', '2026-03-06 14:34:32', '2026-02-27 14:34:32', NULL),
(49, 1, 'b99d0fb6727630d484dea732d7d3d7ef01858df596870b4e4ed90bdda2dc1a77', '2026-03-06 17:54:08', '2026-02-27 17:54:08', NULL),
(50, 15, '945deed5fefa1fd306278c2514a5b8d5de4269a97c1182865fa2c9a72de61508', '2026-03-06 17:55:37', '2026-02-27 17:55:37', NULL),
(51, 14, 'b928561d897ffd8a8e4d1361678442fc215ee7af343be504afe0b43f858b2947', '2026-03-06 18:09:25', '2026-02-27 18:09:25', NULL),
(52, 15, '01c75d2f1ed120a87cfcf19cc73f059aec4c64d752e1a783019342b638ea284b', '2026-03-06 18:17:27', '2026-02-27 18:17:27', NULL),
(53, 14, 'f71059644a00ff3014b5fef4d6e0b8a66dbbd6a6101f337727b857588472a816', '2026-03-06 18:19:41', '2026-02-27 18:19:41', NULL),
(54, 1, '0658582d1ffde174fbacde1e66fd66fda42acf953acbe6dfcb9507d5c54b3806', '2026-03-06 19:46:08', '2026-02-27 19:46:08', NULL),
(55, 16, '38ba739acc150ea56d3dc2308ace4319d7b468ec57f204194fd1708a764e5f47', '2026-03-06 19:47:29', '2026-02-27 19:47:29', NULL),
(56, 15, 'fb6edb9a03fa8ba14b81b3ec402ebbfa3b7c2d51fb7ac75d1eeeebaa832c60ec', '2026-03-06 19:48:25', '2026-02-27 19:48:25', NULL),
(57, 14, '86087a7595076273b1ba8e18e8793954196e7577582762f27de9c3f2ed5f4497', '2026-03-06 19:49:02', '2026-02-27 19:49:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `email`, `telefono`, `fecha_registro`) VALUES
(1, 'Camilo Gonzalez', 'cam800@gmail.com', NULL, '2026-02-22 19:34:18'),
(2, 'Alejandro Solis', 'alex@gmail.com', NULL, '2026-02-24 10:17:55'),
(3, 'Juan Arellano', 'arellano.juan.ferjer@gmail.com', NULL, '2026-02-24 10:50:52'),
(4, 'Alex Rodriguez', 'therichy@gmail.com', NULL, '2026-02-24 11:24:45'),
(5, 'Juan Pérez', 'juan@ejemplo.com', NULL, '2026-02-25 20:18:22'),
(6, 'Nombre del cliente', 'cliente@ejemplo.com', NULL, '2026-02-26 01:30:32'),
(7, 'Juan Villacobos', 'villa@gmail.com', NULL, '2026-02-27 10:48:12'),
(8, 'The Gichy', 'thegichy123@gmail.com', NULL, '2026-02-27 14:17:12'),
(9, 'Juan Villacobos', 'villa123@gmail.com', NULL, '2026-02-27 14:34:06');

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
(1, 1, 1, 'Laptop', 'HP', 'La pantalla no enciende', 2, '2026-02-22 19:34:18'),
(2, 2, 2, 'Laptop', 'Lenovo', 'No carga', 3, '2026-02-24 10:17:55'),
(3, 3, 3, 'Laptop', 'HP Victus', 'Pantalla no enciende', 4, '2026-02-24 10:50:52'),
(4, 4, 4, 'Laptop', 'hp', 'cambio pantalla', 3, '2026-02-24 11:24:45'),
(5, 5, 5, 'Laptop', 'HP Pavilion', 'No enciende', 2, '2026-02-25 20:18:22'),
(6, 6, 6, 'Laptop', 'HP Pavilion', 'No enciende', 5, '2026-02-26 01:30:32'),
(7, 7, 7, 'Monitor', 'Samsung', 'No enciende', 4, '2026-02-27 10:48:12'),
(8, 8, 8, 'Laptop', 'HP', 'Le cayo jugo', 1, '2026-02-27 14:17:12'),
(9, 9, 9, 'Laptop', 'HP', 'Cambio Pantalla', 5, '2026-02-27 14:34:06');

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
(1, 1, 1, NULL, 'Equipo registrado', '2026-02-22 19:34:18'),
(2, 1, 4, NULL, 'El equipo esta listo para entregar', '2026-02-23 18:28:57'),
(23, 4, 5, NULL, 'SE ENTREGO', '2026-02-24 21:28:44'),
(24, 1, 4, NULL, 'En proceso', '2026-02-25 19:26:05'),
(25, 5, 1, NULL, 'Equipo registrado', '2026-02-25 20:18:22'),
(26, 1, 2, NULL, 'Prueba final', '2026-02-26 01:27:38'),
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
(39, 9, 5, NULL, 'Cambio de estatus', '2026-02-27 19:48:42');

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
(1, 1, 'Pagado', 4950.00, '2026-02-25 20:58:38', NULL, ''),
(2, 1, 'Entregado', 8650.00, '2026-02-26 01:53:51', NULL, ''),
(6, 14, 'Entregado', 450.00, '2026-02-27 13:13:44', NULL, ''),
(7, 14, 'Pagado', 550.00, '2026-02-27 14:21:25', NULL, ''),
(8, 14, 'Entregado', 1000.00, '2026-02-27 14:27:18', NULL, ''),
(9, 14, 'Pagado', 450.00, '2026-02-27 18:09:30', NULL, ''),
(10, 14, 'Entregado', 450.00, '2026-02-27 18:13:49', NULL, ''),
(11, 14, 'Pendiente', 450.00, '2026-02-27 19:24:12', NULL, NULL);

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
(2, 'Mouse Gamer', 450.00, 5, '', '2026-02-26 03:48:15'),
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
(16, 'Alex Rodriguez', 'alex123@gmail.com', '$2y$10$RhwuSLb0nPfIU6s9fdafUeqMf/XcPQC1SP52S/rby7XVRvfOl/Z66', 'Tecnico', '2026-02-27 13:21:49');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `historial_orden`
--
ALTER TABLE `historial_orden`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `pedido_items`
--
ALTER TABLE `pedido_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
