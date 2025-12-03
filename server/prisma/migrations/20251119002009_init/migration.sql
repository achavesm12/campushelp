/*
  Warnings:

  - You are about to drop the column `historialId` on the `ticketimagen` table. All the data in the column will be lost.
  - Made the column `fromStatus` on table `tickethistorial` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nota` on table `tickethistorial` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ticketHistorialId` to the `TicketImagen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticketimagen` DROP FOREIGN KEY `TicketImagen_historialId_fkey`;

-- DropIndex
DROP INDEX `TicketImagen_historialId_fkey` ON `ticketimagen`;

-- AlterTable
ALTER TABLE `tickethistorial` MODIFY `fromStatus` ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL,
    MODIFY `nota` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ticketimagen` DROP COLUMN `historialId`,
    ADD COLUMN `ticketHistorialId` INTEGER NOT NULL,
    ALTER COLUMN `url` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `TicketImagen` ADD CONSTRAINT `TicketImagen_ticketHistorialId_fkey` FOREIGN KEY (`ticketHistorialId`) REFERENCES `TicketHistorial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
