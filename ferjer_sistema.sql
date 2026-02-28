-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 02:41 PM
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
(4, 'Alex Rodriguez', 'therichy@gmail.com', NULL, '2026-02-24 11:24:45');

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
(1, 1, 1, 'Laptop', 'HP', 'La pantalla no enciende', 3, '2026-02-22 19:34:18'),
(2, 2, 2, 'Laptop', 'Lenovo', 'No carga', 5, '2026-02-24 10:17:55'),
(3, 3, 3, 'Laptop', 'HP Victus', 'Pantalla no enciende', 2, '2026-02-24 10:50:52'),
(4, 4, 4, 'Laptop', 'hp', 'cambio pantalla', 5, '2026-02-24 11:24:45');

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
(23, 4, 5, NULL, 'SE ENTREGO', '2026-02-24 21:28:44');

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
(1, 'Bocina', 550.00, 4, NULL, '2026-02-24 10:23:54');

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
(2, 'Juan Arellano', 'arellano.juan.ferjer@gmail.com', '$2y$10$AInxjihhh/1WVIDMdoJG1uvE/FZn1lHx6xnmV.RnZ8mrFRkugJpKG', 'Cliente', '2026-02-24 07:46:10'),
(3, 'Alex Rodriguez', 'therichy@gmail.com', '$2y$10$LbSwqntAElEl7sQ4D8jog.Frf77LUlSVq30adNCT5uiQhzqbY7/fW', 'Cliente', '2026-02-24 11:23:31'),
(4, 'Alex Viera', 'therichyadmin@gmail.com', '$2y$10$whmtEkt8v7BpjY.x.lxxWuQJ9SwMVk19or3yc08DgO09juU3Z0X2K', 'Administrador', '2026-02-24 11:47:56'),
(6, 'Técnico Test', 'tecnico@test.com', '$2y$10$4xQd6AyiZC05./Xsu7u5g.Dn.GMSTlMCgceSPfgwTIRApbHYQcmi.', 'Tecnico', '2026-02-24 21:16:38'),
(7, 'Empleado Test', 'empleado@test.com', '$2y$10$4xQd6AyiZC05./Xsu7u5g.Dn.GMSTlMCgceSPfgwTIRApbHYQcmi.', 'Empleado', '2026-02-24 21:16:38'),
(8, 'Cliente Test', 'cliente@test.com', '$2y$10$4xQd6AyiZC05./Xsu7u5g.Dn.GMSTlMCgceSPfgwTIRApbHYQcmi.', 'Cliente', '2026-02-24 21:16:38');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `historial_orden`
--
ALTER TABLE `historial_orden`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pedido_items`
--
ALTER TABLE `pedido_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

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
