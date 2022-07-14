/*
  Warnings:

  - Added the required column `message` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" ADD COLUMN     "message" STRING NOT NULL;
