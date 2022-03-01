SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema Initial
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Initial
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Initial` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `Initial` ;

-- -----------------------------------------------------
-- Table `Initial`.`Intersection`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`Intersection` (
  `intersectionID` VARCHAR(36) NOT NULL,
  `latitude` DECIMAL(3,0) NULL DEFAULT NULL,
  `longitude` DECIMAL(3,0) NULL DEFAULT NULL,
  PRIMARY KEY (`intersectionID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`Street`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`Street` (
  `streetID` VARCHAR(36) NOT NULL,
  `streetName` VARCHAR(45) NULL DEFAULT NULL,
  `streetDirection` VARCHAR(45) NULL DEFAULT NULL,
  `beginLatitude` DECIMAL(3,0) NULL DEFAULT NULL,
  `beginLongitude` DECIMAL(3,0) NULL DEFAULT NULL,
  `endLatitude` DECIMAL(3,0) NULL DEFAULT NULL,
  `endLongitude` DECIMAL(3,0) NULL DEFAULT NULL,
  PRIMARY KEY (`streetID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`IntersectionStreet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`IntersectionStreet` (
  `intersectionStreetID` VARCHAR(36) NOT NULL,
  `intersectionID` VARCHAR(36) NULL DEFAULT NULL,
  `streetID` VARCHAR(36) NULL DEFAULT NULL,
  `streetPostmile` DECIMAL(2,0) NULL DEFAULT NULL,
  PRIMARY KEY (`intersectionStreetID`),
  INDEX `intStreetIntFK_idx` (`intersectionID` ASC) VISIBLE,
  INDEX `intStreetStreetFK_idx` (`streetID` ASC) VISIBLE,
  CONSTRAINT `intStreetIntFK`
    FOREIGN KEY (`intersectionID`)
    REFERENCES `Initial`.`Intersection` (`intersectionID`),
  CONSTRAINT `intStreetStreetFK`
    FOREIGN KEY (`streetID`)
    REFERENCES `Initial`.`Street` (`streetID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`Node`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`Node` (
  `nodeID` VARCHAR(36) NOT NULL,
  `nodeDescription` VARCHAR(100) NULL DEFAULT NULL,
  `intersectionID` VARCHAR(36) NULL DEFAULT NULL,
  `ipAddress` VARCHAR(20) NULL DEFAULT NULL,
  `isAlive` BINARY(1) NULL DEFAULT NULL,
  PRIMARY KEY (`nodeID`),
  INDEX `nodeIntersectionFK_idx` (`intersectionID` ASC) VISIBLE,
  CONSTRAINT `nodeIntersectionFK`
    FOREIGN KEY (`intersectionID`)
    REFERENCES `Initial`.`Intersection` (`intersectionID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`LightStateRef`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`LightStateRef` (
  `lightStateRefID` VARCHAR(36) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`lightStateRefID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`Light`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`Light` (
  `lightID` VARCHAR(36) NOT NULL,
  `nodeID` VARCHAR(36) NULL DEFAULT NULL,
  `lightPhase` VARCHAR(45) NULL DEFAULT NULL,
  `lightTypeID` INT NULL DEFAULT NULL,
  `state` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`lightID`),
  INDEX `lightNodeFK_idx` (`nodeID` ASC) VISIBLE,
  INDEX `lightStateFK_idx` (`state` ASC) VISIBLE,
  CONSTRAINT `lightNodeFK`
    FOREIGN KEY (`nodeID`)
    REFERENCES `Initial`.`Node` (`nodeID`),
  CONSTRAINT `lightStateFK`
    FOREIGN KEY (`state`)
    REFERENCES `Initial`.`LightStateRef` (`lightStateRefID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`PhaseType`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`PhaseType` (
  `phaseTypeID` VARCHAR(36) NOT NULL,
  `phaseTypeDescription` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`phaseTypeID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Initial`.`Phase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Initial`.`Phase` (
  `phaseID` VARCHAR(36) NOT NULL,
  `phaseTypeID` VARCHAR(36) NULL DEFAULT NULL,
  `intersectionID` VARCHAR(36) NULL DEFAULT NULL,
  PRIMARY KEY (`phaseID`),
  INDEX `phaseIntersectionFK_idx` (`intersectionID` ASC) VISIBLE,
  INDEX `phaseTypeFK_idx` (`phaseTypeID` ASC) VISIBLE,
  CONSTRAINT `phaseIntersectionFK`
    FOREIGN KEY (`intersectionID`)
    REFERENCES `Initial`.`Intersection` (`intersectionID`),
  CONSTRAINT `phaseTypeFK`
    FOREIGN KEY (`phaseTypeID`)
    REFERENCES `Initial`.`PhaseType` (`phaseTypeID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
