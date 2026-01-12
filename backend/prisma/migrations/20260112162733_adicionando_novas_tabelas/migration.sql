/*
  Warnings:

  - You are about to drop the column `arquiveHtml` on the `Cronograma` table. All the data in the column will be lost.
  - You are about to drop the column `banca` on the `Cronograma` table. All the data in the column will be lost.
  - Added the required column `topicFinished` to the `Cronograma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicLength` to the `Cronograma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cronograma" DROP COLUMN "arquiveHtml",
DROP COLUMN "banca",
ADD COLUMN     "topicFinished" INTEGER NOT NULL,
ADD COLUMN     "topicLength" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "finished" INTEGER NOT NULL,
    "cronograma_id" TEXT NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "disciplina_id" TEXT NOT NULL,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planejamento" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "diciplina" TEXT NOT NULL,
    "topics" TEXT[],
    "cronograma_id" TEXT NOT NULL,

    CONSTRAINT "Planejamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_cronograma_id_fkey" FOREIGN KEY ("cronograma_id") REFERENCES "Cronograma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planejamento" ADD CONSTRAINT "Planejamento_cronograma_id_fkey" FOREIGN KEY ("cronograma_id") REFERENCES "Cronograma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
