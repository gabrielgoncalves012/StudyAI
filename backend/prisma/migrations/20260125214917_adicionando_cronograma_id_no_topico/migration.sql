-- AlterTable
ALTER TABLE "Topico" ADD COLUMN     "cronograma_id" TEXT NOT NULL DEFAULT '346b35b5-8e01-43a3-b029-576ea26d6776';

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_cronograma_id_fkey" FOREIGN KEY ("cronograma_id") REFERENCES "Cronograma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
