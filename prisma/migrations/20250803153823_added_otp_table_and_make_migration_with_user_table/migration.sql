/*
  Warnings:

  - You are about to drop the column `otpCode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[otpId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "otpCode",
DROP COLUMN "otpExpiry",
ADD COLUMN     "otpId" INTEGER;

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "otpCode" VARCHAR(6),
    "otpExpiry" TIMESTAMP(6),
    "otpCount" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_otpId_key" ON "user"("otpId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_otpId_fkey" FOREIGN KEY ("otpId") REFERENCES "otp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
