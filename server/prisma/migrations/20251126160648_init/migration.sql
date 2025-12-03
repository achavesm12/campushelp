/*
  Warnings:

  - You are about to alter the column `tipo` on the `notificacion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `notificacion` ADD COLUMN `actorId` INTEGER NULL,
    ADD COLUMN `descripcion` VARCHAR(191) NULL,
    ADD COLUMN `ticketId` INTEGER NULL,
    MODIFY `tipo` ENUM('LOGIN', 'TICKET_STATUS_CHANGE') NOT NULL;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
