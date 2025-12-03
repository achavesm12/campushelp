/*
  Warnings:

  - The values [TICKET_STATUS_CHANGE] on the enum `Notificacion_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `notificacion` MODIFY `tipo` ENUM('LOGIN', 'TICKET_ASSIGNED', 'TICKET_STATUS', 'TICKET_CLOSED', 'TICKET_PROGRESS') NOT NULL;
