SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Table Intersection
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Intersection (
  intersectionID VARCHAR(36) NOT NULL,
  latitude DECIMAL(3,3) NULL DEFAULT NULL,
  longitude DECIMAL(3,3) NULL DEFAULT NULL,
  PRIMARY KEY (intersectionID));


-- -----------------------------------------------------
-- Table signa_dev1.Street
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Street (
  streetID VARCHAR(36) NOT NULL,
  streetName VARCHAR(45) NULL DEFAULT NULL,
  streetDirection VARCHAR(45) NULL DEFAULT NULL,
  beginLatitude DECIMAL(3,3) NULL DEFAULT NULL,
  beginLongitude DECIMAL(3,3) NULL DEFAULT NULL,
  endLatitude DECIMAL(3,3) NULL DEFAULT NULL,
  endLongitude DECIMAL(3,3) NULL DEFAULT NULL,
  PRIMARY KEY (streetID));


-- -----------------------------------------------------
-- Table IntersectionStreet
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS IntersectionStreet (
  intersectionStreetID VARCHAR(36) NOT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  streetID VARCHAR(36) NULL DEFAULT NULL,
  streetPostmile DECIMAL(3,2) NULL DEFAULT NULL,
  PRIMARY KEY (intersectionStreetID),
  INDEX intStreetIntFK_idx (intersectionID ASC) VISIBLE,
  INDEX intStreetStreetK_idx (streetID ASC) VISIBLE,
  CONSTRAINT intStreetIntFK
    FOREIGN KEY (intersectionID)
    REFERENCES Intersection (intersectionID),
  CONSTRAINT intStreetStreetFK
    FOREIGN KEY (streetID)
    REFERENCES Street (streetID));


-- -----------------------------------------------------
-- Table Node
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Node (
  nodeID VARCHAR(36) NOT NULL,
  nodeDescription VARCHAR(100) NULL DEFAULT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  ipAddress VARCHAR(20) NULL DEFAULT NULL,
  isAlive BINARY(1) NULL DEFAULT NULL,
  PRIMARY KEY (nodeID),
  INDEX nodeIntersectionFK_idx (intersectionID ASC) VISIBLE,
  CONSTRAINT nodeIntersectionFK
    FOREIGN KEY (intersectionID)
    REFERENCES Intersection (intersectionID));


-- -----------------------------------------------------
-- Table LightStateRef
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS LightStateRef (
  lightStateRefID VARCHAR(36) NOT NULL,
  state VARCHAR(100) NOT NULL,
  PRIMARY KEY (lightStateRefID));


-- -----------------------------------------------------
-- Table Light
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Light (
  lightID VARCHAR(36) NOT NULL,
  nodeID VARCHAR(36) NULL DEFAULT NULL,
  lightPhase INT NULL DEFAULT NULL,
  lightRowID INT NULL DEFAULT NULL,
  state VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (lightID),
  INDEX lightNodeFK_idx (nodeID ASC) VISIBLE,
  INDEX lightStateFK_idx (state ASC) VISIBLE,
  CONSTRAINT lightNodeFK
    FOREIGN KEY (nodeID)
    REFERENCES Node (nodeID),
  CONSTRAINT lightStateFK
    FOREIGN KEY (state)
    REFERENCES LightStateRef (lightStateRefID));


-- -----------------------------------------------------
-- Table PhaseType
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PhaseType (
  phaseTypeID VARCHAR(36) NOT NULL,
  phaseTypeDescription VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (phaseTypeID));


-- -----------------------------------------------------
-- Table Phase
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Phase (
  phaseID VARCHAR(36) NOT NULL,
  phaseTypeID VARCHAR(36) NULL DEFAULT NULL,
  intersectionID VARCHAR(36) NULL DEFAULT NULL,
  phaseRowID INT NULL DEFAULT NULL,
  PRIMARY KEY (phaseID),
  INDEX phaseIntersectionFK_idx (intersectionID ASC) VISIBLE,
  INDEX phaseTypeFK_idx (phaseTypeID ASC) VISIBLE,
  CONSTRAINT phaseIntersectionFK
    FOREIGN KEY (intersectionID)
    REFERENCES Intersection (intersectionID),
  CONSTRAINT phaseTypeFK
    FOREIGN KEY (phaseTypeID)
    REFERENCES PhaseType (phaseTypeID));


  -- -----------------------------------------------------
  -- Table ImageFileName
  -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ImageFileName (
	imageFileNameID VARCHAR(36) NOT NULL,
  img VARCHAR(100) NOT NULL,
  PRIMARY KEY (imageFileNameID))


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
