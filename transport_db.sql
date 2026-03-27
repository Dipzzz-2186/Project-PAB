-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 27 Mar 2026 pada 07.37
-- Versi server: 8.0.42
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transport_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `billings`
--

CREATE TABLE `billings` (
  `id` int NOT NULL,
  `contract_id` int NOT NULL,
  `amount` bigint NOT NULL,
  `billing_date` date NOT NULL,
  `status` enum('unpaid','paid','overdue') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `contracts`
--

CREATE TABLE `contracts` (
  `id` int NOT NULL,
  `client_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` bigint DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contract_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_type` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plate_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_count` int DEFAULT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_price` bigint DEFAULT NULL,
  `ppn` bigint DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `branch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pic` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `contracts`
--

INSERT INTO `contracts` (`id`, `client_name`, `price`, `status`, `start_date`, `end_date`, `created_by`, `created_at`, `updated_at`, `contract_number`, `brand`, `car_type`, `plate_number`, `unit_count`, `year`, `base_price`, `ppn`, `total_price`, `branch`, `area`, `pic`, `notes`) VALUES
(1, 'PT. Jaya', 200000000, 'completed', '2026-02-24', '2026-03-24', NULL, '2026-02-24 03:26:32', '2026-02-24 03:31:24', 'FCOM-9182-JOK', 'Ferrari', 'SF90', 'B 1081 UOA', 1, '2023', 150000000, 10000000, NULL, 'Jakarta', 'Jakarta', 'Rojak', 'sudah ya');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('yFUVVsjonV5bjl8oFNirwbmTN8xlqX4q', '2026-03-03 04:02:00', '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-03-03T03:42:50.184Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"name\":\"Super Admin\",\"email\":\"admin@fcom.com\",\"role\":\"super_admin\"}}', '2026-02-24 03:42:50', '2026-02-24 04:02:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('superadmin','commercial','ops','finance') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@fcom.com', '$2a$12$oS.b/vomjKYUX.qycvnMSup5sm5MxXF1mLeIAutQiakY2k5sunESC', 'superadmin', '2026-02-16 03:18:19', '2026-02-24 02:47:17'),
(2, 'Commercial User', 'comersial@fcom.com', '$2a$12$oS.b/vomjKYUX.qycvnMSup5sm5MxXF1mLeIAutQiakY2k5sunESC', 'commercial', '2026-02-16 03:18:19', '2026-02-24 02:48:12'),
(3, 'Operational User', 'ops@fcom.com', '$2a$12$oS.b/vomjKYUX.qycvnMSup5sm5MxXF1mLeIAutQiakY2k5sunESC', 'ops', '2026-02-16 03:18:19', '2026-02-24 02:47:23'),
(4, 'Finance User', 'finance@fcom.com', '$2a$12$oS.b/vomjKYUX.qycvnMSup5sm5MxXF1mLeIAutQiakY2k5sunESC', 'finance', '2026-02-16 03:18:19', '2026-02-24 02:47:27');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `billings`
--
ALTER TABLE `billings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_billing_contract` (`contract_id`);

--
-- Indeks untuk tabel `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contract_user` (`created_by`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `billings`
--
ALTER TABLE `billings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `billings`
--
ALTER TABLE `billings`
  ADD CONSTRAINT `fk_billing_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `fk_contract_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
