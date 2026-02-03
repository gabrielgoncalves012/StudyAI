-- CreateTable
CREATE TABLE "Questoes" (
    "id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" TEXT[],
    "resposta" TEXT NOT NULL,
    "ano_aproximado" INTEGER NOT NULL,
    "dificuldade" TEXT NOT NULL,
    "topico_especifico" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "topico" TEXT NOT NULL,

    CONSTRAINT "Questoes_pkey" PRIMARY KEY ("id")
);
