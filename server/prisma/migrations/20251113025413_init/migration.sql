/*
  Warnings:

  - Added the required column `prioridadId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `prioridadId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Prioridad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Prioridad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_prioridadId_fkey` FOREIGN KEY (`prioridadId`) REFERENCES `Prioridad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
