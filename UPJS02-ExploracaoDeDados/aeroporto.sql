-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 16, 2022 at 02:55 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aeroporto`
--

-- --------------------------------------------------------

--
-- Table structure for table `aeroporto`
--

CREATE TABLE `aeroporto` (
  `Sigla_Aeroporto` char(3) COLLATE latin1_bin NOT NULL,
  `Cidade` varchar(50) COLLATE latin1_bin NOT NULL,
  `Nome_Aeroporto` varchar(50) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `aeroporto`
--

INSERT INTO `aeroporto` (`Sigla_Aeroporto`, `Cidade`, `Nome_Aeroporto`) VALUES
('BCN', 'Barcelona', 'El Prat'),
('BEI', 'Beijin', 'Xing Ling'),
('DUS', 'Dusseldorf', 'West Falia'),
('FAR', 'Faro', 'Gago Coutinho'),
('LIS', 'Lisboa', 'Humberto Delgado'),
('MAD', 'Madrid', 'Barajas'),
('NYC', 'Nova Iorque', 'New York Airport'),
('OPO', 'Porto', 'Francisco Sá Carneiro'),
('PAR', 'Paris', 'Orly'),
('RIO', 'Rio de Janeiro', 'Galeão'),
('SPA', 'São Paulo', 'Congonhas');

-- --------------------------------------------------------

--
-- Table structure for table `assento`
--

CREATE TABLE `assento` (
  `Numero_Fila` int(11) NOT NULL,
  `Lugar` char(1) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `assento`
--

INSERT INTO `assento` (`Numero_Fila`, `Lugar`) VALUES
(1, 'A'),
(1, 'B'),
(1, 'C'),
(1, 'D'),
(2, 'A'),
(2, 'B'),
(2, 'C'),
(2, 'D'),
(3, 'A'),
(3, 'B'),
(3, 'C'),
(3, 'D'),
(4, 'A'),
(4, 'B'),
(4, 'C'),
(4, 'D');

-- --------------------------------------------------------

--
-- Table structure for table `aviao`
--

CREATE TABLE `aviao` (
  `Aviao_ID` int(11) NOT NULL,
  `Modelo_ID` int(11) NOT NULL,
  `Sigla_Companhia` char(2) COLLATE latin1_bin NOT NULL,
  `Nome_Aviao` varchar(20) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `aviao`
--

INSERT INTO `aviao` (`Aviao_ID`, `Modelo_ID`, `Sigla_Companhia`, `Nome_Aviao`) VALUES
(2453, 777, 'TP', 'Amalia Rodrigues'),
(2455, 777, 'TP', 'Rainha Isabel ll'),
(2456, 320, 'FR', 'Cristovão Colombo'),
(2457, 320, 'FR', 'Vera Cruz'),
(2458, 320, 'FR', 'Pelé'),
(2459, 320, 'FR', 'Vasco da Gama'),
(2460, 320, 'FR', 'King Charles'),
(2461, 320, 'IB', 'Juanes'),
(2462, 320, 'IB', 'Shakira'),
(2463, 777, 'AZ', 'Azulzinho'),
(2464, 777, 'AZ', 'Brasileiro');

-- --------------------------------------------------------

--
-- Table structure for table `bilhete`
--

CREATE TABLE `bilhete` (
  `Numero_Bilhete` int(11) NOT NULL,
  `Numero_Doc` int(11) NOT NULL,
  `Numero_Voo` int(11) NOT NULL,
  `Data` date NOT NULL,
  `Hora` time NOT NULL,
  `Numero_Fila` int(11) NOT NULL,
  `Lugar` char(1) COLLATE latin1_bin NOT NULL,
  `Tipo_Bilhete` enum('exec','econ','prim','') COLLATE latin1_bin NOT NULL,
  `Bagagem` int(11) NOT NULL,
  `Preco` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `bilhete`
--

INSERT INTO `bilhete` (`Numero_Bilhete`, `Numero_Doc`, `Numero_Voo`, `Data`, `Hora`, `Numero_Fila`, `Lugar`, `Tipo_Bilhete`, `Bagagem`, `Preco`) VALUES
(1000, 8766860, 1500, '2022-09-15', '15:00:00', 1, 'D', 'exec', 2, 100),
(1001, 1150863, 1691, '2022-09-12', '22:00:00', 2, 'A', 'econ', 2, 35.5),
(1002, 1150862, 1691, '2022-09-12', '22:00:00', 1, 'B', 'econ', 2, 37.5),
(1003, 1150813, 1691, '2022-09-12', '22:00:00', 1, 'A', 'exec', 3, 100),
(1004, 1150860, 1691, '2022-09-17', '22:00:00', 4, 'B', 'econ', 1, 40.7),
(1005, 1150861, 1691, '2022-09-17', '22:00:00', 4, 'A', 'exec', 0, 125.4),
(1006, 1150811, 1691, '2022-09-17', '22:00:00', 4, 'B', 'econ', 1, 25),
(1007, 1150811, 1777, '2022-09-14', '14:00:00', 1, 'A', 'prim', 4, 350),
(1008, 1150858, 1777, '2022-09-14', '14:00:00', 1, 'B', 'prim', 3, 400),
(1009, 1150813, 1777, '2022-09-14', '14:00:00', 1, 'A', 'prim', 2, 200),
(1010, 1150812, 1777, '2022-09-14', '14:00:00', 2, 'B', 'prim', 3, 300.5),
(1011, 1150866, 1691, '2022-09-12', '22:00:00', 4, 'B', 'exec', 2, 150.5),
(2000, 1150866, 1500, '2022-09-15', '15:00:00', 1, 'A', 'prim', 3, 200),
(2001, 1150875, 1500, '2022-09-15', '15:00:00', 2, 'D', 'econ', 4, 60),
(2002, 8766860, 1500, '2022-09-15', '15:00:00', 1, 'D', 'exec', 2, 100),
(2003, 8766861, 1500, '2022-09-15', '15:00:00', 3, 'A', 'exec', 3, 120),
(2004, 8766862, 1500, '2022-09-15', '15:00:00', 3, 'D', 'prim', 3, 180),
(2010, 8766863, 1501, '2022-09-14', '11:00:00', 1, 'A', 'exec', 2, 150),
(2011, 8766867, 1501, '2022-09-14', '11:00:00', 2, 'A', 'prim', 3, 180),
(3000, 1150881, 1800, '2022-09-13', '15:30:00', 1, 'A', 'exec', 3, 200),
(3001, 1150880, 1801, '2022-09-14', '15:00:00', 1, 'D', 'econ', 2, 200),
(4000, 8766871, 1644, '2022-09-15', '09:00:00', 1, 'A', 'econ', 2, 40),
(4001, 8766872, 1645, '2022-09-16', '09:00:00', 1, 'D', 'prim', 2, 300);

-- --------------------------------------------------------

--
-- Table structure for table `cidade`
--

CREATE TABLE `cidade` (
  `Cidade` varchar(50) COLLATE latin1_bin NOT NULL,
  `Pais` varchar(50) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `cidade`
--

INSERT INTO `cidade` (`Cidade`, `Pais`) VALUES
('Berlin', 'Alemanha'),
('Dusseldorf', 'Alemanha'),
('Rio de Janeiro', 'Brasil'),
('São Paulo', 'Brasil'),
('Beijin', 'China'),
('Nova Iorque', 'EUA'),
('Barcelona', 'Espanha'),
('Madrid', 'Espanha'),
('Paris', 'França'),
('Faro', 'Portugal'),
('Lisboa', 'Portugal'),
('Porto', 'Portugal');

-- --------------------------------------------------------

--
-- Table structure for table `companhia_aerea`
--

CREATE TABLE `companhia_aerea` (
  `Sigla_Companhia` char(2) COLLATE latin1_bin NOT NULL,
  `Nome_Companhia` varchar(20) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `companhia_aerea`
--

INSERT INTO `companhia_aerea` (`Sigla_Companhia`, `Nome_Companhia`) VALUES
('AZ', 'Azul'),
('CH', 'Quantas'),
('EJ', 'Easy Jet'),
('ET', 'Ethiad'),
('EW', 'Euro Wings'),
('FR', 'Raynair'),
('GL', 'Gol'),
('GW', 'Germany Wings'),
('IB', 'IBERIA'),
('LF', 'Lufthansa'),
('TP', 'TAP');

-- --------------------------------------------------------

--
-- Table structure for table `fila`
--

CREATE TABLE `fila` (
  `Numero_Fila` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `fila`
--

INSERT INTO `fila` (`Numero_Fila`) VALUES
(1),
(2),
(3),
(4),
(5);

-- --------------------------------------------------------

--
-- Table structure for table `historico`
--

CREATE TABLE `historico` (
  `Trip_ID` int(11) NOT NULL,
  `Numero_Voo` int(11) NOT NULL,
  `Data` date NOT NULL,
  `Hora` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `historico`
--

INSERT INTO `historico` (`Trip_ID`, `Numero_Voo`, `Data`, `Hora`) VALUES
(11507, 1777, '2022-09-14', '14:00:00'),
(11508, 1690, '2022-09-13', '15:00:00'),
(11508, 1691, '2022-09-12', '22:00:00'),
(11508, 1777, '2022-09-14', '14:00:00'),
(11509, 1633, '2022-09-10', '10:00:00'),
(11509, 1691, '2022-09-17', '22:00:00'),
(11509, 1778, '2022-09-14', '23:00:00'),
(11510, 1691, '2022-09-12', '22:00:00'),
(11510, 1778, '2022-09-14', '23:00:00'),
(11512, 1633, '2022-09-10', '10:00:00'),
(11512, 1691, '2022-09-17', '22:00:00'),
(11513, 1500, '2022-09-14', '15:00:00'),
(11514, 1500, '2022-09-14', '15:00:00'),
(11515, 1501, '2022-09-14', '11:00:00'),
(11516, 1644, '2022-09-15', '09:00:00'),
(11517, 1645, '2022-09-16', '09:00:00'),
(11518, 1691, '2022-09-12', '22:00:00'),
(11518, 1691, '2022-09-17', '22:00:00'),
(11519, 1800, '2022-09-13', '15:30:00'),
(11520, 1801, '2022-09-14', '15:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `horario`
--

CREATE TABLE `horario` (
  `Numero_Voo` int(11) NOT NULL,
  `Data` date NOT NULL,
  `Hora` time NOT NULL,
  `Aviao_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `horario`
--

INSERT INTO `horario` (`Numero_Voo`, `Data`, `Hora`, `Aviao_ID`) VALUES
(1800, '2022-09-13', '15:30:00', 2453),
(1801, '2022-09-14', '15:00:00', 2455),
(1633, '2022-09-10', '10:00:00', 2456),
(1634, '2022-09-14', '14:00:00', 2456),
(1690, '2022-09-13', '15:00:00', 2457),
(1691, '2022-09-12', '22:00:00', 2458),
(1691, '2022-09-17', '22:00:00', 2458),
(1777, '2022-09-14', '14:00:00', 2459),
(1778, '2022-09-14', '23:00:00', 2460),
(1644, '2022-09-15', '09:00:00', 2461),
(1645, '2022-09-16', '09:00:00', 2462),
(1500, '2022-09-15', '15:00:00', 2463),
(1501, '2022-09-14', '11:00:00', 2463),
(1500, '2022-09-14', '15:00:00', 2464);

-- --------------------------------------------------------

--
-- Table structure for table `modelo`
--

CREATE TABLE `modelo` (
  `Modelo_ID` int(11) NOT NULL,
  `Codigo_Modelo` char(4) COLLATE latin1_bin NOT NULL,
  `Capacidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `modelo`
--

INSERT INTO `modelo` (`Modelo_ID`, `Codigo_Modelo`, `Capacidade`) VALUES
(320, 'A320', 8),
(321, 'A321', 10),
(322, 'A322', 10),
(330, 'A330', 10),
(340, 'A340', 10),
(350, 'A350', 15),
(737, 'A737', 15),
(750, 'B750', 10),
(760, 'B760', 15),
(777, 'B777', 16);

-- --------------------------------------------------------

--
-- Table structure for table `modelo_assento`
--

CREATE TABLE `modelo_assento` (
  `Modelo_ID` int(11) NOT NULL,
  `Numero_Fila` int(11) NOT NULL,
  `Lugar` char(1) COLLATE latin1_bin NOT NULL,
  `Posicao` char(10) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `modelo_assento`
--

INSERT INTO `modelo_assento` (`Modelo_ID`, `Numero_Fila`, `Lugar`, `Posicao`) VALUES
(320, 1, 'A', 'Janela'),
(320, 1, 'B', 'Corredor'),
(320, 2, 'A', 'Janela'),
(320, 2, 'B', 'Corredor'),
(320, 3, 'A', 'Janela'),
(320, 3, 'B', 'Corredor'),
(320, 4, 'A', 'Janela'),
(320, 4, 'B', 'Corredor'),
(777, 1, 'A', 'Janela'),
(777, 1, 'B', 'Corredor'),
(777, 1, 'C', 'Corredor'),
(777, 1, 'D', 'Janela'),
(777, 2, 'A', 'Janela'),
(777, 2, 'B', 'Corredor'),
(777, 2, 'C', 'Corredor'),
(777, 2, 'D', 'Janela'),
(777, 3, 'A', 'Janela'),
(777, 3, 'B', 'Corredor'),
(777, 3, 'C', 'Corredor'),
(777, 3, 'D', 'Janela'),
(777, 4, 'A', 'Janela'),
(777, 4, 'B', 'Corredor'),
(777, 4, 'C', 'Corredor'),
(777, 4, 'D', 'Janela');

-- --------------------------------------------------------

--
-- Table structure for table `pais`
--

CREATE TABLE `pais` (
  `Pais` varchar(50) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `pais`
--

INSERT INTO `pais` (`Pais`) VALUES
('Alemanha'),
('Brasil'),
('China'),
('EUA'),
('Espanha'),
('França'),
('Portugal');

-- --------------------------------------------------------

--
-- Table structure for table `passageiro`
--

CREATE TABLE `passageiro` (
  `Numero_Doc` int(11) NOT NULL,
  `Nome` varchar(50) COLLATE latin1_bin NOT NULL,
  `Apelido` varchar(50) COLLATE latin1_bin NOT NULL,
  `Tipo_Doc` varchar(20) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `passageiro`
--

INSERT INTO `passageiro` (`Numero_Doc`, `Nome`, `Apelido`, `Tipo_Doc`) VALUES
(1150811, 'Nuno', 'Santos', 'CC'),
(1150812, 'Joao ', 'Neves', 'CC'),
(1150813, 'Eder', 'Tolentino', 'Passaporte'),
(1150858, 'Luis', 'Filipe', 'CC'),
(1150859, 'João ', 'Afonso', 'CC'),
(1150860, 'Fernando', 'Silva', 'CC'),
(1150861, 'João', 'Canede', 'CC'),
(1150862, 'Carlos', 'Oliveira', 'CC'),
(1150863, 'António', 'Nobre', 'CC'),
(1150864, 'Maria', 'Tereza', 'CC'),
(1150865, 'Rita', 'Maria', 'CC'),
(1150866, 'Angela', 'Neves', 'CC'),
(1150867, 'Tiago', 'da Silva', 'CC'),
(1150868, 'Raquel', 'Pereira', 'CC'),
(1150869, 'Hellen', 'da Silva', 'CC'),
(1150870, 'Cátia', 'Santos', 'CC'),
(1150871, 'Joana', 'Alves', 'CC'),
(1150872, 'Paula', 'Alves', 'CC'),
(1150873, 'Cristina', 'Alves', 'CC'),
(1150875, 'Eduarda', 'Amaranto', 'Passaporte'),
(1150880, 'Mariana', 'Pereira', 'CC'),
(1150881, 'Pedro', 'Pereira', 'CC'),
(8766859, 'Maria', 'Luiza', 'CC'),
(8766860, 'Priscilla', 'Hatten', 'CC'),
(8766861, 'Sarah', 'Fernandes', 'CC'),
(8766862, 'Victor', 'Martins', 'CC'),
(8766863, 'José', 'Antunes', 'CC'),
(8766867, 'Matheus', 'Fernandes', 'CC'),
(8766871, 'Filipe', 'Nunes', 'CC'),
(8766872, 'João', 'Santana', 'CC');

-- --------------------------------------------------------

--
-- Table structure for table `rota`
--

CREATE TABLE `rota` (
  `Rota_ID` char(7) COLLATE latin1_bin NOT NULL,
  `Sigla_Aeroporto_Origem` char(3) COLLATE latin1_bin NOT NULL,
  `Sigla_Aeroporto_Destino` char(3) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `rota`
--

INSERT INTO `rota` (`Rota_ID`, `Sigla_Aeroporto_Origem`, `Sigla_Aeroporto_Destino`) VALUES
('BCN-LIS', 'BCN', 'LIS'),
('DUS-LIS', 'DUS', 'LIS'),
('FAR-OPO', 'FAR', 'OPO'),
('LIS-BCN', 'LIS', 'BCN'),
('LIS-DUS', 'LIS', 'DUS'),
('LIS-FAR', 'LIS', 'FAR'),
('LIS-MAD', 'LIS', 'MAD'),
('LIS-OPO', 'LIS', 'OPO'),
('MAD-LIS', 'MAD', 'LIS'),
('OPO-FAR', 'OPO', 'FAR'),
('OPO-LIS', 'OPO', 'LIS'),
('RIO-SPA', 'RIO', 'SPA'),
('SPA-RIO', 'SPA', 'RIO');

-- --------------------------------------------------------

--
-- Table structure for table `tripulante`
--

CREATE TABLE `tripulante` (
  `Trip_ID` int(11) NOT NULL,
  `Sigla_Companhia` char(2) COLLATE latin1_bin NOT NULL,
  `Nome` varchar(20) COLLATE latin1_bin NOT NULL,
  `Apelido` varchar(20) COLLATE latin1_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `tripulante`
--

INSERT INTO `tripulante` (`Trip_ID`, `Sigla_Companhia`, `Nome`, `Apelido`) VALUES
(11507, 'FR', 'Cláudio', 'Braga'),
(11508, 'FR', 'Jaime', 'Ribeiro'),
(11509, 'FR', 'Vanessa', 'Ávila'),
(11510, 'FR', 'Tiago', 'Oliveirinha'),
(11512, 'FR', 'Margarida', 'Rocha'),
(11513, 'AZ', 'Rita', 'Isabel'),
(11514, 'AZ', 'Felício', 'Zuca'),
(11515, 'AZ', 'Luísa', 'Domingues'),
(11516, 'IB', 'João', 'Antão'),
(11517, 'IB', 'José', 'Serro'),
(11518, 'IB', 'Raquel', 'Félix'),
(11519, 'TP', 'Mario', 'Pereira'),
(11520, 'TP', 'Clara', 'Oliveira');

-- --------------------------------------------------------

--
-- Table structure for table `voo`
--

CREATE TABLE `voo` (
  `Numero_Voo` int(11) NOT NULL,
  `Rota_ID` char(7) COLLATE latin1_bin NOT NULL,
  `Sigla_Companhia` char(2) COLLATE latin1_bin NOT NULL,
  `Duracao` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Dumping data for table `voo`
--

INSERT INTO `voo` (`Numero_Voo`, `Rota_ID`, `Sigla_Companhia`, `Duracao`) VALUES
(1500, 'SPA-RIO', 'AZ', '00:40:00'),
(1501, 'RIO-SPA', 'AZ', '00:40:00'),
(1633, 'LIS-MAD', 'FR', '01:30:00'),
(1634, 'MAD-LIS', 'FR', '01:00:00'),
(1644, 'LIS-MAD', 'IB', '01:00:00'),
(1645, 'MAD-LIS', 'IB', '01:00:00'),
(1690, 'LIS-OPO', 'FR', '02:15:00'),
(1691, 'OPO-LIS', 'FR', '01:15:00'),
(1777, 'DUS-LIS', 'FR', '01:00:00'),
(1778, 'LIS-DUS', 'FR', '02:15:00'),
(1800, 'MAD-LIS', 'TP', '01:00:00'),
(1801, 'LIS-MAD', 'TP', '01:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aeroporto`
--
ALTER TABLE `aeroporto`
  ADD PRIMARY KEY (`Sigla_Aeroporto`),
  ADD KEY `Cidade` (`Cidade`);

--
-- Indexes for table `assento`
--
ALTER TABLE `assento`
  ADD PRIMARY KEY (`Numero_Fila`,`Lugar`);

--
-- Indexes for table `aviao`
--
ALTER TABLE `aviao`
  ADD PRIMARY KEY (`Aviao_ID`),
  ADD KEY `Sigla_Companhia` (`Sigla_Companhia`),
  ADD KEY `Modelo_ID` (`Modelo_ID`);

--
-- Indexes for table `bilhete`
--
ALTER TABLE `bilhete`
  ADD PRIMARY KEY (`Numero_Bilhete`),
  ADD KEY `Numero_Doc` (`Numero_Doc`),
  ADD KEY `Numero_Voo` (`Numero_Voo`,`Data`,`Hora`),
  ADD KEY `Numero_Fila` (`Numero_Fila`,`Lugar`);

--
-- Indexes for table `cidade`
--
ALTER TABLE `cidade`
  ADD PRIMARY KEY (`Cidade`),
  ADD KEY `Pais` (`Pais`);

--
-- Indexes for table `companhia_aerea`
--
ALTER TABLE `companhia_aerea`
  ADD PRIMARY KEY (`Sigla_Companhia`);

--
-- Indexes for table `fila`
--
ALTER TABLE `fila`
  ADD PRIMARY KEY (`Numero_Fila`);

--
-- Indexes for table `historico`
--
ALTER TABLE `historico`
  ADD PRIMARY KEY (`Trip_ID`,`Numero_Voo`,`Data`,`Hora`),
  ADD KEY `Numero_Voo` (`Numero_Voo`,`Data`,`Hora`);

--
-- Indexes for table `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`Numero_Voo`,`Data`,`Hora`),
  ADD KEY `Aviao_ID` (`Aviao_ID`);

--
-- Indexes for table `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`Modelo_ID`);

--
-- Indexes for table `modelo_assento`
--
ALTER TABLE `modelo_assento`
  ADD PRIMARY KEY (`Modelo_ID`,`Numero_Fila`,`Lugar`),
  ADD KEY `Numero_Fila` (`Numero_Fila`,`Lugar`);

--
-- Indexes for table `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`Pais`);

--
-- Indexes for table `passageiro`
--
ALTER TABLE `passageiro`
  ADD PRIMARY KEY (`Numero_Doc`);

--
-- Indexes for table `rota`
--
ALTER TABLE `rota`
  ADD PRIMARY KEY (`Rota_ID`),
  ADD KEY `rota_ibfk_1` (`Sigla_Aeroporto_Origem`),
  ADD KEY `rota_ibfk_2` (`Sigla_Aeroporto_Destino`);

--
-- Indexes for table `tripulante`
--
ALTER TABLE `tripulante`
  ADD PRIMARY KEY (`Trip_ID`),
  ADD KEY `Sigla_Companhia` (`Sigla_Companhia`);

--
-- Indexes for table `voo`
--
ALTER TABLE `voo`
  ADD PRIMARY KEY (`Numero_Voo`),
  ADD KEY `Rota_ID` (`Rota_ID`),
  ADD KEY `Sigla_Companhia` (`Sigla_Companhia`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aeroporto`
--
ALTER TABLE `aeroporto`
  ADD CONSTRAINT `aeroporto_ibfk_1` FOREIGN KEY (`Cidade`) REFERENCES `cidade` (`Cidade`) ON UPDATE CASCADE,
  ADD CONSTRAINT `aeroporto_ibfk_2` FOREIGN KEY (`Cidade`) REFERENCES `cidade` (`Cidade`) ON UPDATE CASCADE;

--
-- Constraints for table `assento`
--
ALTER TABLE `assento`
  ADD CONSTRAINT `assento_ibfk_1` FOREIGN KEY (`Numero_Fila`) REFERENCES `fila` (`Numero_Fila`) ON UPDATE CASCADE;

--
-- Constraints for table `aviao`
--
ALTER TABLE `aviao`
  ADD CONSTRAINT `aviao_ibfk_2` FOREIGN KEY (`Sigla_Companhia`) REFERENCES `companhia_aerea` (`Sigla_Companhia`) ON UPDATE CASCADE,
  ADD CONSTRAINT `aviao_ibfk_3` FOREIGN KEY (`Modelo_ID`) REFERENCES `modelo` (`Modelo_ID`) ON UPDATE CASCADE;

--
-- Constraints for table `bilhete`
--
ALTER TABLE `bilhete`
  ADD CONSTRAINT `bilhete_ibfk_1` FOREIGN KEY (`Numero_Doc`) REFERENCES `passageiro` (`Numero_Doc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bilhete_ibfk_2` FOREIGN KEY (`Numero_Voo`,`Data`,`Hora`) REFERENCES `horario` (`Numero_Voo`, `Data`, `Hora`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bilhete_ibfk_3` FOREIGN KEY (`Numero_Fila`,`Lugar`) REFERENCES `assento` (`Numero_Fila`, `Lugar`) ON UPDATE CASCADE;

--
-- Constraints for table `cidade`
--
ALTER TABLE `cidade`
  ADD CONSTRAINT `cidade_ibfk_1` FOREIGN KEY (`Pais`) REFERENCES `pais` (`Pais`) ON UPDATE CASCADE;

--
-- Constraints for table `historico`
--
ALTER TABLE `historico`
  ADD CONSTRAINT `historico_ibfk_1` FOREIGN KEY (`Trip_ID`) REFERENCES `tripulante` (`Trip_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `historico_ibfk_2` FOREIGN KEY (`Numero_Voo`,`Data`,`Hora`) REFERENCES `horario` (`Numero_Voo`, `Data`, `Hora`) ON UPDATE CASCADE;

--
-- Constraints for table `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`Numero_Voo`) REFERENCES `voo` (`Numero_Voo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `horario_ibfk_2` FOREIGN KEY (`Aviao_ID`) REFERENCES `aviao` (`Aviao_ID`);

--
-- Constraints for table `modelo_assento`
--
ALTER TABLE `modelo_assento`
  ADD CONSTRAINT `modelo_assento_ibfk_1` FOREIGN KEY (`Modelo_ID`) REFERENCES `modelo` (`Modelo_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `modelo_assento_ibfk_2` FOREIGN KEY (`Numero_Fila`,`Lugar`) REFERENCES `assento` (`Numero_Fila`, `Lugar`) ON UPDATE CASCADE;

--
-- Constraints for table `rota`
--
ALTER TABLE `rota`
  ADD CONSTRAINT `rota_ibfk_1` FOREIGN KEY (`Sigla_Aeroporto_Origem`) REFERENCES `aeroporto` (`Sigla_Aeroporto`) ON UPDATE CASCADE,
  ADD CONSTRAINT `rota_ibfk_2` FOREIGN KEY (`Sigla_Aeroporto_Destino`) REFERENCES `aeroporto` (`Sigla_Aeroporto`) ON UPDATE CASCADE;

--
-- Constraints for table `tripulante`
--
ALTER TABLE `tripulante`
  ADD CONSTRAINT `tripulante_ibfk_1` FOREIGN KEY (`Sigla_Companhia`) REFERENCES `companhia_aerea` (`Sigla_Companhia`) ON UPDATE CASCADE;

--
-- Constraints for table `voo`
--
ALTER TABLE `voo`
  ADD CONSTRAINT `voo_ibfk_1` FOREIGN KEY (`Rota_ID`) REFERENCES `rota` (`Rota_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `voo_ibfk_2` FOREIGN KEY (`Sigla_Companhia`) REFERENCES `companhia_aerea` (`Sigla_Companhia`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
