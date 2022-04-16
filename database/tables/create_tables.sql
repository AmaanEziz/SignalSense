SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=`ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION`;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema signal_dev1-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema signal_dev1-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS signal_dev1 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE signal_dev1 ;

-- -----------------------------------------------------
-- Table signal_dev1.Intersection
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.Intersection (
  intersectionID VARCHAR(36) NOT NULL,
  latitude DECIMAL(3,3) NULL DEFAULT NULL,
  longitude DECIMAL(3,3) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (intersectionID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signa_dev1.Street
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.Street (
  streetID VARCHAR(36) NOT NULL,
  streetName VARCHAR(45) NULL DEFAULT NULL,
  streetDirection VARCHAR(45) NULL DEFAULT NULL,
  beginLatitude DECIMAL(3,3) NULL DEFAULT NULL,
  beginLongitude DECIMAL(3,3) NULL DEFAULT NULL,
  endLatitude DECIMAL(3,3) NULL DEFAULT NULL,
  endLongitude DECIMAL(3,3) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (streetID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.IntersectionStreet
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.IntersectionStreet (
  intersectionStreetID VARCHAR(36) NOT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  streetID VARCHAR(36) NULL DEFAULT NULL,
  streetPostmile DECIMAL(3,2) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (intersectionStreetID),
  INDEX intStreetIntFK_idx (intersectionID ASC) VISIBLE,
  INDEX intStreetStreetK_idx (streetID ASC) VISIBLE,
  CONSTRAINT intStreetIntFK
    FOREIGN KEY (intersectionID)
    REFERENCES signal_dev1.Intersection (intersectionID),
  CONSTRAINT intStreetStreetFK
    FOREIGN KEY (streetID)
    REFERENCES signal_dev1.Street (streetID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.Node
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.Node (
  nodeID VARCHAR(36) NOT NULL,
  nodeDescription VARCHAR(100) NULL DEFAULT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  ipAddress VARCHAR(20) NULL DEFAULT NULL,
  isAlive BINARY(1) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (nodeID),
  INDEX nodeIntersectionFK_idx (intersectionID ASC) VISIBLE,
  CONSTRAINT nodeIntersectionFK
    FOREIGN KEY (intersectionID)
    REFERENCES signal_dev1.Intersection (intersectionID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.LightStateRef
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.LightStateRef (
  lightStateRefID VARCHAR(36) NOT NULL,
  state VARCHAR(100) NOT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (lightStateRefID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.Light
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.Light (
  lightID VARCHAR(36) NOT NULL,
  nodeID VARCHAR(36) NULL DEFAULT NULL,
  lightPhase INT NULL DEFAULT NULL,
  lightRowID INT NULL DEFAULT NULL,
  state VARCHAR(100) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (lightID),
  INDEX lightNodeFK_idx (nodeID ASC) VISIBLE,
  INDEX lightStateFK_idx (state ASC) VISIBLE,
  CONSTRAINT lightNodeFK
    FOREIGN KEY (nodeID)
    REFERENCES signal_dev1.Node (nodeID),
  CONSTRAINT lightStateFK
    FOREIGN KEY (state)
    REFERENCES signal_dev1.LightStateRef (lightStateRefID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.PhaseType
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.PhaseType (
  phaseTypeID VARCHAR(36) NOT NULL,
  phaseTypeDescription VARCHAR(100) NULL DEFAULT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (phaseTypeID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.Phase
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.Phase (
  phaseID VARCHAR(36) NOT NULL,
  phaseTypeID VARCHAR(36) NULL DEFAULT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  phaseRowID INT NULL DEFAULT NULL,
  PRIMARY KEY (phaseID),
  INDEX phaseIntersectionFK_idx (intersectionID ASC) VISIBLE,
  INDEX phaseTypeFK_idx (phaseTypeID ASC) VISIBLE,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  CONSTRAINT phaseIntersectionFK
    FOREIGN KEY (intersectionID)
    REFERENCES signal_dev1.Intersection (intersectionID),
  CONSTRAINT phaseTypeFK
    FOREIGN KEY (phaseTypeID)
    REFERENCES signal_dev1.PhaseType (phaseTypeID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table signal_dev1.ImageFileName
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS signal_dev1.ImageFileName (
	imageFileNameID VARCHAR(36) NOT NULL,
  img VARCHAR(100) NOT NULL,
  isDeleted BINARY(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (imageFileNameID))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
