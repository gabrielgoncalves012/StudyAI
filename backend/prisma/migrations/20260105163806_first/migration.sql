-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cronograma" (
    "id" TEXT NOT NULL,
    "concurso" TEXT NOT NULL,
    "banca" TEXT NOT NULL,
    "emojCode" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "accessDate" TEXT NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "arquiveHtml" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Cronograma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Cronograma" ADD CONSTRAINT "Cronograma_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
