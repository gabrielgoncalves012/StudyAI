/*
  Warnings:

  - You are about to drop the column `resposta` on the `Questoes` table. All the data in the column will be lost.
  - Added the required column `correta` to the `Questoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Questoes" DROP COLUMN "resposta",
ADD COLUMN     "correta" TEXT NOT NULL;
