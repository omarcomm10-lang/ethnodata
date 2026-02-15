/*
  Warnings:

  - You are about to drop the column `entryId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `Validation` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Validation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Validation` table. All the data in the column will be lost.
  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EthnoDataEntry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[validatorId,itemId]` on the table `Validation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decision` to the `Validation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Validation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validatorId` to the `Validation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ValidationDecision" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_CHANGES');

-- DropForeignKey
ALTER TABLE "EthnoDataEntry" DROP CONSTRAINT "EthnoDataEntry_authorId_fkey";

-- DropForeignKey
ALTER TABLE "EthnoDataEntry" DROP CONSTRAINT "EthnoDataEntry_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_entryId_fkey";

-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_entryId_fkey";

-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_userId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "entryId",
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "uploadedById" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Validation" DROP COLUMN "entryId",
DROP COLUMN "level",
DROP COLUMN "userId",
ADD COLUMN     "decision" "ValidationDecision" NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "validatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Community";

-- DropTable
DROP TABLE "EthnoDataEntry";

-- CreateTable
CREATE TABLE "EthnoDataItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "EthnoDataStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "ConfidentialityLevel" NOT NULL DEFAULT 'PUBLIC',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EthnoDataItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Validation_validatorId_idx" ON "Validation"("validatorId");

-- CreateIndex
CREATE INDEX "Validation_itemId_idx" ON "Validation"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Validation_validatorId_itemId_key" ON "Validation"("validatorId", "itemId");

-- AddForeignKey
ALTER TABLE "EthnoDataItem" ADD CONSTRAINT "EthnoDataItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "EthnoDataItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "EthnoDataItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
