/*
  Warnings:

  - You are about to alter the column `sold` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - Made the column `roleId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_roleId_fkey`;

-- DropIndex
DROP INDEX `users_roleId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `products` MODIFY `image` VARCHAR(255) NULL,
    MODIFY `sold` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` MODIFY `roleId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
