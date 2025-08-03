/*
  Warnings:

  - You are about to drop the column `otpExpery` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "otpExpery",
ADD COLUMN     "otpExpiry" TIMESTAMP(6);
