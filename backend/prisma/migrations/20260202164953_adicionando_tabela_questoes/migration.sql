/*
  Warnings:

  - Added the required column `banca` to the `Questoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Questoes" ADD COLUMN     "banca" TEXT NOT NULL;
