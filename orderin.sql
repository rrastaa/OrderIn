-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 30, 2026 at 10:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orderin`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `order_id`, `user_id`, `assigned_at`) VALUES
(1, 1, 4, '2026-06-13 16:04:25'),
(2, 3, 2, '2026-06-14 20:32:28'),
(4, 2, 4, '2026-06-14 14:51:32'),
(5, 4, 4, '2026-06-15 02:49:06'),
(6, 6, 4, '2026-06-22 08:38:49'),
(7, 7, 7, '2026-06-30 01:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `nama`, `email`, `no_hp`, `alamat`, `created_at`) VALUES
(1, 'Rasta', NULL, NULL, NULL, '2026-06-13 14:04:09'),
(2, 'Rasta', NULL, NULL, NULL, '2026-06-13 14:04:13'),
(3, 'Rasat', NULL, NULL, NULL, '2026-06-14 17:13:51'),
(4, 'PT. Mike', NULL, NULL, NULL, '2026-06-14 17:34:21'),
(5, 'Constantine', NULL, NULL, NULL, '2026-06-22 15:18:01'),
(6, 'Annodized', NULL, NULL, NULL, '2026-06-22 15:20:01');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pesan` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `pesan`, `is_read`, `created_at`) VALUES
(1, 4, 'Tugas Baru: Kerjakan Order ORD-260613-920 (Kaos Hitam XXL )', 0, '2026-06-13 16:04:25'),
(2, 2, 'Tugas Baru: Kerjakan Order ORD-260614-7AE (Workshirt Navy L)', 0, '2026-06-14 20:32:28'),
(3, 4, 'Tugas Baru: Kerjakan Order ORD-260622-55F (Hoode Beige L)', 0, '2026-06-22 08:38:49'),
(4, 7, 'Tugas Baru: Kerjakan Order ORD-260630-60E (Hoodie Beige L)', 0, '2026-06-30 01:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `kode_order` varchar(50) NOT NULL,
  `jenis_produk` varchar(100) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `deadline` date NOT NULL,
  `status` enum('Pending','Cutting','Sablon','Jahit','QC','Selesai','Dikirim','Deleted') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `selesai` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `kode_order`, `jenis_produk`, `jumlah`, `deadline`, `status`, `created_at`, `selesai`) VALUES
(1, 1, 'ORD-260613-920', 'Kaos Hitam XXL ', 30, '2026-06-22', 'Selesai', '2026-06-13 14:04:09', '2026-06-14 14:45:24'),
(2, 2, 'ORD-260613-832', 'Kaos Hitam XXL ', 30, '2026-06-22', 'Sablon', '2026-06-13 14:04:13', NULL),
(3, 4, 'ORD-260614-7AE', 'Workshirt Navy XS', 12, '2026-06-25', 'Selesai', '2026-06-14 10:35:17', '2026-06-14 14:55:45'),
(4, 1, 'ORD-260615-256', 'Sweater Putih L', 16, '2026-06-29', 'Deleted', '2026-06-15 02:36:24', NULL),
(5, 5, 'ORD-260622-A22', 'Jersey Manchester United L', 24, '2026-07-03', 'Deleted', '2026-06-22 08:19:21', NULL),
(6, 5, 'ORD-260622-55F', 'Hoode Beige L', 14, '2026-07-01', 'Deleted', '2026-06-22 08:23:15', NULL),
(7, 5, 'ORD-260630-60E', 'Hoodie Beige L', 14, '2026-07-10', 'Cutting', '2026-06-30 01:13:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `progress_logs`
--

CREATE TABLE `progress_logs` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `progress_logs`
--

INSERT INTO `progress_logs` (`id`, `order_id`, `user_id`, `status`, `catatan`, `created_at`) VALUES
(1, 1, 4, 'Cutting', '', '2026-06-14 17:39:05'),
(2, 2, 4, 'Sablon', '', '2026-06-14 21:51:46'),
(3, 3, 2, 'Sablon', '', '2026-06-14 21:53:17'),
(4, 3, 2, 'Selesai', '', '2026-06-14 21:53:58'),
(5, 2, 4, 'Sablon', NULL, '2026-06-19 13:04:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('owner','produksi') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Owner', 'owner', '$2y$12$k.biBcYz5L1aChhuq2v30.73Y.6wpqaniqauOg1hVUUwC5I0GAtsy', 'owner', '2026-06-10 18:12:14'),
(2, 'Produksi 1', 'produksi1', '$2y$12$k.biBcYz5L1aChhuq2v30.73Y.6wpqaniqauOg1hVUUwC5I0GAtsy', 'produksi', '2026-06-10 18:12:14'),
(3, 'Andi', 'andi', '$2y$12$k.biBcYz5L1aChhuq2v30.73Y.6wpqaniqauOg1hVUUwC5I0GAtsy', 'owner', '2026-06-10 18:12:14'),
(4, 'Agus', 'agus', '$2y$12$k.biBcYz5L1aChhuq2v30.73Y.6wpqaniqauOg1hVUUwC5I0GAtsy', 'produksi', '2026-06-10 18:12:14'),
(5, 'Mike', 'mike', '$2y$12$i0kAIzVWVa1rwq1RWnbpPuhx5TaBx6WqSKlkqKxKmSC7TdOUX8EoS', 'produksi', '2026-06-23 13:29:26'),
(7, 'Worker', 'worker', '$2y$12$KTUKa2Z8.51VyHsEogWh1Osq2Pr/.lzTuDFxLydBgYQDQgPFMSIXe', 'produksi', '2026-06-23 14:15:08'),
(8, 'Owner Kedua', 'owner2', '$2y$12$SBHMkojQN6JaegBeu9a2yupqxijeKBMDdvifymzXTiZxXk85VySAq', 'owner', '2026-06-23 14:16:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_order` (`kode_order`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `progress_logs`
--
ALTER TABLE `progress_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `progress_logs`
--
ALTER TABLE `progress_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `progress_logs`
--
ALTER TABLE `progress_logs`
  ADD CONSTRAINT `progress_logs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `progress_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
